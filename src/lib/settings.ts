import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";

/**
 * Admin-editable key-value settings.
 *
 * Every reader here degrades instead of throwing: the settings table backs
 * the contact form and the job board, and a DB hiccup must cost a fallback
 * value, never a 500 on a public page. Writers are the opposite — they run
 * from the panel, where a failure has an admin in front of it to see it.
 *
 * The typed views over these keys live in `@/lib/email/config`; this module
 * only knows about strings.
 */

export type SettingsMap = ReadonlyMap<string, string>;

const EMPTY: SettingsMap = new Map();

/**
 * Every setting in one query. The table holds a couple of dozen short rows,
 * so reading it whole costs less than the round trips of fetching keys one at
 * a time — and it lets a single send resolve its entire configuration
 * (recipients, SMTP, toggles) without touching the database again.
 */
export async function loadSettings(): Promise<SettingsMap> {
  try {
    const rows = await db.select().from(settings);
    return new Map(rows.map((row) => [row.key, row.value]));
  } catch (error) {
    console.error("[settings] read failed:", error);
    return EMPTY;
  }
}

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
  await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

/**
 * Writes several keys. Deliberately one statement per key rather than a bulk
 * upsert: the multi-row form needs `VALUES(col)` in its ON DUPLICATE clause,
 * which MySQL 8.0.20 deprecated and MariaDB spells differently — not a
 * portability bet worth taking to save a few milliseconds on a form the panel
 * submits by hand.
 */
export async function setSettings(entries: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(entries)) {
    await setSetting(key, value);
  }
}
