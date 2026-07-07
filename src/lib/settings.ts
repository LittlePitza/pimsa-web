import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";

/**
 * Admin-editable settings (key-value) with environment fallbacks, so the
 * site keeps working before the panel is configured or on DB outages.
 */

export const SETTING_KEYS = {
  /** Comma-separated recipients for contact-form leads. */
  emailLeadsTo: "email_leads_to",
  /** Comma-separated recipients for job applications. */
  emailApplicationsTo: "email_applications_to",
} as const;

export async function getSettingSafe(key: string): Promise<string | null> {
  try {
    const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    const value = rows[0]?.value.trim();
    return value ? value : null;
  } catch (error) {
    console.error(`[settings] read failed for "${key}":`, error);
    return null;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

/** Recipients for a given email flow: DB setting → env fallback. */
export async function getEmailRecipients(kind: "leads" | "applications"): Promise<string> {
  const key = kind === "leads" ? SETTING_KEYS.emailLeadsTo : SETTING_KEYS.emailApplicationsTo;
  const fromDb = await getSettingSafe(key);
  return fromDb ?? process.env.CONTACT_EMAIL_TO ?? "";
}
