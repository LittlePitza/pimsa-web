import { setLeadStatusAction } from "@/app/admin/actions";
import { StatusForm } from "@/components/admin/status-form";
import { LEAD_STATUSES } from "@/lib/enums";
import { listLeads } from "@/db/queries/leads";
import { requireArea } from "@/lib/auth";
import { leadStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default async function AdminLeadsPage() {
  await requireArea("marketing");
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

              <StatusForm
                action={setLeadStatusAction.bind(null, lead.id)}
                id={`status-${lead.id}`}
                label="Estado del lead"
                context={lead.name}
                statuses={LEAD_STATUSES}
                statusLabels={leadStatusLabels}
                defaultValue={lead.status}
              />
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
