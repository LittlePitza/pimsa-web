import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { insertLeadSafe } from "@/db/queries/leads";
import { createMailTransport, mailFrom } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { getEmailRecipients } from "@/lib/settings";
import { UTM_KEYS } from "@/lib/utm";

export const runtime = "nodejs";

/**
 * Lead capture endpoint (PLAN.md §3 — own the data, no third-party lock-in).
 * Anti-spam: honeypot field + per-IP rate limiting.
 * Delivery: SMTP (Hostinger mailbox) via nodemailer; env vars in .env.example.
 */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  company: z.string().trim().max(120).optional().default(""),
  email: z.email("Correo electrónico inválido").max(200),
  phone: z.string().trim().max(30).optional().default(""),
  service: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Cuéntanos un poco más en tu mensaje").max(3000),
  website: z.string().max(200).optional().default(""), // honeypot
  utm: z
    .record(z.string(), z.string().max(200))
    .optional()
    .default({})
    // Only the known attribution keys reach the DB and the email — anything
    // else in the payload is dropped so bots can't inject bulk content.
    .transform((utm) =>
      Object.fromEntries(Object.entries(utm).filter(([key]) => UTM_KEYS.includes(key))),
    ),
});

export async function POST(request: NextRequest) {
  // Rate limit per IP: 5 submissions / 10 minutes.
  const ip = clientIp(request.headers);
  if (!rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const lead = parsed.data;

  // Honeypot filled → bot. Pretend success so it doesn't adapt.
  if (lead.website) {
    return NextResponse.json({ ok: true });
  }

  // Persist to the admin panel first (best-effort — email remains a channel).
  const stored = await insertLeadSafe({
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    service: lead.service,
    message: lead.message,
    utm: Object.keys(lead.utm).length > 0 ? lead.utm : null,
    ip,
  });

  // Recipients: configurable from /admin/configuracion, env as fallback.
  const recipients = await getEmailRecipients("leads");
  const transporter = createMailTransport();

  const utmLines = Object.entries(lead.utm).map(([key, value]) => `${key}: ${value}`);
  const emailText = [
    `Nombre:   ${lead.name}`,
    `Empresa:  ${lead.company || "—"}`,
    `Correo:   ${lead.email}`,
    `Teléfono: ${lead.phone || "—"}`,
    `Servicio: ${lead.service || "—"}`,
    "",
    "Mensaje:",
    lead.message,
    "",
    "— Origen —",
    ...(utmLines.length > 0 ? utmLines : ["Directo / sin campaña"]),
    `IP: ${ip}`,
  ].join("\n");

  if (!transporter || !recipients) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without SMTP: log the lead and succeed.
      console.info("[contact] SMTP not configured — lead logged:\n" + emailText);
      return NextResponse.json({ ok: true });
    }
    if (stored) {
      // No email channel, but the lead is visible in /admin/leads.
      console.warn("[contact] SMTP not configured — lead stored in DB only");
      return NextResponse.json({ ok: true });
    }
    console.error("[contact] SMTP env vars missing and DB insert failed");
    return NextResponse.json(
      { error: "El formulario no está disponible por el momento. Escríbenos por WhatsApp." },
      { status: 503 },
    );
  }

  try {
    await transporter.sendMail({
      from: mailFrom(),
      to: recipients,
      replyTo: lead.email,
      subject: `Nuevo lead del sitio web — ${lead.name}${lead.service ? ` · ${lead.service}` : ""}`,
      text: emailText,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Email delivery failed:", error);
    if (stored) {
      // Email bounced but the lead is safe in /admin/leads.
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp." },
      { status: 502 },
    );
  }
}
