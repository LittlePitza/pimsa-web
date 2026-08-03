import type { AdminRole } from "@/db/schema";

/**
 * Panel areas. Marketing and RRHH each own a portal and never see the other's
 * data; `admin` (the default role, and every super-admin) sees both.
 *
 * This module is pure data + predicates — no DB, no cookies — so the nav
 * (client) and the guards (server) agree on exactly one definition of who
 * sees what.
 */

export type Area = "marketing" | "rrhh";

export const AREAS = ["marketing", "rrhh"] as const satisfies readonly Area[];

export const roleLabels: Record<AdminRole, string> = {
  admin: "Panel completo",
  marketing: "Marketing",
  rrhh: "Recursos Humanos",
};

/** Shown next to the role picker so whoever creates the account knows the scope. */
export const roleDescriptions: Record<AdminRole, string> = {
  admin: "Ve todas las áreas, la configuración completa y el panel general.",
  marketing: "Solo su portal: leads, catálogo de stock y sus correos.",
  rrhh: "Solo su portal: vacantes, postulaciones, CVs y sus correos.",
};

/** Section headings used by the nav and the account cards. */
export const areaLabels: Record<Area, string> = {
  marketing: "Marketing",
  rrhh: "Recursos Humanos",
};

/** Landing page per area — where login, the logo and every bounce point. */
const areaHome: Record<Area, string> = {
  marketing: "/admin/marketing",
  rrhh: "/admin/rrhh",
};

/**
 * Narrows an unknown value to a role. The database column is an enum, but a
 * schema/deploy mismatch (or a NULL from an older row) can still hand us
 * something else — and every function below must stay total, because they run
 * inside the panel layout where a throw takes down the whole panel.
 */
export function isAdminRole(value: unknown): value is AdminRole {
  return value === "admin" || value === "marketing" || value === "rrhh";
}

/** True when the role may enter that area's portal. */
export function canAccess(role: AdminRole, area: Area): boolean {
  return role === "admin" || role === area;
}

/** True for accounts that see the whole panel (general dashboard included). */
export function isFullPanel(role: AdminRole): boolean {
  return role === "admin";
}

/**
 * The role's own front door. Marketing/RRHH never land on the general panel.
 * Total on purpose: this feeds a <Link href>, and an undefined href throws
 * inside the panel layout — which no error boundary below it can catch.
 */
export function homeFor(role: AdminRole): string {
  return role === "marketing" || role === "rrhh" ? areaHome[role] : "/admin";
}

/** Nav links owned by each area, in display order. */
export const areaLinks: Record<Area, { label: string; href: string; hub?: boolean }[]> = {
  marketing: [
    { label: "Marketing", href: "/admin/marketing", hub: true },
    { label: "Leads", href: "/admin/leads" },
    { label: "Stock", href: "/admin/stock" },
  ],
  rrhh: [
    { label: "RRHH", href: "/admin/rrhh", hub: true },
    { label: "Vacantes", href: "/admin/vacantes" },
    { label: "Postulaciones", href: "/admin/postulaciones" },
  ],
};

/** The email flow each area owns on the Configuración page. */
export const areaEmailFlow: Record<Area, "leads" | "applications"> = {
  marketing: "leads",
  rrhh: "applications",
};
