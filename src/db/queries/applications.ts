import { count, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import {
  applicationFiles,
  applications,
  type Application,
  type ApplicationStatus,
} from "@/db/schema";
import { APPLICATION_STATUSES } from "@/lib/enums";
import { emptyStatusRecord, type StatusCounts } from "@/lib/metrics";

export interface NewApplicationInput {
  vacancyId: number | null;
  vacancyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  cv: {
    fileName: string;
    mimeType: string;
    size: number;
    data: Buffer;
  } | null;
}

/** Insert an application and its CV atomically. */
export async function createApplication(input: NewApplicationInput): Promise<number> {
  return db.transaction(async (tx) => {
    const [result] = await tx.insert(applications).values({
      vacancyId: input.vacancyId,
      vacancyTitle: input.vacancyTitle,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    });

    if (input.cv) {
      await tx.insert(applicationFiles).values({
        applicationId: result.insertId,
        fileName: input.cv.fileName,
        mimeType: input.cv.mimeType,
        size: input.cv.size,
        data: input.cv.data,
      });
    }

    return result.insertId;
  });
}

// ── Admin ────────────────────────────────────────────────────────────────

export interface ApplicationListItem extends Application {
  cvFileId: number | null;
}

/**
 * Rows for the applications table, with the CV file id joined in. Bounded:
 * the join reaches a table holding LONGBLOB rows, so reading it unbounded is
 * the last thing this panel should do as the inbox grows.
 */
export async function listApplications(limit: number): Promise<ApplicationListItem[]> {
  return db
    .select({
      id: applications.id,
      vacancyId: applications.vacancyId,
      vacancyTitle: applications.vacancyTitle,
      name: applications.name,
      email: applications.email,
      phone: applications.phone,
      message: applications.message,
      status: applications.status,
      createdAt: applications.createdAt,
      cvFileId: applicationFiles.id,
    })
    .from(applications)
    .leftJoin(applicationFiles, eq(applicationFiles.applicationId, applications.id))
    .orderBy(desc(applications.createdAt))
    .limit(limit);
}

/** Newest `limit` applications — no CV join, the cards never link one. */
export async function recentApplications(limit: number): Promise<Application[]> {
  return db.select().from(applications).orderBy(desc(applications.createdAt)).limit(limit);
}

/** Rows since a date, for the trend and the per-vacancy breakdown. */
export async function applicationsSince(since: Date): Promise<Application[]> {
  return db
    .select()
    .from(applications)
    .where(gte(applications.createdAt, since))
    .orderBy(desc(applications.createdAt));
}

/** Totals per status in one GROUP BY, instead of counting rows in memory. */
export async function applicationStatusCounts(): Promise<StatusCounts<ApplicationStatus>> {
  const rows = await db
    .select({ status: applications.status, value: count() })
    .from(applications)
    .groupBy(applications.status);

  const byStatus = emptyStatusRecord(APPLICATION_STATUSES);
  let total = 0;
  for (const row of rows) {
    byStatus[row.status] = row.value;
    total += row.value;
  }
  return { total, byStatus };
}

export async function setApplicationStatus(id: number, status: ApplicationStatus): Promise<void> {
  await db.update(applications).set({ status }).where(eq(applications.id, id));
}

export async function getApplicationFile(fileId: number) {
  const rows = await db
    .select()
    .from(applicationFiles)
    .where(eq(applicationFiles.id, fileId))
    .limit(1);
  return rows[0] ?? null;
}

export async function countApplications(): Promise<number> {
  const [row] = await db.select({ value: count() }).from(applications);
  return row?.value ?? 0;
}
