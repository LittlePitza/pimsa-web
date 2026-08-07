import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { insertLeadSafe } from "@/db/queries/leads";
import { acknowledgeSubmission, notifyFlow } from "@/lib/email/send";
import { acknowledgement, leadNotification } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isCrossOrigin } from "@/lib/request";
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
  // Only this site's own form may post here (server actions get this check
  // from Next; route handlers have to do it themselves).
  if (isCrossOrigin(request.headers)) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

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

  const notification = leadNotification({
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    service: lead.service,
    message: lead.message,
    utm: lead.utm,
    ip,
  });

  /**
   * The lead is already in the database, so delivery no longer decides the
   * visitor's answer — it moves to after() and the form confirms immediately.
   * The one case that still fails loudly is losing the record *and* having no
   * way to send it: then nothing at all captured the enquiry, and telling
   * someone "gracias" would be a lie. Development is exempt — a laptop with
   * neither database nor SMTP still needs a working form to build against.
   */
  if (!stored && process.env.NODE_ENV === "production") {
    const result = await notifyFlow("leads", notification, { replyTo: lead.email });
    if (result.status === "sent") return NextResponse.json({ ok: true });

    console.error(`[contact] Lead lost — DB insert failed and email ${result.status}`);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp." },
      { status: 502 },
    );
  }

  // Recipients, CC/BCC and the on-off switch come from /admin/configuracion;
  // every attempt lands in the panel's email log, delivered or not.
  after(async () => {
    await notifyFlow("leads", notification, { replyTo: lead.email });
    await acknowledgeSubmission(
      "leads",
      lead.email,
      acknowledgement("leads", lead.name, lead.service),
    );
  });

  return NextResponse.json({ ok: true });
}
