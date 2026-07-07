import { and, asc, count, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, type AdminUser } from "@/db/schema";

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function touchLastLogin(id: number): Promise<void> {
  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, id));
}

// ── Account management (super-admin) ───────────────────────────────────────

/** Safe projection for listings — never exposes the password hash. */
export interface AdminListItem {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export async function listAdmins(): Promise<AdminListItem[]> {
  return db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      createdAt: adminUsers.createdAt,
      lastLoginAt: adminUsers.lastLoginAt,
    })
    .from(adminUsers)
    .orderBy(asc(adminUsers.createdAt));
}

export async function getAdminById(id: number): Promise<AdminUser | null> {
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return rows[0] ?? null;
}

/** True when the email already belongs to another account. */
export async function isEmailTaken(email: string, excludeId?: number): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const where =
    excludeId === undefined
      ? eq(adminUsers.email, normalized)
      : and(eq(adminUsers.email, normalized), ne(adminUsers.id, excludeId));
  const rows = await db.select({ id: adminUsers.id }).from(adminUsers).where(where).limit(1);
  return rows.length > 0;
}

export async function createAdmin(input: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<number> {
  const [result] = await db.insert(adminUsers).values({
    email: input.email.trim().toLowerCase(),
    name: input.name,
    passwordHash: input.passwordHash,
  });
  return result.insertId;
}

export async function updateAdminProfile(
  id: number,
  input: { email: string; name: string },
): Promise<void> {
  await db
    .update(adminUsers)
    .set({ email: input.email.trim().toLowerCase(), name: input.name })
    .where(eq(adminUsers.id, id));
}

export async function updateAdminPassword(id: number, passwordHash: string): Promise<void> {
  await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, id));
}

export async function deleteAdmin(id: number): Promise<void> {
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
}

export async function countAdmins(): Promise<number> {
  const [row] = await db.select({ value: count() }).from(adminUsers);
  return row?.value ?? 0;
}
