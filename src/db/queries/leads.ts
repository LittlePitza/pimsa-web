import { count, desc, gte, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, type Lead, type LeadStatus, type NewLead } from "@/db/schema";
import { LEAD_STATUSES } from "@/lib/enums";
import { emptyStatusRecord, type StatusCounts } from "@/lib/metrics";

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

/**
 * Rows for the tables and lists. Always bounded: the dashboards only ever
 * render a handful, and an unbounded SELECT would grow into a slow page and a
 * memory spike as the inbox fills up over the years.
 */
export async function listLeads(limit: number): Promise<Lead[]> {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}

/** Newest `limit` leads — the "últimos leads" cards. */
export async function recentLeads(limit: number): Promise<Lead[]> {
  return listLeads(limit);
}

/**
 * Rows since a date, for the charts. The trend and the breakdowns only ever
 * show the last few months, so there is no reason to read older rows.
 */
export async function leadsSince(since: Date): Promise<Lead[]> {
  return db.select().from(leads).where(gte(leads.createdAt, since)).orderBy(desc(leads.createdAt));
}

/** Totals per status in one GROUP BY, instead of counting rows in memory. */
export async function leadStatusCounts(): Promise<StatusCounts<LeadStatus>> {
  const rows = await db
    .select({ status: leads.status, value: count() })
    .from(leads)
    .groupBy(leads.status);

  const byStatus = emptyStatusRecord(LEAD_STATUSES);
  let total = 0;
  for (const row of rows) {
    byStatus[row.status] = row.value;
    total += row.value;
  }
  return { total, byStatus };
}

export async function countLeads(): Promise<number> {
  const [row] = await db.select({ value: count() }).from(leads);
  return row?.value ?? 0;
}

export async function setLeadStatus(id: number, status: LeadStatus): Promise<void> {
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}
