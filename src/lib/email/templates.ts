import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Notification templates, each returning both an HTML and a plain-text body.
 *
 * Two bodies, not one: the text part is what a phone notification previews,
 * what a spam filter reads, and what survives a client with images off — and
 * for these messages it is the *useful* half, since a lead is six fields and
 * a phone number somebody needs to be able to copy.
 *
 * The HTML is table-based with inline styles because Outlook, which is what
 * this company reads its mail in, still lays out with tables and drops
 * stylesheets. Nothing here loads a remote asset: an image would trip the
 * "descargar contenido externo" bar and hide the layout behind a click.
 */

const COLORS = {
  navy: "#294466",
  navyDark: "#0e1b2e",
  green: "#7f9d41",
  greenText: "#5f7a2c",
  paper: "#f7f8f5",
  surface: "#ffffff",
  ink: "#16202c",
  muted: "#5a6878",
  line: "#d8dee4",
} as const;

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export interface EmailMessage {
  subject: string;
  text: string;
  html: string;
}

/** A labelled value in the body. Empty values render as an em dash. */
export interface Field {
  label: string;
  value: string;
  /** Renders as a mailto:/tel: link in HTML. */
  link?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldRows(fields: readonly Field[]): string {
  return fields
    .map(({ label, value, link }) => {
      const shown = value.trim() || "—";
      const cell = link
        ? `<a href="${escapeHtml(link)}" style="color:${COLORS.navy};text-decoration:underline">${escapeHtml(shown)}</a>`
        : escapeHtml(shown);
      return `<tr>
        <td style="padding:6px 16px 6px 0;vertical-align:top;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${COLORS.muted};white-space:nowrap">${escapeHtml(label)}</td>
        <td style="padding:6px 0;vertical-align:top;font-size:15px;color:${COLORS.ink}">${cell}</td>
      </tr>`;
    })
    .join("");
}

interface LayoutOptions {
  /** Small caps line above the title, e.g. "Nuevo lead". */
  eyebrow: string;
  title: string;
  fields?: readonly Field[];
  /** Free text shown in its own quoted block. */
  body?: { label: string; content: string };
  /** Closing note, e.g. where the record lives in the panel. */
  footnote?: string;
  cta?: { label: string; href: string };
}

function layout({ eyebrow, title, fields = [], body, footnote, cta }: LayoutOptions): string {
  const fieldsBlock =
    fields.length > 0
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px">${fieldRows(fields)}</table>`
      : "";

  const bodyBlock = body
    ? `<p style="margin:0 0 8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${COLORS.muted}">${escapeHtml(body.label)}</p>
       <div style="margin:0 0 24px;padding:16px;background:${COLORS.paper};border-left:3px solid ${COLORS.green};font-size:15px;line-height:1.6;color:${COLORS.ink};white-space:pre-wrap">${escapeHtml(body.content)}</div>`
    : "";

  const ctaBlock = cta
    ? `<p style="margin:0 0 24px"><a href="${escapeHtml(cta.href)}" style="display:inline-block;background:${COLORS.navy};color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;text-decoration:none;border-radius:2px">${escapeHtml(cta.label)}</a></p>`
    : "";

  const footnoteBlock = footnote
    ? `<p style="margin:0;padding-top:20px;border-top:1px solid ${COLORS.line};font-size:13px;line-height:1.6;color:${COLORS.muted}">${escapeHtml(footnote)}</p>`
    : "";

  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.paper};font-family:${FONT}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${COLORS.paper};padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:${COLORS.surface};border:1px solid ${COLORS.line}">
        <tr><td style="background:${COLORS.navyDark};padding:20px 32px">
          <p style="margin:0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${COLORS.green};font-weight:600">${escapeHtml(eyebrow)}</p>
          <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.3">${escapeHtml(title)}</p>
        </td></tr>
        <tr><td style="padding:28px 32px">
          ${fieldsBlock}
          ${bodyBlock}
          ${ctaBlock}
          ${footnoteBlock}
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:${COLORS.muted}">${escapeHtml(SITE_NAME)} · ${escapeHtml(SITE_URL.replace(/^https?:\/\//, ""))}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Plain-text counterpart of `layout`, kept beside it so the two stay in step. */
function plain({
  title,
  fields = [],
  body,
  footnote,
}: Omit<LayoutOptions, "eyebrow" | "cta">): string {
  const width = fields.reduce((max, field) => Math.max(max, field.label.length), 0);
  return [
    title,
    "=".repeat(title.length),
    "",
    ...fields.map(({ label, value }) => `${(label + ":").padEnd(width + 2)}${value.trim() || "—"}`),
    ...(body ? ["", `${body.label}:`, body.content] : []),
    ...(footnote ? ["", footnote] : []),
  ].join("\n");
}

// ── Lead notification ──────────────────────────────────────────────────────

export interface LeadPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  utm: Record<string, string>;
  ip: string;
}

export function leadNotification(lead: LeadPayload): EmailMessage {
  const origin =
    Object.entries(lead.utm)
      .map(([key, value]) => `${key}=${value}`)
      .join(" · ") || "Directo / sin campaña";

  const fields: Field[] = [
    { label: "Nombre", value: lead.name },
    { label: "Empresa", value: lead.company },
    { label: "Correo", value: lead.email, link: `mailto:${lead.email}` },
    { label: "Teléfono", value: lead.phone, link: lead.phone ? `tel:${lead.phone}` : undefined },
    { label: "Servicio", value: lead.service },
    { label: "Origen", value: origin },
  ];

  const title = `${lead.name}${lead.company ? ` · ${lead.company}` : ""}`;
  const footnote = `Responde este correo para contestarle directamente. El lead también queda registrado en el panel (IP ${lead.ip || "desconocida"}).`;

  return {
    subject: `Nuevo lead — ${lead.name}${lead.service ? ` · ${lead.service}` : ""}`,
    html: layout({
      eyebrow: "Nuevo lead de contacto",
      title,
      fields,
      body: { label: "Mensaje", content: lead.message },
      cta: { label: "Ver en el panel", href: `${SITE_URL}/admin/leads` },
      footnote,
    }),
    text: plain({
      title: "Nuevo lead de contacto",
      fields,
      body: { label: "Mensaje", content: lead.message },
      footnote: `${footnote}\n${SITE_URL}/admin/leads`,
    }),
  };
}

// ── Application notification ───────────────────────────────────────────────

export interface ApplicationPayload {
  vacancyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  cvFileName: string;
}

export function applicationNotification(application: ApplicationPayload): EmailMessage {
  const vacancy = application.vacancyTitle || "Postulación general";
  const fields: Field[] = [
    { label: "Vacante", value: vacancy },
    { label: "Nombre", value: application.name },
    { label: "Correo", value: application.email, link: `mailto:${application.email}` },
    {
      label: "Teléfono",
      value: application.phone,
      link: application.phone ? `tel:${application.phone}` : undefined,
    },
    { label: "CV", value: application.cvFileName || "Adjunto en este correo" },
  ];
  const footnote =
    "El CV va adjunto y también queda guardado en el panel de administración, en Postulaciones.";

  return {
    subject: `Nueva postulación — ${vacancy} — ${application.name}`,
    html: layout({
      eyebrow: "Nueva postulación",
      title: `${application.name} · ${vacancy}`,
      fields,
      body: { label: "Mensaje del candidato", content: application.message },
      cta: { label: "Ver en el panel", href: `${SITE_URL}/admin/postulaciones` },
      footnote,
    }),
    text: plain({
      title: "Nueva postulación",
      fields,
      body: { label: "Mensaje del candidato", content: application.message },
      footnote: `${footnote}\n${SITE_URL}/admin/postulaciones`,
    }),
  };
}

// ── Acknowledgement to the person who submitted ────────────────────────────

/**
 * Optional receipt. Off by default: the address comes from a public form and
 * has not been verified, so every acknowledgement is a message this domain
 * sends to whoever the sender typed in. The rate limit on the endpoints keeps
 * that bounded, but it stays an opt-in decision rather than a default.
 */
export function acknowledgement(
  flow: "leads" | "applications",
  recipientName: string,
  context: string,
): EmailMessage {
  const isLead = flow === "leads";
  const title = isLead ? "Recibimos tu mensaje" : "Recibimos tu postulación";
  const bodyText = isLead
    ? `Hola ${recipientName}, gracias por escribirnos. Tu mensaje ya llegó al equipo de ${SITE_NAME} y te contactaremos a la brevedad.`
    : `Hola ${recipientName}, gracias por postularte${context ? ` a la vacante de ${context}` : ""}. Tu solicitud y tu CV ya están con nuestro equipo de Recursos Humanos. Si tu perfil coincide con el puesto, nos pondremos en contacto contigo.`;
  const footnote = "Este es un acuse automático; no es necesario que lo respondas.";

  return {
    subject: `${title} — ${SITE_NAME}`,
    html: layout({
      eyebrow: SITE_NAME,
      title,
      body: { label: "Acuse de recibo", content: bodyText },
      footnote,
    }),
    text: plain({
      title,
      body: { label: "Acuse de recibo", content: bodyText },
      footnote,
    }),
  };
}

// ── Test message ───────────────────────────────────────────────────────────

export function testMessage(details: {
  flowLabel: string;
  recipients: string;
  sender: string;
  smtpHost: string;
  triggeredBy: string;
}): EmailMessage {
  const fields: Field[] = [
    { label: "Flujo", value: details.flowLabel },
    { label: "Destinatarios", value: details.recipients },
    { label: "Remitente", value: details.sender },
    { label: "Servidor", value: details.smtpHost },
    { label: "Enviado por", value: details.triggeredBy },
    {
      label: "Fecha",
      value: new Intl.DateTimeFormat("es-MX", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "America/Mexico_City",
      }).format(new Date()),
    },
  ];
  const footnote =
    "Si recibiste este correo, la configuración de envío funciona: las notificaciones de este flujo llegarán a esta misma bandeja.";

  return {
    subject: `Prueba de correo — ${details.flowLabel} — ${SITE_NAME}`,
    html: layout({
      eyebrow: "Correo de prueba",
      title: "La configuración de correo funciona",
      fields,
      footnote,
    }),
    text: plain({ title: "Correo de prueba", fields, footnote }),
  };
}
