import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatCard } from "@/components/admin/charts";
import { listApplications } from "@/db/queries/applications";
import { listLeads } from "@/db/queries/leads";
import { listStockItems } from "@/db/queries/stock";
import { listVacancies } from "@/db/queries/vacancies";
import { requireAdmin } from "@/lib/auth";
import { applicationStatusLabels, leadStatusLabels } from "@/lib/labels";
import { percent } from "@/lib/metrics";
import { formatDate } from "@/lib/utils";

/**
 * Whole-site overview: headline counts + a door into each area.
 * DB errors surface to the admin error boundary — honest failure beats
 * silently rendering zeros.
 */
export default async function AdminDashboardPage() {
  await requireAdmin();
  const [leads, applications, vacancies, stock] = await Promise.all([
    listLeads(),
    listApplications(),
    listVacancies(),
    listStockItems(),
  ]);

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;
  const newApplications = applications.filter((a) => a.status === "new").length;
  const openVacancies = vacancies.filter((v) => v.status === "open").length;
  const publishedStock = stock.filter((item) => item.published).length;

  const areas = [
    {
      href: "/admin/marketing",
      title: "Marketing",
      metric: `${leads.length} leads`,
      hint: `${newLeads} sin atender · ${percent(closedLeads, leads.length)}% cerrados`,
    },
    {
      href: "/admin/rrhh",
      title: "Recursos Humanos",
      metric: `${applications.length} postulaciones`,
      hint: `${newApplications} sin revisar · ${openVacancies} vacantes abiertas`,
    },
  ];

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Panel general</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Vista de toda la operación del sitio. Entra a cada área para el detalle.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads nuevos" value={newLeads} href="/admin/leads" tone="green" />
        <StatCard
          label="Postulaciones nuevas"
          value={newApplications}
          href="/admin/postulaciones"
          tone="blue"
        />
        <StatCard
          label="Vacantes publicadas"
          value={openVacancies}
          href="/admin/vacantes"
          tone="navy"
        />
        <StatCard label="Stock publicado" value={publishedStock} href="/admin/stock" tone="navy" />
      </div>

      {/* Area entry points */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {areas.map((area) => (
          <Link
            key={area.href}
            href={area.href}
            className="group border-line bg-surface shadow-card hover:shadow-lift block rounded-md border p-6 transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-navy-500 text-xl font-semibold">{area.title}</h2>
              <ArrowRight
                aria-hidden
                className="text-blue-600 size-5 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-ink mt-3 text-2xl font-bold">{area.metric}</p>
            <p className="text-ink-muted mt-1 text-sm">{area.hint}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity across areas */}
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
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
                    {application.vacancyTitle || "Postulación general"} ·{" "}
                    {formatDate(application.createdAt)}
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
      </div>
    </>
  );
}
