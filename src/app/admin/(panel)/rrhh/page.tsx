import Link from "next/link";
import { BarList, ChartCard, StatCard, TrendChart } from "@/components/admin/charts";
import { APPLICATION_STATUSES } from "@/db/schema";
import { listApplications } from "@/db/queries/applications";
import { listVacancies } from "@/db/queries/vacancies";
import { requireArea } from "@/lib/auth";
import { applicationStatusLabels } from "@/lib/labels";
import { countBy, percent, tallyStatus, trendByMonth } from "@/lib/metrics";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Recursos Humanos — Panel" };

/** HR dashboard: hiring funnel across vacancies and applications. */
export default async function HrDashboardPage() {
  await requireArea("rrhh");
  const [applications, vacancies] = await Promise.all([listApplications(), listVacancies()]);

  const total = applications.length;
  const newApplications = applications.filter((a) => a.status === "new").length;
  const inProcess = applications.filter(
    (a) => a.status === "reviewing" || a.status === "finalist",
  ).length;
  const hired = applications.filter((a) => a.status === "hired").length;
  const openVacancies = vacancies.filter((v) => v.status === "open").length;

  const statusBuckets = tallyStatus(applications, APPLICATION_STATUSES).map((row) => ({
    label: applicationStatusLabels[row.status],
    value: row.value,
  }));
  const trend = trendByMonth(applications, (a) => a.createdAt, 6);
  const byVacancy = countBy(applications, (a) => a.vacancyTitle, {
    fallback: "Postulación general",
    limit: 6,
  });

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Recursos Humanos</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Embudo de contratación: vacantes abiertas y postulaciones recibidas por la bolsa de trabajo.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vacantes publicadas"
          value={openVacancies}
          href="/admin/vacantes"
          tone="navy"
        />
        <StatCard
          label="Postulaciones sin revisar"
          value={newApplications}
          href="/admin/postulaciones"
          tone="blue"
        />
        <StatCard label="En proceso" value={inProcess} tone="navy" />
        <StatCard
          label="Tasa de contratación"
          value={`${percent(hired, total)}%`}
          hint={`${hired} contratadas de ${total}`}
          tone="green"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Postulaciones por mes" hint="Últimos 6 meses">
          <TrendChart points={trend} tone="blue" />
        </ChartCard>

        <ChartCard title="Embudo de contratación" hint="Por estado">
          <BarList items={statusBuckets} tone="blue" />
        </ChartCard>

        <ChartCard title="Postulaciones por vacante" hint="Qué puestos atraen más talento">
          <BarList
            items={byVacancy}
            tone="blue"
            emptyLabel="Aún no hay postulaciones."
          />
        </ChartCard>

        <ChartCard
          title="Últimas postulaciones"
          action={
            <Link href="/admin/postulaciones" className="text-blue-600 text-sm font-medium">
              Ver todas
            </Link>
          }
        >
          <ul className="divide-line -my-2 divide-y">
            {applications.slice(0, 5).map((application) => (
              <li key={application.id} className="flex items-center justify-between gap-4 py-3">
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
              <li className="text-ink-muted py-3 text-sm">Aún no hay postulaciones.</li>
            ) : null}
          </ul>
        </ChartCard>
      </div>
    </>
  );
}
