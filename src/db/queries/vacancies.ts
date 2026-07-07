import { and, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { vacancies, type NewVacancy, type Vacancy, type VacancyStatus } from "@/db/schema";

/**
 * Vacancy data layer.
 * Public readers are resilient (return empty on DB outage) so marketing
 * pages and the build never hard-fail; admin functions let errors surface.
 */

export async function getOpenVacancies(): Promise<Vacancy[]> {
  try {
    return await db
      .select()
      .from(vacancies)
      .where(eq(vacancies.status, "open"))
      .orderBy(desc(vacancies.publishedAt));
  } catch (error) {
    console.error("[db] getOpenVacancies failed:", error);
    return [];
  }
}

export async function getOpenVacancyBySlug(slug: string): Promise<Vacancy | null> {
  try {
    const rows = await db
      .select()
      .from(vacancies)
      .where(and(eq(vacancies.slug, slug), eq(vacancies.status, "open")))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[db] getOpenVacancyBySlug failed:", error);
    return null;
  }
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function listVacancies(): Promise<Vacancy[]> {
  return db.select().from(vacancies).orderBy(desc(vacancies.createdAt));
}

export async function getVacancyById(id: number): Promise<Vacancy | null> {
  const rows = await db.select().from(vacancies).where(eq(vacancies.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createVacancy(data: NewVacancy): Promise<number> {
  const [result] = await db.insert(vacancies).values(data);
  return result.insertId;
}

export async function updateVacancy(id: number, data: Partial<NewVacancy>): Promise<void> {
  await db.update(vacancies).set(data).where(eq(vacancies.id, id));
}

export async function setVacancyStatus(id: number, status: VacancyStatus): Promise<void> {
  await db
    .update(vacancies)
    .set({ status, publishedAt: status === "open" ? new Date() : undefined })
    .where(eq(vacancies.id, id));
}

export async function deleteVacancy(id: number): Promise<void> {
  await db.delete(vacancies).where(eq(vacancies.id, id));
}

export async function countVacanciesByStatus(status: VacancyStatus): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(vacancies)
    .where(eq(vacancies.status, status));
  return row?.value ?? 0;
}

/** Unique slug helper: appends -2, -3… when the base slug is taken. */
export async function ensureUniqueSlug(base: string, excludeId?: number): Promise<string> {
  let candidate = base;
  for (let i = 2; ; i++) {
    const clash = await db
      .select({ id: vacancies.id })
      .from(vacancies)
      .where(
        excludeId === undefined
          ? eq(vacancies.slug, candidate)
          : and(eq(vacancies.slug, candidate), ne(vacancies.id, excludeId)),
      )
      .limit(1);
    if (clash.length === 0) return candidate;
    candidate = `${base}-${i}`;
  }
}
