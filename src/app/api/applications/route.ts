import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { createApplication } from "@/db/queries/applications";
import { getOpenVacancyBySlug } from "@/db/queries/vacancies";
import { rateLimit } from "@/lib/rate-limit";
import { getEmailRecipients } from "@/lib/settings";

export const runtime = "nodejs";

/** Job application endpoint: fields + CV file (multipart form data). */

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_CV_EXTENSIONS = /\.(pdf|doc|docx)$/i;

const fieldsSchema = z.object({
  vacancySlug: z.string().trim().min(1).max(160),
  name: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  email: z.email("Correo electrónico inválido").max(200),
  phone: z.string().trim().min(7, "Teléfono inválido").max(30),
  message: z.string().trim().min(10, "Cuéntanos un poco más de ti").max(3000),
  website: z.string().max(200).optional().default(""), // honeypot
});

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!rateLimit(`applications:${ip}`, { limit: 3, windowMs: 10 * 60_000 })) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = fieldsSchema.safeParse({
    vacancySlug: formData.get("vacancySlug"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const fields = parsed.data;

  // Honeypot → pretend success.
  if (fields.website) {
    return NextResponse.json({ ok: true });
  }

  // CV validation.
  const cv = formData.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Adjunta tu CV (PDF o Word)." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: "El CV supera el tamaño máximo de 5 MB." }, { status: 400 });
  }
  if (!ALLOWED_CV_TYPES.has(cv.type) || !ALLOWED_CV_EXTENSIONS.test(cv.name)) {
    return NextResponse.json(
      { error: "Formato de CV no válido. Usa PDF, DOC o DOCX." },
      { status: 400 },
    );
  }

  const vacancy = await getOpenVacancyBySlug(fields.vacancySlug);
  if (!vacancy) {
    return NextResponse.json(
      { error: "Esta vacante ya no está disponible." },
      { status: 404 },
    );
  }

  const cvBuffer = Buffer.from(await cv.arrayBuffer());

  try {
    await createApplication({
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      message: fields.message,
      cv: {
        fileName: cv.name.slice(0, 255),
        mimeType: cv.type,
        size: cv.size,
        data: cvBuffer,
      },
    });
  } catch (error) {
    console.error("[applications] Insert failed:", error);
    return NextResponse.json(
      { error: "No pudimos registrar tu postulación. Inténtalo de nuevo más tarde." },
      { status: 502 },
    );
  }

  // Best-effort email notification to HR (application is already stored).
  notifyHr(vacancy.title, fields, { fileName: cv.name, content: cvBuffer }).catch((error) =>
    console.error("[applications] HR notification failed:", error),
  );

  return NextResponse.json({ ok: true });
}

async function notifyHr(
  vacancyTitle: string,
  fields: { name: string; email: string; phone: string; message: string },
  cv: { fileName: string; content: Buffer },
) {
  // Recipients: configurable from /admin/configuracion, env as fallback.
  const recipients = await getEmailRecipients("applications");
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !recipients) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: CONTACT_EMAIL_FROM ?? SMTP_USER,
    to: recipients,
    replyTo: fields.email,
    subject: `Nueva postulación — ${vacancyTitle} — ${fields.name}`,
    text: [
      `Vacante:  ${vacancyTitle}`,
      `Nombre:   ${fields.name}`,
      `Correo:   ${fields.email}`,
      `Teléfono: ${fields.phone}`,
      "",
      "Mensaje:",
      fields.message,
      "",
      "El CV también queda guardado en el panel de administración (/admin/postulaciones).",
    ].join("\n"),
    attachments: [{ filename: cv.fileName, content: cv.content }],
  });
}
