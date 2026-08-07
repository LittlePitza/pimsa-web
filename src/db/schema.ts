import {
  boolean,
  customType,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import {
  ADMIN_ROLES,
  APPLICATION_STATUSES,
  EMAIL_KINDS,
  EMAIL_STATUSES,
  EMPLOYMENT_TYPES,
  LEAD_STATUSES,
  NOTIFICATION_FLOWS,
  SALARY_PERIODS,
  STOCK_AVAILABILITY,
  STOCK_FORMS,
  VACANCY_STATUSES,
  WORK_MODES,
} from "@/lib/enums";

/**
 * Database schema (MySQL/MariaDB on Hostinger).
 * Migrations are generated with `npm run db:generate` into ./drizzle and
 * applied with `npm run db:migrate`.
 *
 * The enum *values* live in `@/lib/enums` because the forms that edit them
 * are client components — importing them from here would ship drizzle to the
 * browser. Import them from there, never from this file.
 */

/** LONGBLOB column for CV files (kept in DB so Git redeploys never wipe them). */
const longblob = customType<{ data: Buffer }>({
  dataType() {
    return "longblob";
  },
});

/**
 * JSON column that works on both MySQL and MariaDB: MariaDB stores JSON as
 * LONGTEXT and returns strings, while MySQL returns parsed objects — so we
 * parse defensively on read and always stringify on write.
 */
const jsonColumn = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "json";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
    fromDriver(value: string | TData): TData {
      return typeof value === "string" ? (JSON.parse(value) as TData) : value;
    },
  })(name);

/**
 * Vacancies double as the source for the job boards: /jobs.xml and the
 * JobPosting JSON-LD are generated from these rows, which is why the place,
 * the pay and the closing date are stored as discrete values instead of the
 * free text a person would type. Google, Indeed and Computrabajo match
 * candidates on those fields; a single "Apaseo el Grande, Guanajuato" string
 * or a "$12,000 a $15,000 mensuales" note cannot be parsed back reliably.
 */
export const vacancies = mysqlTable("vacancies", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  department: varchar("department", { length: 120 }).notNull().default(""),
  city: varchar("city", { length: 120 }).notNull().default("Apaseo el Grande"),
  region: varchar("region", { length: 120 }).notNull().default("Guanajuato"),
  /** Blank falls back to the plant's postal code when the city is the plant's. */
  postalCode: varchar("postal_code", { length: 12 }).notNull().default(""),
  workMode: mysqlEnum("work_mode", WORK_MODES).notNull().default("onsite"),
  employmentType: mysqlEnum("employment_type", EMPLOYMENT_TYPES).notNull().default("FULL_TIME"),
  summary: varchar("summary", { length: 500 }).notNull().default(""),
  description: text("description").notNull(),
  requirements: jsonColumn<string[]>("requirements").notNull(),
  benefits: jsonColumn<string[]>("benefits").notNull(),
  salaryMin: int("salary_min"),
  salaryMax: int("salary_max"),
  salaryPeriod: mysqlEnum("salary_period", SALARY_PERIODS).notNull().default("MONTH"),
  /**
   * Free-text fallback ("Sueldo a tratar"), used only when no amounts are
   * captured. The structured columns win everywhere so the page and the feeds
   * can never quote two different salaries.
   */
  salaryRange: varchar("salary_range", { length: 120 }),
  openings: int("openings").notNull().default(1),
  /** Explicit close date; blank falls back to publishedAt + 60 days. */
  expiresAt: timestamp("expires_at"),
  status: mysqlEnum("status", VACANCY_STATUSES).notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  /** Nullable: vacancy may be deleted later; title snapshot keeps context. */
  vacancyId: int("vacancy_id").references(() => vacancies.id, { onDelete: "set null" }),
  vacancyTitle: varchar("vacancy_title", { length: 160 }).notNull().default(""),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull().default(""),
  message: text("message").notNull(),
  status: mysqlEnum("status", APPLICATION_STATUSES).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** CV stored separately so application listings never load the blob. */
export const applicationFiles = mysqlTable("application_files", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("application_id")
    .notNull()
    .unique()
    .references(() => applications.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: int("size").notNull(),
  data: longblob("data").notNull(),
});

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  company: varchar("company", { length: 120 }).notNull().default(""),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull().default(""),
  service: varchar("service", { length: 120 }).notNull().default(""),
  message: text("message").notNull(),
  utm: jsonColumn<Record<string, string>>("utm"),
  ip: varchar("ip", { length: 64 }).notNull().default(""),
  status: mysqlEnum("status", LEAD_STATUSES).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Plastic stock catalog — managed from the admin panel, shown on /stock. */
export const stockItems = mysqlTable("stock_items", {
  id: int("id").autoincrement().primaryKey(),
  material: varchar("material", { length: 120 }).notNull(),
  form: mysqlEnum("form", STOCK_FORMS).notNull(),
  color: varchar("color", { length: 60 }).notNull().default(""),
  availability: mysqlEnum("availability", STOCK_AVAILABILITY).notNull().default("Consultar"),
  notes: varchar("notes", { length: 300 }).notNull().default(""),
  /** Unpublished items stay visible only in the admin panel. */
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

/** Simple key-value settings editable from the admin panel. */
export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

/**
 * Every outgoing send attempt, successful or not.
 *
 * Notifications are best-effort by design — a lead is stored before anyone
 * tries to email it, so a bounced SMTP call never costs the company the
 * enquiry. The cost of that choice is silence: without this table the only
 * trace of a failed delivery is a line in the server log nobody reads, and
 * "no llegó el correo" has no answer. Kept deliberately small (no bodies, no
 * attachments) so it can be written on every send without growing unbounded.
 *
 * `flow` and `kind` are separate columns because they answer different
 * questions: `flow` is whose data the message carries, and it is what scopes
 * this table by area; `kind` is what the message was. An acknowledgement sent
 * to a candidate is `applications` + `acknowledgement` — RRHH's row, readable
 * by RRHH, however the panel chooses to label it.
 */
export const emailLog = mysqlTable(
  "email_log",
  {
    id: int("id").autoincrement().primaryKey(),
    flow: mysqlEnum("flow", NOTIFICATION_FLOWS).notNull(),
    kind: mysqlEnum("kind", EMAIL_KINDS).notNull().default("notification"),
    status: mysqlEnum("status", EMAIL_STATUSES).notNull(),
    recipients: varchar("recipients", { length: 500 }).notNull().default(""),
    subject: varchar("subject", { length: 255 }).notNull().default(""),
    /** Error message when failed, or the reason when skipped. */
    detail: varchar("detail", { length: 500 }).notNull().default(""),
    durationMs: int("duration_ms").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  // The panel only ever reads this newest-first, and the health strip counts
  // a 24-hour window — both are index scans on this column alone.
  (table) => [index("email_log_created_at_idx").on(table.createdAt)],
);

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  role: mysqlEnum("role", ADMIN_ROLES).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

/**
 * Re-exported so `@/db/schema` stays the single import for *types* on the
 * server. Types are erased at compile time, so this never reaches a bundle.
 */
export type {
  AdminRole,
  ApplicationStatus,
  EmailKind,
  EmailStatus,
  LeadStatus,
  NotificationFlow,
  StockAvailability,
  StockForm,
  VacancyStatus,
} from "@/lib/enums";

export type Vacancy = typeof vacancies.$inferSelect;
export type NewVacancy = typeof vacancies.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type StockItem = typeof stockItems.$inferSelect;
export type NewStockItem = typeof stockItems.$inferInsert;
export type EmailLogEntry = typeof emailLog.$inferSelect;
export type NewEmailLogEntry = typeof emailLog.$inferInsert;
