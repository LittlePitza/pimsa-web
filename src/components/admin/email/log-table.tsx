import type { EmailLogEntry } from "@/db/schema";
import type { EmailKind, EmailStatus, NotificationFlow } from "@/lib/enums";
import { cn, formatDate } from "@/lib/utils";

/**
 * The record of what actually went out.
 *
 * `skipped` rows carry as much weight here as failures: the most confusing
 * outcome in this system is a notification nobody sent — no recipients, or the
 * flow switched off — and a table showing only attempts that reached the
 * network would render that case as a blank space.
 */

const flowLabels: Record<NotificationFlow, string> = {
  leads: "Lead",
  applications: "Postulación",
};

/**
 * Read after the flow: "Lead · Acuse". The notification is the ordinary case
 * and gets no qualifier — labelling every normal row would bury the two kinds
 * that are actually worth spotting.
 */
const kindLabels: Record<EmailKind, string> = {
  notification: "",
  acknowledgement: "Acuse",
  test: "Prueba",
};

const statusLabels: Record<EmailStatus, string> = {
  sent: "Enviado",
  failed: "Falló",
  skipped: "No enviado",
};

const statusStyles: Record<EmailStatus, string> = {
  sent: "bg-green-500/15 text-green-600",
  failed: "bg-red-50 text-red-800 border border-red-200",
  skipped: "bg-line/60 text-ink-muted",
};

export function EmailLogTable({ entries }: { entries: EmailLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-ink-muted text-sm">
        Todavía no hay envíos registrados. Manda un correo de prueba para estrenar la bitácora.
      </p>
    );
  }

  return (
    <div className="border-line overflow-x-auto rounded-md border">
      <table className="w-full min-w-[46rem] border-collapse text-sm">
        <thead>
          <tr className="border-line bg-paper border-b">
            {["Fecha", "Tipo", "Estado", "Destinatarios", "Detalle"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="text-ink-muted px-4 py-3 text-left font-mono text-xs font-medium tracking-wider uppercase"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-line divide-y">
          {entries.map((entry) => (
            <tr key={entry.id} className="align-top">
              <td className="text-ink-muted px-4 py-3 whitespace-nowrap">
                {formatDate(entry.createdAt)}
              </td>
              <td className="text-ink px-4 py-3 whitespace-nowrap">
                {flowLabels[entry.flow]}
                {kindLabels[entry.kind] ? (
                  <span className="text-ink-muted"> · {kindLabels[entry.kind]}</span>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-1 font-mono text-xs whitespace-nowrap",
                    statusStyles[entry.status],
                  )}
                >
                  {statusLabels[entry.status]}
                </span>
                {entry.status === "sent" && entry.durationMs > 0 ? (
                  <span className="text-ink-muted mt-1 block font-mono text-xs">
                    {entry.durationMs} ms
                  </span>
                ) : null}
              </td>
              <td className="text-ink px-4 py-3 break-words">{entry.recipients || "—"}</td>
              <td className="text-ink-muted max-w-md px-4 py-3 break-words">
                {entry.detail || entry.subject || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
