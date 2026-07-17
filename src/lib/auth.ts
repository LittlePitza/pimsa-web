import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminById } from "@/db/queries/admins";
import {
  passwordVersion,
  SESSION_COOKIE,
  SESSION_HOURS,
  verifySessionToken,
  type AdminSession,
} from "@/lib/session";

/** Server-side session helpers for the admin panel. */

/**
 * Verifies the session cookie AND that the account still exists with the
 * same password (the token's `pwv` claim). Deleting an account or resetting
 * its password therefore revokes its outstanding sessions. Memoized per
 * request with React cache so layout + page + actions share one DB lookup.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const admin = await getAdminById(session.userId);
  if (!admin) return null;
  if (session.pwv !== (await passwordVersion(admin.passwordHash))) return null;

  // Fresh values from the DB, so renames/email changes reflect immediately.
  return { userId: admin.id, email: admin.email, name: admin.name };
});

/** Guard for admin pages/actions — redirects to login when unauthenticated. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Fallback super-admin when SUPER_ADMIN_EMAILS is unset (the "sistemas" account). */
const DEFAULT_SUPER_ADMIN = "sistemas@plasticospimsa.com";

/**
 * Emails allowed to manage admin accounts. Configured via SUPER_ADMIN_EMAILS
 * (comma-separated); defaults to the sistemas account so the central panel
 * always has an owner.
 */
export function superAdminEmails(): string[] {
  const raw = process.env.SUPER_ADMIN_EMAILS;
  const list = (raw ? raw.split(",") : [DEFAULT_SUPER_ADMIN])
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return list.length > 0 ? list : [DEFAULT_SUPER_ADMIN];
}

export function isSuperAdmin(email: string): boolean {
  return superAdminEmails().includes(email.trim().toLowerCase());
}

/** Guard for account management — only super-admins; others go back to /admin. */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!isSuperAdmin(session.email)) redirect("/admin");
  return session;
}

/** Cookie options shared by login (set) and logout (clear). */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}
