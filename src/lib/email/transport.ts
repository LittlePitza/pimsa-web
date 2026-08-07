import "server-only";
import nodemailer from "nodemailer";
import type { SmtpConfig } from "@/lib/email/config";

/**
 * SMTP transport for the resolved configuration.
 *
 * Built per send rather than cached: the panel can change the mailbox at any
 * moment, and a pooled connection would keep authenticating with credentials
 * the admin already replaced. The cost is one TCP+TLS handshake per
 * notification, which is nothing next to the volume this site sends.
 *
 * The timeouts are the point of this wrapper. Nodemailer's defaults let a
 * silent SMTP server hold the socket for minutes; on the contact route that
 * is a visitor watching a spinner, and in `after()` it is a serverless
 * invocation billed for the wait. Ten seconds to connect and twenty to finish
 * is generous for Hostinger and short enough to fail visibly.
 */
export function createTransport(smtp: SmtpConfig) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

/**
 * Turns a nodemailer/Node error into something an administrator can act on.
 *
 * The raw messages are the reason the panel needed this: "535 5.7.8" and
 * "ESOCKET" tell a sysadmin what to fix and tell everyone else nothing. The
 * original text is still appended, so the diagnosis stays checkable.
 */
export function describeSmtpError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string } | null)?.code ?? "";
  const responseCode = (error as { responseCode?: number } | null)?.responseCode ?? 0;

  if (code === "EAUTH" || responseCode === 535) {
    return `Usuario o contraseña incorrectos: el servidor rechazó la autenticación. (${raw})`;
  }
  if (code === "EDNS" || code === "ENOTFOUND") {
    return `No se encontró el servidor SMTP: revisa el nombre del host. (${raw})`;
  }
  if (code === "ETIMEDOUT" || code === "ECONNECTION" || code === "ESOCKET") {
    return `No se pudo conectar al servidor: revisa el host, el puerto y que el hosting permita salida SMTP. (${raw})`;
  }
  if (responseCode === 550 || responseCode === 553) {
    return `El servidor rechazó el remitente o el destinatario: la dirección "De" debe ser un buzón real de tu dominio. (${raw})`;
  }
  if (responseCode >= 500) {
    return `El servidor de correo rechazó el envío. (${raw})`;
  }
  return raw;
}

export type VerifyResult = { ok: true } | { ok: false; message: string };

/** Opens a connection and authenticates, without sending anything. */
export async function verifyTransport(smtp: SmtpConfig): Promise<VerifyResult> {
  if (!smtp.complete) {
    return {
      ok: false,
      message: "Faltan datos de la cuenta SMTP (servidor, usuario o contraseña).",
    };
  }
  try {
    await createTransport(smtp).verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: describeSmtpError(error) };
  }
}
