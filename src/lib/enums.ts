/**
 * Enum values shared by the database schema and the forms that edit them.
 *
 * They live here rather than in `db/schema.ts` on purpose: the forms are
 * client components, and importing a *value* from the schema drags
 * `drizzle-orm/mysql-core` (plus the longblob/json custom types) into the
 * browser bundle — 15 KB gzipped of an ORM that can never run there. This
 * module has no imports at all, so it costs a few bytes and nothing else.
 *
 * `db/schema.ts` builds its mysqlEnum columns from these same arrays, so the
 * database and the <select> options can never drift apart.
 */

export const VACANCY_STATUSES = ["draft", "open", "closed"] as const;
export type VacancyStatus = (typeof VACANCY_STATUSES)[number];

/**
 * Employment type, work mode and salary period are stored as the schema.org
 * enum values rather than Spanish text ON PURPOSE: Google Jobs, Indeed and the
 * XML feed the other boards consume read these verbatim. The Spanish wording a
 * candidate sees lives in `@/lib/labels`, so the copy can change without ever
 * breaking a listing.
 */
export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACTOR",
  "TEMPORARY",
  "INTERN",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const WORK_MODES = ["onsite", "hybrid", "remote"] as const;
export type WorkMode = (typeof WORK_MODES)[number];

/** schema.org MonetaryAmount unitText values. */
export const SALARY_PERIODS = ["HOUR", "DAY", "WEEK", "MONTH", "YEAR"] as const;
export type SalaryPeriod = (typeof SALARY_PERIODS)[number];

export const APPLICATION_STATUSES = ["new", "reviewing", "finalist", "hired", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STOCK_FORMS = ["Molido", "Pellet", "Original"] as const;
export type StockForm = (typeof STOCK_FORMS)[number];

export const STOCK_AVAILABILITY = ["Disponible", "Bajo pedido", "Consultar"] as const;
export type StockAvailability = (typeof STOCK_AVAILABILITY)[number];

/**
 * Panel access area. `admin` keeps the whole panel (and is the default so
 * existing accounts don't lose access when the column lands); `marketing`
 * and `rrhh` only ever see their own portal.
 */
export const ADMIN_ROLES = ["admin", "marketing", "rrhh"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * The site's two outgoing email flows — which is to say, whose data the
 * message carries. Every logged send is attributed to one of them, and that
 * attribution is what scopes the delivery log by area: Marketing reads the
 * `leads` rows, RRHH the `applications` rows, and neither sees the other's.
 */
export const NOTIFICATION_FLOWS = ["leads", "applications"] as const;
export type NotificationFlow = (typeof NOTIFICATION_FLOWS)[number];

/**
 * What kind of message it was, which is independent of whose flow it belongs
 * to. Kept as its own column rather than folded into the flow: an
 * acknowledgement to a candidate is still RRHH's data, and collapsing the two
 * into one enum is what would let a Marketing account read it.
 */
export const EMAIL_KINDS = ["notification", "acknowledgement", "test"] as const;
export type EmailKind = (typeof EMAIL_KINDS)[number];

/**
 * Outcome of a send attempt. `skipped` is a first-class result, not an error:
 * a flow with notifications turned off — or with no recipients captured —
 * deliberately sends nothing, and the log has to say so rather than leave a
 * silence that reads like a failure.
 */
export const EMAIL_STATUSES = ["sent", "failed", "skipped"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];
