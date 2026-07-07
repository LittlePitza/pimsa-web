import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, type Lead, type LeadStatus, type NewLead } from "@/db/schema";

/** Best-effort insert: the contact form must keep working on DB outages. */
export async function insertLeadSafe(data: NewLead): Promise<boolean> {
  try {
    await db.insert(leads).values(data);
    return true;
  } catch (error) {
    console.error("[db] insertLead failed (lead delivered by email only):", error);
    return false;
  }
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function listLeads(status?: LeadStatus): Promise<Lead[]> {
  const base = db.select().from(leads).orderBy(desc(leads.createdAt));
  return status ? base.where(eq(leads.status, status)) : base;
}

export async function setLeadStatus(id: number, status: LeadStatus): Promise<void> {
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

export async function countLeadsByStatus(status: LeadStatus): Promise<number> {
  const [row] = await db.select({ value: count() }).from(leads).where(eq(leads.status, status));
  return row?.value ?? 0;
}
