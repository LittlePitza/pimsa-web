import { eq } from "drizzle-orm";
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
