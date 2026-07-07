import {
  customType,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Database schema (MySQL/MariaDB on Hostinger).
 * Migrations are generated with `npm run db:generate` into ./drizzle and
 * applied with `npm run db:migrate`.
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

export const VACANCY_STATUSES = ["draft", "open", "closed"] as const;
export type VacancyStatus = (typeof VACANCY_STATUSES)[number];

export const vacancies = mysqlTable("vacancies", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  department: varchar("department", { length: 120 }).notNull().default(""),
  location: varchar("location", { length: 160 })
    .notNull()
    .default("Apaseo el Grande, Guanajuato"),
  employmentType: varchar("employment_type", { length: 60 }).notNull().default("Tiempo completo"),
  summary: varchar("summary", { length: 500 }).notNull().default(""),
  description: text("description").notNull(),
  requirements: jsonColumn<string[]>("requirements").notNull(),
  benefits: jsonColumn<string[]>("benefits").notNull(),
  salaryRange: varchar("salary_range", { length: 120 }),
  status: mysqlEnum("status", VACANCY_STATUSES).notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const APPLICATION_STATUSES = ["new", "reviewing", "finalist", "hired", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

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

export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

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

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export type Vacancy = typeof vacancies.$inferSelect;
export type NewVacancy = typeof vacancies.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
