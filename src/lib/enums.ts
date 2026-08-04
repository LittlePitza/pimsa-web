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
