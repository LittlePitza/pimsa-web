import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createApplication } from "@/db/queries/applications";
import { getOpenVacancyBySlug } from "@/db/queries/vacancies";
import { createMailTransport, mailFrom } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isCrossOrigin } from "@/lib/request";
import { getEmailRecipients } from "@/lib/settings";
import { ALLOWED_CV_EXTENSIONS, ALLOWED_CV_MIME_TYPES, MAX_CV_BYTES } from "@/lib/uploads";

export const runtime = "nodejs";

/** Job application endpoint: fields + CV file (multipart form data). */

const ALLOWED_CV_TYPES = new Set<string>(ALLOWED_CV_MIME_TYPES);

const fieldsSchema = z.object({
  vacancySlug: z.string().trim().min(1).max(160),
  name: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  email: z.email("Correo electrónico inválido").max(200),
  phone: z.string().trim().min(7, "Teléfono inválido").max(30),
  message: z.string().trim().min(10, "Cuéntanos un poco más de ti").max(3000),
  website: z.string().max(200).optional().default(""), // honeypot
});

export async function POST(request: NextRequest) {
  // multipart/form-data is a "simple" request: without this check any page on
  // the internet could POST applications here from a visitor's browser.
  if (isCrossOrigin(request.headers)) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

  const ip = clientIp(request.headers);
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

  let vacancy;
  try {
    vacancy = await getOpenVacancyBySlug(fields.vacancySlug);
  } catch (error) {
    // DB outage ≠ closed vacancy — tell the candidate to retry, not to leave.
    console.error("[applications] Vacancy lookup failed:", error);
    return NextResponse.json(
      { error: "No pudimos procesar tu postulación. Inténtalo de nuevo en unos minutos." },
      { status: 503 },
    );
  }
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
  // after() runs once the response is sent and keeps the work alive on any
  // host, without delaying the candidate's confirmation.
  after(() =>
    notifyHr(vacancy.title, fields, { fileName: cv.name, content: cvBuffer }).catch((error) =>
      console.error("[applications] HR notification failed:", error),
    ),
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
  const transporter = createMailTransport();
  if (!transporter || !recipients) return;

  await transporter.sendMail({
    from: mailFrom(),
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
