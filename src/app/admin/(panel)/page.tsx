import Link from "next/link";
import { countApplicationsByStatus, listApplications } from "@/db/queries/applications";
import { countLeadsByStatus, listLeads } from "@/db/queries/leads";
import { countVacanciesByStatus } from "@/db/queries/vacancies";
import { applicationStatusLabels, leadStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

/** Admin dashboard: key counts + latest activity. */
export default async function AdminDashboardPage() {
  const [openVacancies, newApplications, newLeads, applications, leads] = await Promise.all([
    countVacanciesByStatus("open"),
    countApplicationsByStatus("new"),
    countLeadsByStatus("new"),
    listApplications(),
    listLeads(),
  ]);

  const cards = [
    { label: "Vacantes publicadas", value: openVacancies, href: "/admin/vacantes" },
    { label: "Postulaciones nuevas", value: newApplications, href: "/admin/postulaciones" },
    { label: "Leads nuevos", value: newLeads, href: "/admin/leads" },
  ];

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Resumen</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border-line bg-surface shadow-card hover:shadow-lift block rounded-md border p-6 transition-shadow"
          >
            <p className="font-display text-navy-500 text-4xl font-bold">{card.value}</p>
            <p className="text-ink-muted mt-2 font-mono text-xs tracking-wider uppercase">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
            Últimas postulaciones
          </h2>
          <ul className="border-line bg-surface shadow-card mt-4 divide-y divide-(--color-line) rounded-md border">
            {applications.slice(0, 5).map((application) => (
              <li key={application.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-ink font-medium">{application.name}</p>
                  <p className="text-ink-muted text-sm">
                    {application.vacancyTitle} · {formatDate(application.createdAt)}
                  </p>
                </div>
                <span className="text-ink-muted font-mono text-xs uppercase">
                  {applicationStatusLabels[application.status]}
                </span>
              </li>
            ))}
            {applications.length === 0 ? (
              <li className="text-ink-muted p-4 text-sm">Aún no hay postulaciones.</li>
            ) : null}
          </ul>
        </section>

        <section>
          <h2 className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
            Últimos leads
          </h2>
          <ul className="border-line bg-surface shadow-card mt-4 divide-y divide-(--color-line) rounded-md border">
            {leads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-ink font-medium">
                    {lead.name}
                    {lead.company ? ` · ${lead.company}` : ""}
                  </p>
                  <p className="text-ink-muted text-sm">
                    {lead.service || "Sin servicio"} · {formatDate(lead.createdAt)}
                  </p>
                </div>
                <span className="text-ink-muted font-mono text-xs uppercase">
                  {leadStatusLabels[lead.status]}
                </span>
              </li>
            ))}
            {leads.length === 0 ? (
              <li className="text-ink-muted p-4 text-sm">Aún no hay leads.</li>
            ) : null}
          </ul>
        </section>
      </div>
    </>
  );
}
