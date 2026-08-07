import "server-only";
import { NOTIFICATION_FLOWS, type NotificationFlow } from "@/lib/enums";
import { loadSettings, type SettingsMap } from "@/lib/settings";
import { decryptSecret } from "@/lib/email/secret";

/**
 * The typed view over the email settings, resolved as: panel value → server
 * environment → built-in default.
 *
 * Environment variables stay a live fallback rather than a migration step, so
 * the site keeps sending exactly as it did before anyone opened the panel, and
 * a wiped `settings` row degrades to the previous behaviour instead of to
 * silence. Every resolved value carries where it came from, because "el correo
 * llega a contacto@" and "el correo llega a contacto@ porque así quedó en
 * hPanel hace un año" are different facts for whoever is debugging.
 */

export type ConfigSource = "panel" | "env" | "default";

export interface FlowConfig {
  /** Off means the notification is skipped — the lead is still stored. */
  enabled: boolean;
  to: string[];
  cc: string[];
  bcc: string[];
  /** Prepended to the subject, e.g. "[PIMSA Web]" — for inbox rules. */
  subjectTag: string;
  /** Send a receipt back to whoever submitted the form. */
  acknowledge: boolean;
  /** Where `to` came from. */
  source: ConfigSource;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromAddress: string;
  source: ConfigSource;
  /** True when host/user/password are all present — i.e. we can send. */
  complete: boolean;
}

export interface EmailConfig {
  smtp: SmtpConfig;
  flows: Record<NotificationFlow, FlowConfig>;
}

/**
 * Setting keys. `email_leads_to` and `email_applications_to` keep the names
 * they shipped with — the rows already exist in production and a rename would
 * silently reset the recipients on deploy.
 */
export const SETTING_KEYS = {
  smtpHost: "smtp_host",
  smtpPort: "smtp_port",
  smtpUser: "smtp_user",
  smtpPassword: "smtp_password",
  fromName: "email_from_name",
  fromAddress: "email_from_address",
} as const;

/** Per-flow keys, so the two flows can never drift out of step. */
export function flowKeys(flow: NotificationFlow) {
  const prefix = flow === "leads" ? "email_leads" : "email_applications";
  return {
    enabled: `${prefix}_enabled`,
    to: `${prefix}_to`,
    cc: `${prefix}_cc`,
    bcc: `${prefix}_bcc`,
    subjectTag: `${prefix}_subject_tag`,
    acknowledge: `${prefix}_ack`,
  } as const;
}

export const flowLabels: Record<NotificationFlow, string> = {
  leads: "Leads de contacto",
  applications: "Postulaciones (RRHH)",
};

/** What each flow notifies about, shown under its heading in the panel. */
export const flowDescriptions: Record<NotificationFlow, string> = {
  leads: "Mensajes del formulario de contacto del sitio.",
  applications: "Candidatos que se postulan a una vacante. El correo lleva el CV adjunto.",
};

// ── Parsing helpers ────────────────────────────────────────────────────────

/** "a@x.com, b@y.com" → ["a@x.com", "b@y.com"]. Also accepts semicolons. */
export function parseEmailList(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(/[,;\n]/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function formatEmailList(list: readonly string[]): string {
  return list.join(", ");
}

function readBoolean(map: SettingsMap, key: string, fallback: boolean): boolean {
  const raw = map.get(key)?.trim();
  if (raw === undefined || raw === "") return fallback;
  return raw === "1" || raw === "true";
}

function readString(map: SettingsMap, key: string): string {
  return map.get(key)?.trim() ?? "";
}

// ── Resolution ─────────────────────────────────────────────────────────────

/**
 * Env fallback per flow. The two are deliberately separate: contact leads go
 * to the general inbox, applications carry a candidate's CV and belong to
 * RRHH only. An unset applications address yields no recipients, which makes
 * the notification skip — the application is still stored and readable in
 * /admin/applications, so nothing is lost and no CV reaches the wrong inbox.
 */
export function envRecipients(flow: NotificationFlow): string[] {
  const raw = flow === "leads" ? process.env.CONTACT_EMAIL_TO : process.env.APPLICATIONS_EMAIL_TO;
  return parseEmailList(raw);
}

function resolveFlow(map: SettingsMap, flow: NotificationFlow): FlowConfig {
  const keys = flowKeys(flow);
  const panelTo = parseEmailList(readString(map, keys.to));
  const envTo = envRecipients(flow);

  return {
    // Unset means on: that is how the site behaved before the toggle existed,
    // and a missing row must never silence a notification.
    enabled: readBoolean(map, keys.enabled, true),
    to: panelTo.length > 0 ? panelTo : envTo,
    cc: parseEmailList(readString(map, keys.cc)),
    bcc: parseEmailList(readString(map, keys.bcc)),
    subjectTag: readString(map, keys.subjectTag),
    acknowledge: readBoolean(map, keys.acknowledge, false),
    source: panelTo.length > 0 ? "panel" : envTo.length > 0 ? "env" : "default",
  };
}

function resolveSmtp(map: SettingsMap): SmtpConfig {
  const panelHost = readString(map, SETTING_KEYS.smtpHost);
  const panelUser = readString(map, SETTING_KEYS.smtpUser);
  const storedPassword = readString(map, SETTING_KEYS.smtpPassword);
  const panelPassword = storedPassword ? (decryptSecret(storedPassword) ?? "") : "";

  /**
   * All-or-nothing per source. Mixing a panel host with an environment
   * password would authenticate one server's credentials against another —
   * so a panel configuration counts only once host, user and password are all
   * captured, and until then the environment keeps sending.
   */
  const usePanel = Boolean(panelHost && panelUser && panelPassword);

  const host = usePanel ? panelHost : (process.env.SMTP_HOST ?? "");
  const user = usePanel ? panelUser : (process.env.SMTP_USER ?? "");
  const password = usePanel ? panelPassword : (process.env.SMTP_PASS ?? "");

  const rawPort = usePanel ? readString(map, SETTING_KEYS.smtpPort) : (process.env.SMTP_PORT ?? "");
  const port = Number(rawPort) || 465;

  const fromAddress =
    readString(map, SETTING_KEYS.fromAddress) || process.env.CONTACT_EMAIL_FROM || user;
  const fromName = readString(map, SETTING_KEYS.fromName) || "Plásticos PIMSA";

  return {
    host,
    port,
    // 465 is implicit TLS; 587 and 25 start plaintext and upgrade via STARTTLS.
    secure: port === 465,
    user,
    password,
    fromName,
    fromAddress,
    source: usePanel ? "panel" : host ? "env" : "default",
    complete: Boolean(host && user && password),
  };
}

/** Resolves the whole email configuration in one database read. */
export async function getEmailConfig(): Promise<EmailConfig> {
  const map = await loadSettings();
  return {
    smtp: resolveSmtp(map),
    flows: {
      leads: resolveFlow(map, "leads"),
      applications: resolveFlow(map, "applications"),
    },
  };
}

/** RFC 5322 sender: `"Plásticos PIMSA" <web@plasticospimsa.com>`. */
export function formatSender(smtp: SmtpConfig): string {
  const address = smtp.fromAddress || smtp.user;
  if (!address) return "";
  return smtp.fromName ? `"${smtp.fromName.replace(/"/g, "")}" <${address}>` : address;
}

/** True when a panel-stored SMTP password exists (never returns the value). */
export async function hasStoredSmtpPassword(): Promise<boolean> {
  const map = await loadSettings();
  return Boolean(readString(map, SETTING_KEYS.smtpPassword));
}

export { NOTIFICATION_FLOWS };
export type { NotificationFlow };
