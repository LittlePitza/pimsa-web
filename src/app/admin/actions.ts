"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  ADMIN_ROLES,
  APPLICATION_STATUSES,
  LEAD_STATUSES,
  STOCK_AVAILABILITY,
  STOCK_FORMS,
  VACANCY_STATUSES,
} from "@/db/schema";
import {
  countAdmins,
  createAdmin,
  deleteAdmin,
  getAdminByEmail,
  getAdminById,
  isEmailTaken,
  touchLastLogin,
  updateAdminPassword,
  updateAdminProfile,
} from "@/db/queries/admins";
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
  getVacancyById,
  setVacancyStatus,
  updateVacancy,
} from "@/db/queries/vacancies";
import {
  isSuperAdmin,
  requireAdmin,
  requireArea,
  requireSuperAdmin,
  sessionCookieOptions,
} from "@/lib/auth";
import { createMailTransport, mailFrom } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { canAccess, homeFor, roleLabels } from "@/lib/roles";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { getEmailRecipients, SETTING_KEYS, setSetting } from "@/lib/settings";
import { slugify } from "@/lib/utils";

/**
 * Server actions for the admin panel. Every mutation re-checks the session
 * AND the caller's area — a hidden nav link is cosmetic, this is the gate
 * that actually keeps Marketing out of RRHH's data and vice versa.
 */

export interface ActionState {
  error?: string;
  success?: string;
  /**
   * Submitted values echoed back on validation errors, so client forms can
   * re-populate fields (React 19 resets uncontrolled forms after actions).
   */
  values?: Record<string, string>;
}

/** Raw string snapshot of the given FormData fields (for ActionState.values). */
function formValues(formData: FormData, keys: readonly string[]): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, String(formData.get(key) ?? "")]));
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

  // Brute-force guard: 5 attempts / 15 min per IP.
  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, { limit: 5, windowMs: 15 * 60_000 })) {
    return { error: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." };
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

  const token = await createSessionToken(
    { userId: admin.id, email: admin.email, name: admin.name },
    admin.passwordHash,
  );
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
  touchLastLogin(admin.id).catch(() => undefined);

  // Each team lands straight in its own portal; only whole-panel accounts
  // (and super-admins) see the general dashboard.
  redirect(homeFor(isSuperAdmin(admin.email) ? "admin" : admin.role));
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

const VACANCY_FIELDS = [
  "title",
  "slug",
  "department",
  "location",
  "employmentType",
  "salaryRange",
  "summary",
  "description",
  "requirements",
  "benefits",
  "status",
] as const;

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

function invalidVacancyForm(formData: FormData): ActionState {
  return {
    error: "Revisa los campos del formulario.",
    values: formValues(formData, VACANCY_FIELDS),
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
  await requireArea("rrhh");

  const data = parseVacancyForm(formData);
  if (!data) return invalidVacancyForm(formData);

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
  await requireArea("rrhh");

  const data = parseVacancyForm(formData);
  if (!data) return invalidVacancyForm(formData);

  const current = await getVacancyById(id);
  if (!current) return { error: "La vacante ya no existe." };

  const slug = await ensureUniqueSlug(slugify(data.slug || data.title), id);
  // Publishing from the edit form must stamp publishedAt (JSON-LD datePosted,
  // sitemap lastModified and the job-board ordering depend on it).
  const publishedAt =
    data.status === "open" && !current.publishedAt ? new Date() : current.publishedAt;
  await updateVacancy(id, { ...data, slug, publishedAt });

  revalidateJobBoard();
  redirect("/admin/vacantes");
}

export async function setVacancyStatusAction(id: number, formData: FormData): Promise<void> {
  await requireArea("rrhh");
  const status = z.enum(VACANCY_STATUSES).safeParse(formData.get("status"));
  if (!status.success) return; // manipulated input — ignore instead of throwing
  await setVacancyStatus(id, status.data);
  revalidateJobBoard();
  revalidatePath("/admin/vacantes");
}

export async function deleteVacancyAction(id: number): Promise<void> {
  await requireArea("rrhh");
  await deleteVacancy(id);
  revalidateJobBoard();
  revalidatePath("/admin/vacantes");
}

// ── Applications ─────────────────────────────────────────────────────────

export async function setApplicationStatusAction(id: number, formData: FormData): Promise<void> {
  await requireArea("rrhh");
  const status = z.enum(APPLICATION_STATUSES).safeParse(formData.get("status"));
  if (!status.success) return;
  await setApplicationStatus(id, status.data);
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

const STOCK_FIELDS = ["material", "form", "color", "availability", "notes", "published"] as const;

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

function invalidStockForm(formData: FormData): ActionState {
  return {
    error: "Revisa los campos del formulario.",
    values: formValues(formData, STOCK_FIELDS),
  };
}

function revalidateStock() {
  revalidatePath("/stock");
  revalidatePath("/admin/stock");
}

export async function createStockItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireArea("marketing");
  const data = parseStockForm(formData);
  if (!data) return invalidStockForm(formData);

  await createStockItem(data);
  revalidateStock();
  redirect("/admin/stock");
}

export async function updateStockItemAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireArea("marketing");
  const data = parseStockForm(formData);
  if (!data) return invalidStockForm(formData);

  await updateStockItem(id, data);
  revalidateStock();
  redirect("/admin/stock");
}

export async function setStockPublishedAction(id: number, formData: FormData): Promise<void> {
  await requireArea("marketing");
  await setStockItemPublished(id, formData.get("published") === "true");
  revalidateStock();
}

export async function deleteStockItemAction(id: number): Promise<void> {
  await requireArea("marketing");
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

/**
 * Saves only the recipient list the caller's area owns. Marketing owns the
 * contact-form leads, RRHH owns the job applications — a field the caller
 * doesn't own is ignored even if it arrives in the FormData.
 */
export async function saveEmailSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();
  const ownsLeads = canAccess(session.role, "marketing");
  const ownsApplications = canAccess(session.role, "rrhh");

  const parsed = z
    .object({ leadsTo: emailListSchema, applicationsTo: emailListSchema })
    .safeParse({
      leadsTo: ownsLeads ? (formData.get("leadsTo") ?? "") : "",
      applicationsTo: ownsApplications ? (formData.get("applicationsTo") ?? "") : "",
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

  if (ownsLeads) {
    await setSetting(SETTING_KEYS.emailLeadsTo, normalize(parsed.data.leadsTo));
  }
  if (ownsApplications) {
    await setSetting(SETTING_KEYS.emailApplicationsTo, normalize(parsed.data.applicationsTo));
  }

  revalidatePath("/admin/configuracion");
  return { success: "Configuración guardada." };
}

export async function sendTestEmailAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();

  const kind = formData.get("kind") === "applications" ? "applications" : "leads";
  if (!canAccess(session.role, kind === "leads" ? "marketing" : "rrhh")) {
    return { error: "Ese flujo de correo pertenece a otra área." };
  }

  const recipients = await getEmailRecipients(kind);
  if (!recipients) {
    return { error: "No hay destinatarios: captura correos arriba o configura CONTACT_EMAIL_TO." };
  }

  const transporter = createMailTransport();
  if (!transporter) {
    return { error: "SMTP sin configurar en el servidor (SMTP_HOST, SMTP_USER, SMTP_PASS)." };
  }

  const label = kind === "leads" ? "leads de contacto" : "postulaciones (RH)";
  try {
    await transporter.sendMail({
      from: mailFrom(),
      to: recipients,
      subject: `Correo de prueba — ${label} — Plásticos PIMSA`,
      text: [
        `Este es un correo de prueba enviado desde el panel de administración.`,
        "",
        `Flujo:          ${label}`,
        `Destinatarios:  ${recipients}`,
        "",
        "Si lo recibiste, la configuración de correo funciona correctamente.",
      ].join("\n"),
    });
    return { success: `Correo de prueba enviado a: ${recipients}` };
  } catch (error) {
    console.error("[settings] Test email failed:", error);
    return { error: "El envío falló. Revisa las credenciales SMTP del servidor." };
  }
}

// ── Leads ────────────────────────────────────────────────────────────────

export async function setLeadStatusAction(id: number, formData: FormData): Promise<void> {
  await requireArea("marketing");
  const status = z.enum(LEAD_STATUSES).safeParse(formData.get("status"));
  if (!status.success) return;
  await setLeadStatus(id, status.data);
  revalidatePath("/admin/leads");
}

// ── Accounts (super-admin) ─────────────────────────────────────────────────

const PASSWORD_MIN = 10;
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`)
  .max(200);
const nameSchema = z.string().trim().min(2, "Escribe un nombre.").max(120);
const accountEmailSchema = z.email("Escribe un correo válido.").max(190);
const roleSchema = z.enum(ADMIN_ROLES, { error: "Elige un área válida." });

export async function createAccountAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = z
    .object({
      name: nameSchema,
      email: accountEmailSchema,
      password: passwordSchema,
      role: roleSchema,
    })
    .safeParse({
      name: formData.get("name"),
      email: String(formData.get("email") ?? "").trim(),
      password: formData.get("password"),
      role: formData.get("role"),
    });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos de la cuenta." };
  }

  if (await isEmailTaken(parsed.data.email)) {
    return { error: "Ese correo ya está registrado en otra cuenta." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await createAdmin({
    email: parsed.data.email,
    name: parsed.data.name,
    passwordHash,
    // A super-admin email always keeps the whole panel, whatever was picked.
    role: isSuperAdmin(parsed.data.email) ? "admin" : parsed.data.role,
  });

  revalidatePath("/admin/cuentas");
  return {
    success: `Cuenta creada para ${parsed.data.email.toLowerCase()} — ${roleLabels[parsed.data.role]}.`,
  };
}

export async function updateAccountAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = z
    .object({ name: nameSchema, email: accountEmailSchema, role: roleSchema })
    .safeParse({
      name: formData.get("name"),
      email: String(formData.get("email") ?? "").trim(),
      role: formData.get("role"),
    });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos de la cuenta." };
  }

  const account = await getAdminById(id);
  if (!account) return { error: "La cuenta ya no existe." };

  // Guard against locking the central panel out of a super-admin.
  if (isSuperAdmin(account.email) && !isSuperAdmin(parsed.data.email)) {
    return {
      error: "No puedes quitar el correo de super-administrador; perdería el acceso central.",
    };
  }

  if (await isEmailTaken(parsed.data.email, id)) {
    return { error: "Ese correo ya está registrado en otra cuenta." };
  }

  await updateAdminProfile(id, {
    ...parsed.data,
    // Super-admins can't be boxed into one area — they manage the accounts.
    role: isSuperAdmin(parsed.data.email) ? "admin" : parsed.data.role,
  });
  revalidatePath("/admin/cuentas");
  return { success: `Cuenta actualizada — ${roleLabels[parsed.data.role]}.` };
}

export async function resetAccountPasswordAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa la contraseña." };
  }

  const account = await getAdminById(id);
  if (!account) return { error: "La cuenta ya no existe." };

  const passwordHash = await bcrypt.hash(parsed.data, 12);
  await updateAdminPassword(id, passwordHash);

  revalidatePath("/admin/cuentas");
  return { success: `Contraseña actualizada para ${account.email}.` };
}

export async function deleteAccountAction(id: number): Promise<void> {
  const session = await requireSuperAdmin();

  // Never delete yourself, the last account, or a protected super-admin.
  if (session.userId === id) return;
  if ((await countAdmins()) <= 1) return;

  const account = await getAdminById(id);
  if (!account || isSuperAdmin(account.email)) return;

  await deleteAdmin(id);
  revalidatePath("/admin/cuentas");
}
