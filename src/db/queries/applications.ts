import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  applicationFiles,
  applications,
  type Application,
  type ApplicationStatus,
} from "@/db/schema";

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

export async function listApplications(): Promise<ApplicationListItem[]> {
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
    .orderBy(desc(applications.createdAt));
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

export async function countApplicationsByStatus(status: ApplicationStatus): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(applications)
    .where(eq(applications.status, status));
  return row?.value ?? 0;
}
