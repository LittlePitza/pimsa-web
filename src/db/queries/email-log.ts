import "server-only";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { emailLog, type EmailLogEntry } from "@/db/schema";
import type { EmailKind, EmailStatus, NotificationFlow } from "@/lib/enums";

/**
 * Reads and writes for the outgoing-email log.
 *
 * Every read is scoped by `flow`, never by `kind`: the flow is what says whose
 * data a row carries, so filtering on it is what keeps a Marketing account
 * from reading the address of a candidate who was sent an acknowledgement.
 */

export interface LogInput {
  flow: NotificationFlow;
  kind: EmailKind;
  status: EmailStatus;
  recipients: string;
  subject: string;
  detail: string;
  durationMs: number;
}

/**
 * Records one send attempt. Swallows its own errors on purpose: this runs
 * inside the send path of a public form, and a full disk or a locked table
 * must not turn a delivered notification into a 500 for the visitor.
 */
export async function logEmail(entry: LogInput): Promise<void> {
  try {
    await db.insert(emailLog).values({
      flow: entry.flow,
      kind: entry.kind,
      status: entry.status,
      // The columns are sized for a readable log, not for archival: a
      // 40-recipient list or a stack-trace-length error gets cut rather than
      // rejected by MySQL (which would lose the whole row, error included).
      recipients: entry.recipients.slice(0, 500),
      subject: entry.subject.slice(0, 255),
      detail: entry.detail.slice(0, 500),
      durationMs: entry.durationMs,
    });
  } catch (error) {
    console.error("[email-log] Insert failed:", error);
  }
}

/**
 * An empty `flows` array means "no restriction" — the whole-panel case. It is
 * spelled as an explicit empty array rather than `undefined` so a caller that
 * forgets to pass anything gets everything, which is the same thing an
 * unfiltered SELECT would have done.
 */
function scope(flows: readonly NotificationFlow[]) {
  return flows.length > 0 ? inArray(emailLog.flow, [...flows]) : undefined;
}

/** Newest attempts first, limited to the caller's flows. */
export async function recentEmailLog(
  limit: number,
  flows: readonly NotificationFlow[] = [],
): Promise<EmailLogEntry[]> {
  try {
    const where = scope(flows);
    const query = db.select().from(emailLog);
    return await (where ? query.where(where) : query)
      .orderBy(desc(emailLog.createdAt), desc(emailLog.id))
      .limit(limit);
  } catch (error) {
    console.error("[email-log] Read failed:", error);
    return [];
  }
}

export interface EmailHealth {
  /** Most recent successful send, of any flow in scope. */
  lastSentAt: Date | null;
  /** Failures in the last 24 hours — the number that decides the semaphore. */
  failures24h: number;
  sent24h: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function emailHealth(flows: readonly NotificationFlow[] = []): Promise<EmailHealth> {
  const area = scope(flows);
  const since = new Date(Date.now() - DAY_MS);
  const sent = eq(emailLog.status, "sent");
  const recent = gte(emailLog.createdAt, since);

  try {
    const [lastSent, windowed] = await Promise.all([
      db
        .select({ createdAt: emailLog.createdAt })
        .from(emailLog)
        .where(area ? and(sent, area) : sent)
        .orderBy(desc(emailLog.createdAt))
        .limit(1),
      db
        .select({ status: emailLog.status, count: sql<number>`count(*)` })
        .from(emailLog)
        .where(area ? and(recent, area) : recent)
        .groupBy(emailLog.status),
    ]);

    const counts = new Map(windowed.map((row) => [row.status, Number(row.count)]));
    return {
      lastSentAt: lastSent[0]?.createdAt ?? null,
      failures24h: counts.get("failed") ?? 0,
      sent24h: counts.get("sent") ?? 0,
    };
  } catch (error) {
    console.error("[email-log] Health read failed:", error);
    return { lastSentAt: null, failures24h: 0, sent24h: 0 };
  }
}
