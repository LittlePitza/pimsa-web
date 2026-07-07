"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  APPLICATION_STATUSES,
  LEAD_STATUSES,
  STOCK_AVAILABILITY,
  STOCK_FORMS,
  VACANCY_STATUSES,
} from "@/db/schema";
import { getAdminByEmail, touchLastLogin } from "@/db/queries/admins";
import { setApplicationStatus } from "@/db/queries/applications";
import { setLeadStatus } from "@/db/queries/leads";
import {
  createStockItem,
  deleteStockItem,
  setStockItemPublished,
  updateStockItem,
} from "@/db/queries/stock";
import {
  createVacancy,
  deleteVacancy,
  ensureUniqueSlug,
  setVacancyStatus,
  updateVacancy,
} from "@/db/queries/vacancies";
import { requireAdmin, sessionCookieOptions } from "@/lib/auth";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { SETTING_KEYS, setSetting } from "@/lib/settings";
import { slugify } from "@/lib/utils";

/** Server actions for the admin panel. Every mutation re-checks the session. */

export interface ActionState {
  error?: string;
  success?: string;
}

// ── Auth ─────────────────────────────────────────────────────────────────

export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  let admin;
  try {
    admin = await getAdminByEmail(email);
  } catch (error) {
    console.error("[admin] Login DB error:", error);
    return { error: "No se pudo verificar la sesión. Intenta más tarde." };
  }

  // Compare against a dummy hash when the user doesn't exist to keep
  // timing consistent (no user enumeration).
  const hash = admin?.passwordHash ?? "$2a$12$C6UzMDM.H6dfI/f/IKcEeO6t2mPqXW1Uh3q0aX9x0e1a2b3c4d5e6";
  const valid = await bcrypt.compare(password, hash);

  if (!admin || !valid) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const token = await createSessionToken({
    userId: admin.id,
    email: admin.email,
    name: admin.name,
  });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
  touchLastLogin(admin.id).catch(() => undefined);

  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ── Vacancies ────────────────────────────────────────────────────────────

const vacancySchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().max(160).optional().default(""),
  department: z.string().trim().max(120).default(""),
  location: z.string().trim().min(2).max(160),
  employmentType: z.string().trim().min(2).max(60),
  salaryRange: z.string().trim().max(120).default(""),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().min(10).max(20000),
  requirements: z.string().trim().max(5000).default(""),
  benefits: z.string().trim().max(5000).default(""),
  status: z.enum(VACANCY_STATUSES),
});

function parseVacancyForm(formData: FormData) {
  const parsed = vacancySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    department: formData.get("department") ?? "",
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    salaryRange: formData.get("salaryRange") ?? "",
    summary: formData.get("summary"),
    description: formData.get("description"),
    requirements: formData.get("requirements") ?? "",
    benefits: formData.get("benefits") ?? "",
    status: formData.get("status"),
  });
  if (!parsed.success) return null;

  const lines = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  return {
    ...parsed.data,
    salaryRange: parsed.data.salaryRange || null,
    requirements: lines(parsed.data.requirements),
    benefits: lines(parsed.data.benefits),
  };
}

function revalidateJobBoard() {
  revalidatePath("/vacantes");
  revalidatePath("/vacantes/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function createVacancyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const data = parseVacancyForm(formData);
  if (!data) return { error: "Revisa los campos del formulario." };

  const slug = await ensureUniqueSlug(slugify(data.slug || data.title));
  await createVacancy({
    ...data,
    slug,
    publishedAt: data.status === "open" ? new Date() : null,
  });

  revalidateJobBoard();
  redirect("/admin/vacantes");
}

export async function updateVacancyAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const data = parseVacancyForm(formData);
  if (!data) return { error: "Revisa los campos del formulario." };

  const slug = await ensureUniqueSlug(slugify(data.slug || data.title), id);
  await updateVacancy(id, { ...data, slug });

  revalidateJobBoard();
  redirect("/admin/vacantes");
}

export async function setVacancyStatusAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();
  const status = z.enum(VACANCY_STATUSES).parse(formData.get("status"));
  await setVacancyStatus(id, status);
  revalidateJobBoard();
  revalidatePath("/admin/vacantes");
}

export async function deleteVacancyAction(id: number): Promise<void> {
  await requireAdmin();
  await deleteVacancy(id);
  revalidateJobBoard();
  revalidatePath("/admin/vacantes");
}

// ── Applications ─────────────────────────────────────────────────────────

export async function setApplicationStatusAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();
  const status = z.enum(APPLICATION_STATUSES).parse(formData.get("status"));
  await setApplicationStatus(id, status);
  revalidatePath("/admin/postulaciones");
}

// ── Stock ────────────────────────────────────────────────────────────────

const stockSchema = z.object({
  material: z.string().trim().min(2, "Indica el material").max(120),
  form: z.enum(STOCK_FORMS),
  color: z.string().trim().max(60).default(""),
  availability: z.enum(STOCK_AVAILABILITY),
  notes: z.string().trim().max(300).default(""),
  published: z.coerce.boolean().default(false),
});

function parseStockForm(formData: FormData) {
  const parsed = stockSchema.safeParse({
    material: formData.get("material"),
    form: formData.get("form"),
    color: formData.get("color") ?? "",
    availability: formData.get("availability"),
    notes: formData.get("notes") ?? "",
    published: formData.get("published") === "on",
  });
  return parsed.success ? parsed.data : null;
}

function revalidateStock() {
  revalidatePath("/stock");
  revalidatePath("/admin/stock");
}

export async function createStockItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const data = parseStockForm(formData);
  if (!data) return { error: "Revisa los campos del formulario." };

  await createStockItem(data);
  revalidateStock();
  redirect("/admin/stock");
}

export async function updateStockItemAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const data = parseStockForm(formData);
  if (!data) return { error: "Revisa los campos del formulario." };

  await updateStockItem(id, data);
  revalidateStock();
  redirect("/admin/stock");
}

export async function setStockPublishedAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();
  await setStockItemPublished(id, formData.get("published") === "true");
  revalidateStock();
}

export async function deleteStockItemAction(id: number): Promise<void> {
  await requireAdmin();
  await deleteStockItem(id);
  revalidateStock();
}

// ── Settings ─────────────────────────────────────────────────────────────

const emailListSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "" ||
      value.split(",").every((part) => z.email().safeParse(part.trim()).success),
    "Escribe correos válidos separados por comas.",
  );

export async function saveEmailSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = z
    .object({ leadsTo: emailListSchema, applicationsTo: emailListSchema })
    .safeParse({
      leadsTo: formData.get("leadsTo") ?? "",
      applicationsTo: formData.get("applicationsTo") ?? "",
    });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los correos capturados." };
  }

  const normalize = (value: string) =>
    value
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean)
      .join(", ");

  await setSetting(SETTING_KEYS.emailLeadsTo, normalize(parsed.data.leadsTo));
  await setSetting(SETTING_KEYS.emailApplicationsTo, normalize(parsed.data.applicationsTo));

  revalidatePath("/admin/configuracion");
  return { success: "Configuración guardada." };
}

// ── Leads ────────────────────────────────────────────────────────────────

export async function setLeadStatusAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();
  const status = z.enum(LEAD_STATUSES).parse(formData.get("status"));
  await setLeadStatus(id, status);
  revalidatePath("/admin/leads");
}
