import { setLeadStatusAction } from "@/app/admin/actions";
import { LEAD_STATUSES } from "@/db/schema";
import { listLeads } from "@/db/queries/leads";
import { leadStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Leads</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Solicitudes recibidas por el formulario de contacto (también se entregan por correo).
      </p>

      <ul className="mt-8 space-y-4">
        {leads.map((lead) => (
          <li key={lead.id} className="border-line bg-surface shadow-card rounded-md border p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-navy-500 font-semibold">
                  {lead.name}
                  {lead.company ? ` · ${lead.company}` : ""}
                </p>
                <p className="text-ink-muted mt-0.5 text-sm">
                  {lead.service || "Sin servicio específico"} · {formatDate(lead.createdAt)}
                  {lead.utm?.utm_source ? ` · Campaña: ${lead.utm.utm_source}` : ""}
                </p>
                <p className="text-ink mt-2 text-sm">
                  <a href={`mailto:${lead.email}`} className="text-blue-600 underline">
                    {lead.email}
                  </a>
                  {lead.phone ? (
                    <>
                      {" "}
                      · <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </>
                  ) : null}
                </p>
              </div>

              <form
                action={setLeadStatusAction.bind(null, lead.id)}
                className="flex items-center gap-2"
              >
                <label htmlFor={`status-${lead.id}`} className="sr-only">
                  Estado del lead
                </label>
                <select
                  id={`status-${lead.id}`}
                  name="status"
                  defaultValue={lead.status}
                  className="border-line bg-surface text-ink rounded-sm border px-2 py-1.5 text-sm"
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {leadStatusLabels[status]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
                >
                  Guardar
                </button>
              </form>
            </div>

            <details className="mt-4">
              <summary className="text-blue-600 cursor-pointer text-sm font-medium">
                Ver mensaje
              </summary>
              <p className="text-ink-muted mt-2 text-sm whitespace-pre-line">{lead.message}</p>
            </details>
          </li>
        ))}
        {leads.length === 0 ? (
          <li className="border-line bg-surface text-ink-muted rounded-md border p-6 text-sm">
            Aún no hay leads registrados.
          </li>
        ) : null}
      </ul>
    </>
  );
}
