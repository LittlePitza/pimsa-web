"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  ADMIN_ROLES,
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  LEAD_STATUSES,
  SALARY_PERIODS,
  STOCK_AVAILABILITY,
  STOCK_FORMS,
  VACANCY_STATUSES,
  WORK_MODES,
} from "@/lib/enums";
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
import {
  flowKeys,
  flowLabels,
  formatEmailList,
  formatSender,
  getEmailConfig,
  hasStoredSmtpPassword,
  parseEmailList,
  SETTING_KEYS,
  type NotificationFlow,
} from "@/lib/email/config";
import { canStoreSecrets, encryptSecret } from "@/lib/email/secret";
import { sendTestEmail } from "@/lib/email/send";
import { testMessage } from "@/lib/email/templates";
import { verifyTransport } from "@/lib/email/transport";
import { isRateLimited, rateLimit, recordAttempt } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { canAccess, homeFor, roleLabels } from "@/lib/roles";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { setSettings } from "@/lib/settings";
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

export async function signInAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  // Brute-force guards. Per IP stops one host hammering away; per account
  // stops a botnet spreading the same guesses across many IPs, which the IP
  // limit alone never sees. Only failures count against the per-account
  // budget, so a legitimate user signing in never spends their own quota.
  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, { limit: 5, windowMs: 15 * 60_000 })) {
    return { error: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." };
  }

  const accountKey = `admin-login-account:${email}`;
  const accountLimit = { limit: 10, windowMs: 15 * 60_000 };
  if (isRateLimited(accountKey, accountLimit)) {
    return { error: "Demasiados intentos para esta cuenta. Espera 15 minutos." };
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
  const hash =
    admin?.passwordHash ?? "$2a$12$C6UzMDM.H6dfI/f/IKcEeO6t2mPqXW1Uh3q0aX9x0e1a2b3c4d5e6";
  const valid = await bcrypt.compare(password, hash);

  if (!admin || !valid) {
    recordAttempt(accountKey, accountLimit);
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

/**
 * A salary amount as typed ("12,000", "$12000") → a number, or null when the
 * field is left empty. Blank is a valid answer: not every vacancy publishes a
 * salary, and the free-text note covers "a tratar".
 */
const salaryAmountSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .transform((value) => (value === "" ? null : Number(value)))
  .refine(
    (value) => value === null || (value > 0 && value <= 10_000_000),
    "Los montos de sueldo deben ser números mayores a cero.",
  );

/**
 * <input type="date"> → the end of that day. Stored in UTC like every other
 * timestamp here; the six-hour drift against Mexico City is immaterial for a
 * date whose only job is telling the boards when to drop the posting.
 */
const expirySchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : new Date(`${value}T23:59:59.000Z`)))
  .refine(
    (value) => value === null || !Number.isNaN(value.getTime()),
    "Revisa la fecha de cierre.",
  );

/**
 * Messages are written out in Spanish because RRHH sees them: this form now
 * carries the data three job boards read, and "revisa los campos" on eighteen
 * inputs is not an error message.
 */
const vacancySchema = z
  .object({
    title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres.").max(160),
    slug: z.string().trim().max(160).optional().default(""),
    department: z.string().trim().max(120).default(""),
    city: z.string().trim().min(2, "Escribe la ciudad.").max(120),
    region: z.string().trim().min(2, "Escribe el estado.").max(120),
    postalCode: z
      .string()
      .trim()
      .max(12)
      .default("")
      .refine(
        (value) => value === "" || /^\d{5}$/.test(value),
        "El código postal lleva 5 dígitos.",
      ),
    workMode: z.enum(WORK_MODES, { error: "Elige una modalidad válida." }),
    employmentType: z.enum(EMPLOYMENT_TYPES, { error: "Elige una jornada válida." }),
    salaryMin: salaryAmountSchema,
    salaryMax: salaryAmountSchema,
    salaryPeriod: z.enum(SALARY_PERIODS, { error: "Elige un periodo de sueldo válido." }),
    salaryRange: z.string().trim().max(120).default(""),
    openings: z.coerce
      .number()
      .int()
      .min(1, "Debe haber al menos una plaza.")
      .max(999, "Son demasiadas plazas.")
      .catch(1),
    expiresAt: expirySchema,
    summary: z.string().trim().min(10, "El resumen debe tener al menos 10 caracteres.").max(500),
    description: z
      .string()
      .trim()
      .min(10, "La descripción debe tener al menos 10 caracteres.")
      .max(20000),
    requirements: z.string().trim().max(5000).default(""),
    benefits: z.string().trim().max(5000).default(""),
    status: z.enum(VACANCY_STATUSES),
  })
  .refine(
    (data) =>
      data.salaryMin === null || data.salaryMax === null || data.salaryMax >= data.salaryMin,
    "El sueldo máximo no puede ser menor que el mínimo.",
  );

const VACANCY_FIELDS = [
  "title",
  "slug",
  "department",
  "city",
  "region",
  "postalCode",
  "workMode",
  "employmentType",
  "salaryMin",
  "salaryMax",
  "salaryPeriod",
  "salaryRange",
  "openings",
  "expiresAt",
  "summary",
  "description",
  "requirements",
  "benefits",
  "status",
] as const;

type ParsedVacancy = ReturnType<typeof toVacancyRow>;

function toVacancyRow(data: z.output<typeof vacancySchema>) {
  const lines = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  return {
    ...data,
    salaryRange: data.salaryRange || null,
    requirements: lines(data.requirements),
    benefits: lines(data.benefits),
  };
}

function parseVacancyForm(
  formData: FormData,
): { ok: true; data: ParsedVacancy } | { ok: false; message: string } {
  const parsed = vacancySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    department: formData.get("department") ?? "",
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode") ?? "",
    workMode: formData.get("workMode"),
    employmentType: formData.get("employmentType"),
    salaryMin: formData.get("salaryMin") ?? "",
    salaryMax: formData.get("salaryMax") ?? "",
    salaryPeriod: formData.get("salaryPeriod"),
    salaryRange: formData.get("salaryRange") ?? "",
    openings: formData.get("openings") ?? "1",
    expiresAt: formData.get("expiresAt") ?? "",
    summary: formData.get("summary"),
    description: formData.get("description"),
    requirements: formData.get("requirements") ?? "",
    benefits: formData.get("benefits") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los campos del formulario.",
    };
  }
  return { ok: true, data: toVacancyRow(parsed.data) };
}

function invalidVacancyForm(formData: FormData, message: string): ActionState {
  return { error: message, values: formValues(formData, VACANCY_FIELDS) };
}

function revalidateJobBoard() {
  revalidatePath("/jobs");
  revalidatePath("/jobs/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function createVacancyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireArea("rrhh");

  const parsed = parseVacancyForm(formData);
  if (!parsed.ok) return invalidVacancyForm(formData, parsed.message);
  const data = parsed.data;

  const slug = await ensureUniqueSlug(slugify(data.slug || data.title));
  await createVacancy({
    ...data,
    slug,
    publishedAt: data.status === "open" ? new Date() : null,
  });

  revalidateJobBoard();
  redirect("/admin/vacancies");
}

export async function updateVacancyAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireArea("rrhh");

  const parsed = parseVacancyForm(formData);
  if (!parsed.ok) return invalidVacancyForm(formData, parsed.message);
  const data = parsed.data;

  const current = await getVacancyById(id);
  if (!current) return { error: "La vacante ya no existe." };

  const slug = await ensureUniqueSlug(slugify(data.slug || data.title), id);
  // Publishing from the edit form must stamp publishedAt (JSON-LD datePosted,
  // sitemap lastModified and the job-board ordering depend on it).
  const publishedAt =
    data.status === "open" && !current.publishedAt ? new Date() : current.publishedAt;
  await updateVacancy(id, { ...data, slug, publishedAt });

  revalidateJobBoard();
  redirect("/admin/vacancies");
}

export async function setVacancyStatusAction(id: number, formData: FormData): Promise<void> {
  await requireArea("rrhh");
  const status = z.enum(VACANCY_STATUSES).safeParse(formData.get("status"));
  if (!status.success) return; // manipulated input — ignore instead of throwing
  await setVacancyStatus(id, status.data);
  revalidateJobBoard();
  revalidatePath("/admin/vacancies");
}

export async function deleteVacancyAction(id: number): Promise<void> {
  await requireArea("rrhh");
  await deleteVacancy(id);
  revalidateJobBoard();
  revalidatePath("/admin/vacancies");
}

// ── Applications ─────────────────────────────────────────────────────────

export async function setApplicationStatusAction(id: number, formData: FormData): Promise<void> {
  await requireArea("rrhh");
  const status = z.enum(APPLICATION_STATUSES).safeParse(formData.get("status"));
  if (!status.success) return;
  await setApplicationStatus(id, status.data);
  revalidatePath("/admin/applications");
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

// ── Email settings ───────────────────────────────────────────────────────

/**
 * A recipient list as typed. Commas, semicolons and line breaks all separate,
 * because people paste these out of Outlook and out of each other's messages,
 * and rejecting a semicolon teaches nothing except that the form is fussy.
 */
const emailListSchema = z
  .string()
  .trim()
  .max(500, "La lista de correos es demasiado larga.")
  .refine(
    (value) => parseEmailList(value).every((part) => z.email().safeParse(part).success),
    "Escribe correos válidos separados por comas.",
  )
  .refine((value) => parseEmailList(value).length <= 10, "Máximo 10 correos por campo.");

/** Normalizes to the canonical "a@x.com, b@y.com" the settings table stores. */
function normalizeEmailList(value: string): string {
  return formatEmailList(parseEmailList(value));
}

const checkbox = (formData: FormData, name: string) => (formData.get(name) === "on" ? "1" : "0");

/** The area that owns each notification flow — the gate on every action below. */
const flowArea: Record<NotificationFlow, "marketing" | "rrhh"> = {
  leads: "marketing",
  applications: "rrhh",
};

/**
 * Saves one flow's delivery settings. The flow is bound server-side by the
 * page, so the FormData can't ask to write the other area's configuration —
 * and the area check still runs, because a bound argument is only as trusted
 * as the request that carried it.
 */
export async function saveEmailFlowAction(
  flow: NotificationFlow,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireArea(flowArea[flow]);

  const parsed = z
    .object({
      to: emailListSchema,
      cc: emailListSchema,
      bcc: emailListSchema,
      subjectTag: z.string().trim().max(40, "La etiqueta del asunto es demasiado larga."),
    })
    .safeParse({
      to: formData.get("to") ?? "",
      cc: formData.get("cc") ?? "",
      bcc: formData.get("bcc") ?? "",
      subjectTag: formData.get("subjectTag") ?? "",
    });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los correos capturados." };
  }

  const keys = flowKeys(flow);
  await setSettings({
    [keys.to]: normalizeEmailList(parsed.data.to),
    [keys.cc]: normalizeEmailList(parsed.data.cc),
    [keys.bcc]: normalizeEmailList(parsed.data.bcc),
    [keys.subjectTag]: parsed.data.subjectTag,
    [keys.enabled]: checkbox(formData, "enabled"),
    [keys.acknowledge]: checkbox(formData, "acknowledge"),
  });

  revalidatePath("/admin/settings");
  return { success: `Guardado. ${flowLabels[flow]} — configuración aplicada de inmediato.` };
}

const smtpSchema = z.object({
  host: z.string().trim().min(3, "Escribe el servidor SMTP.").max(190),
  port: z.coerce
    .number()
    .int("El puerto debe ser un número.")
    .min(1, "Puerto inválido.")
    .max(65535, "Puerto inválido."),
  user: z.email("El usuario SMTP es la dirección completa del buzón.").max(190),
  fromAddress: z.email("Escribe una dirección de remitente válida.").max(190),
  fromName: z.string().trim().max(80),
});

/**
 * SMTP credentials, restricted to super-admins: this is the one screen that
 * writes a password to the database, and it changes how the whole site sends,
 * not how one area receives.
 */
export async function saveSmtpAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = smtpSchema.safeParse({
    host: formData.get("host"),
    port: formData.get("port") ?? "465",
    user: String(formData.get("user") ?? "").trim(),
    fromAddress: String(formData.get("fromAddress") ?? "").trim(),
    fromName: formData.get("fromName") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos de la cuenta." };
  }

  if (!canStoreSecrets()) {
    return {
      error:
        "AUTH_SECRET no está configurado en el servidor; sin él la contraseña no puede guardarse cifrada.",
    };
  }

  /**
   * A blank password means "leave it as it is" — the field is never populated
   * on render, so requiring it would force whoever fixes a typo in the host
   * to go find the mailbox password again.
   */
  const password = String(formData.get("password") ?? "");
  if (!password && !(await hasStoredSmtpPassword())) {
    return { error: "Captura la contraseña del buzón para guardar la cuenta de envío." };
  }

  await setSettings({
    [SETTING_KEYS.smtpHost]: parsed.data.host,
    [SETTING_KEYS.smtpPort]: String(parsed.data.port),
    [SETTING_KEYS.smtpUser]: parsed.data.user.toLowerCase(),
    [SETTING_KEYS.fromAddress]: parsed.data.fromAddress.toLowerCase(),
    [SETTING_KEYS.fromName]: parsed.data.fromName,
    ...(password ? { [SETTING_KEYS.smtpPassword]: encryptSecret(password) } : {}),
  });

  revalidatePath("/admin/settings");
  return { success: "Cuenta de envío guardada. Prueba la conexión para confirmarla." };
}

/**
 * Drops the stored account so the server's environment variables take over
 * again. The way back from a mistake that would otherwise need database
 * access to undo.
 *
 * Clears the sender too, not just the credentials: a leftover panel "From"
 * would be paired with the environment's mailbox, and a sender that doesn't
 * belong to the authenticating account is exactly what makes a receiving
 * server file the message as spam.
 */
export async function resetSmtpAction(): Promise<void> {
  await requireSuperAdmin();
  await setSettings({
    [SETTING_KEYS.smtpHost]: "",
    [SETTING_KEYS.smtpPort]: "",
    [SETTING_KEYS.smtpUser]: "",
    [SETTING_KEYS.smtpPassword]: "",
    [SETTING_KEYS.fromAddress]: "",
    [SETTING_KEYS.fromName]: "",
  });
  revalidatePath("/admin/settings");
}

/**
 * Opens and authenticates an SMTP connection without sending anything.
 * Takes no arguments: useActionState calls it with the previous state and the
 * FormData, and a connection test needs neither.
 */
export async function verifySmtpAction(): Promise<ActionState> {
  await requireAdmin();

  const { smtp } = await getEmailConfig();
  const result = await verifyTransport(smtp);

  return result.ok
    ? { success: `Conexión correcta con ${smtp.host}:${smtp.port} como ${smtp.user}.` }
    : { error: result.message };
}

/**
 * Sends the real template for a flow, either to its configured recipients or
 * to a single address typed into the form — so an address can be tried before
 * it is committed to production.
 */
export async function sendTestEmailAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();

  const flow: NotificationFlow = formData.get("flow") === "applications" ? "applications" : "leads";
  if (!canAccess(session.role, flowArea[flow])) {
    return { error: "Ese flujo de correo pertenece a otra área." };
  }

  const override = String(formData.get("overrideTo") ?? "").trim();
  if (override && !z.email().safeParse(override).success) {
    return { error: "Escribe un correo válido para la prueba." };
  }

  /**
   * The only authenticated action that sends mail to an address the caller
   * types in. Nobody legitimately needs more than a handful of tests in a
   * row, and an unbounded button is a way to spend the company's SMTP
   * reputation — the budget is per account, so one careless session cannot
   * lock out the rest of the panel.
   */
  if (!rateLimit(`admin-test-email:${session.userId}`, { limit: 10, windowMs: 10 * 60_000 })) {
    return { error: "Demasiadas pruebas seguidas. Espera unos minutos e inténtalo de nuevo." };
  }

  const config = await getEmailConfig();
  if (!config.smtp.complete) {
    return {
      error: "La cuenta de envío (SMTP) no está configurada; no se puede enviar la prueba.",
    };
  }

  const recipients = override ? [override.toLowerCase()] : config.flows[flow].to;
  if (recipients.length === 0) {
    return {
      error: `No hay destinatarios para ${flowLabels[flow]}. Captúralos arriba o escribe un correo de prueba.`,
    };
  }

  const result = await sendTestEmail(
    flow,
    testMessage({
      flowLabel: flowLabels[flow],
      recipients: formatEmailList(recipients),
      sender: formatSender(config.smtp),
      smtpHost: `${config.smtp.host}:${config.smtp.port}`,
      triggeredBy: session.email,
    }),
    recipients,
  );

  revalidatePath("/admin/settings");

  if (result.status === "sent") {
    return {
      success: `Enviado a ${result.recipients} en ${result.durationMs} ms. Revisa la bandeja (y la carpeta de spam la primera vez).`,
    };
  }
  return { error: result.detail || "El envío falló. Revisa la cuenta de envío." };
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

  revalidatePath("/admin/accounts");
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
  revalidatePath("/admin/accounts");
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

  revalidatePath("/admin/accounts");
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
  revalidatePath("/admin/accounts");
}
