import "server-only";
import type { Attachment } from "nodemailer/lib/mailer";
import { logEmail } from "@/db/queries/email-log";
import {
  formatSender,
  getEmailConfig,
  type EmailConfig,
  type NotificationFlow,
} from "@/lib/email/config";
import type { EmailMessage } from "@/lib/email/templates";
import { createTransport, describeSmtpError } from "@/lib/email/transport";
import type { EmailKind, EmailStatus } from "@/lib/enums";

/**
 * The single door every outgoing message goes through.
 *
 * Two rules hold for all of them. Nothing throws: the caller is always a
 * public form whose record is already safely stored, so a delivery failure is
 * information, never an error the visitor should see. And every attempt is
 * logged — sent, failed *or* skipped — because the panel's whole promise is
 * that "no llegó el correo" has an answer, and a send that never happened is
 * exactly the case a log of successes would miss.
 *
 * Every send is attributed to the flow whose data it carries, including
 * acknowledgements: the receipt a candidate gets is still RRHH's record, and
 * logging it as anything else would put a candidate's address in front of
 * Marketing.
 */

export interface SendResult {
  status: EmailStatus;
  /** Who it went to, or would have. */
  recipients: string;
  /** Error message when failed, reason when skipped, empty when sent. */
  detail: string;
  durationMs: number;
}

interface DispatchInput {
  flow: NotificationFlow;
  kind: EmailKind;
  message: EmailMessage;
  to: readonly string[];
  cc?: readonly string[];
  bcc?: readonly string[];
  replyTo?: string;
  attachments?: Attachment[];
  config: EmailConfig;
}

async function skipped(
  flow: NotificationFlow,
  kind: EmailKind,
  recipients: string,
  reason: string,
): Promise<SendResult> {
  const result: SendResult = { status: "skipped", recipients, detail: reason, durationMs: 0 };
  await logEmail({ flow, kind, subject: "", ...result });
  return result;
}

/** Sends and logs. The only function here that touches the network. */
async function dispatch({
  flow,
  kind,
  message,
  to,
  cc = [],
  bcc = [],
  replyTo,
  attachments,
  config,
}: DispatchInput): Promise<SendResult> {
  const recipients = to.join(", ");
  const { smtp } = config;

  if (!smtp.complete) {
    return skipped(flow, kind, recipients, "La cuenta de envío (SMTP) no está configurada.");
  }
  if (to.length === 0) {
    return skipped(flow, kind, "", "No hay destinatarios configurados para este flujo.");
  }

  const startedAt = Date.now();
  try {
    await createTransport(smtp).sendMail({
      from: formatSender(smtp),
      to: [...to],
      cc: cc.length > 0 ? [...cc] : undefined,
      bcc: bcc.length > 0 ? [...bcc] : undefined,
      replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments,
    });

    const result: SendResult = {
      status: "sent",
      recipients,
      detail: "",
      durationMs: Date.now() - startedAt,
    };
    await logEmail({ flow, kind, subject: message.subject, ...result });
    return result;
  } catch (error) {
    console.error(`[email] ${flow}/${kind} delivery failed:`, error);
    const result: SendResult = {
      status: "failed",
      recipients,
      detail: describeSmtpError(error),
      durationMs: Date.now() - startedAt,
    };
    await logEmail({ flow, kind, subject: message.subject, ...result });
    return result;
  }
}

/** Prepends the flow's inbox tag: "[PIMSA Web] Nuevo lead — …". */
function applySubjectTag(message: EmailMessage, tag: string): EmailMessage {
  const trimmed = tag.trim();
  if (!trimmed) return message;
  return { ...message, subject: `${trimmed} ${message.subject}` };
}

/**
 * The notification an area receives when a form comes in. Honours the flow's
 * on/off switch, its CC and BCC lists, and its subject tag.
 */
export async function notifyFlow(
  flow: NotificationFlow,
  message: EmailMessage,
  options: { replyTo?: string; attachments?: Attachment[] } = {},
): Promise<SendResult> {
  const config = await getEmailConfig();
  const flowConfig = config.flows[flow];

  if (!flowConfig.enabled) {
    return skipped(
      flow,
      "notification",
      flowConfig.to.join(", "),
      "Las notificaciones de este flujo están desactivadas.",
    );
  }

  return dispatch({
    flow,
    kind: "notification",
    message: applySubjectTag(message, flowConfig.subjectTag),
    to: flowConfig.to,
    cc: flowConfig.cc,
    bcc: flowConfig.bcc,
    replyTo: options.replyTo,
    attachments: options.attachments,
    config,
  });
}

/**
 * The optional receipt back to whoever filled the form. Logged under its own
 * kind so a bounce from a mistyped visitor address can never be mistaken for
 * the company's own notification failing — and no subject tag, because the
 * tag exists for internal inbox rules and means nothing to an outsider.
 */
export async function acknowledgeSubmission(
  flow: NotificationFlow,
  to: string,
  message: EmailMessage,
): Promise<SendResult> {
  const config = await getEmailConfig();
  if (!config.flows[flow].acknowledge) {
    return skipped(flow, "acknowledgement", to, "El acuse automático está desactivado.");
  }
  return dispatch({ flow, kind: "acknowledgement", message, to: [to], config });
}

/**
 * Test send from the panel. `overrideTo` lets an admin aim the real template
 * at their own inbox before committing an address to production — which is
 * the whole point of testing, and what sending only to the saved recipients
 * could never do.
 */
export async function sendTestEmail(
  flow: NotificationFlow,
  message: EmailMessage,
  to: readonly string[],
): Promise<SendResult> {
  const config = await getEmailConfig();
  return dispatch({ flow, kind: "test", message, to, config });
}
