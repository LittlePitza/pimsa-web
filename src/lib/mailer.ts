import "server-only";
import nodemailer from "nodemailer";

/**
 * Shared SMTP transport (Hostinger mailbox; env vars in .env.example).
 * Returns null when SMTP is not configured so callers can degrade
 * gracefully (store in DB / log) instead of throwing.
 */
export function createMailTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/** Sender address: CONTACT_EMAIL_FROM, falling back to the SMTP account. */
export function mailFrom(): string {
  return process.env.CONTACT_EMAIL_FROM ?? process.env.SMTP_USER ?? "";
}
