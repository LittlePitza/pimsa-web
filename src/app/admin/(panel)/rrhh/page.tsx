import Link from "next/link";
import { BarList, ChartCard, StatCard, TrendChart } from "@/components/admin/charts";
import {
  applicationsSince,
  applicationStatusCounts,
  recentApplications,
} from "@/db/queries/applications";
import { countVacanciesByStatus } from "@/db/queries/vacancies";
import { requireArea } from "@/lib/auth";
import { APPLICATION_STATUSES } from "@/lib/enums";
import { applicationStatusLabels } from "@/lib/labels";
import {
  countBy,
  percent,
  RECENT_LIMIT,
  startOfMonthsAgo,
  statusBuckets,
  TREND_MONTHS,
  trendByMonth,
} from "@/lib/metrics";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Recursos Humanos — Panel" };

/**
 * HR dashboard: hiring funnel across vacancies and applications.
 *
 * Headline numbers come from GROUP BY over the whole table; the charts read
 * only the trend window they display.
 */
export default async function HrDashboardPage() {
  await requireArea("rrhh");

  const since = startOfMonthsAgo(TREND_MONTHS);
  const [counts, windowed, openVacancies, latest] = await Promise.all([
    applicationStatusCounts(),
    applicationsSince(since),
    countVacanciesByStatus("open"),
    recentApplications(RECENT_LIMIT),
  ]);

  const inProcess = counts.byStatus.reviewing + counts.byStatus.finalist;
  const trend = trendByMonth(windowed, (a) => a.createdAt, TREND_MONTHS);
  const byVacancy = countBy(windowed, (a) => a.vacancyTitle, {
    fallback: "Postulación general",
    limit: 6,
  });

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Recursos Humanos</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Embudo de contratación: vacantes abiertas y postulaciones recibidas por la bolsa de trabajo.
      </p>

      <div className="admin-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vacantes publicadas"
          value={openVacancies}
          href="/admin/vacantes"
          tone="navy"
        />
        <StatCard
          label="Postulaciones sin revisar"
          value={counts.byStatus.new}
          href="/admin/postulaciones"
          tone="blue"
        />
        <StatCard label="En proceso" value={inProcess} tone="navy" />
        <StatCard
          label="Tasa de contratación"
          value={`${percent(counts.byStatus.hired, counts.total)}%`}
          hint={`${counts.byStatus.hired} contratadas de ${counts.total}`}
          tone="green"
        />
      </div>

      <div className="admin-stagger mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Postulaciones por mes" hint={`Últimos ${TREND_MONTHS} meses`}>
          <TrendChart points={trend} tone="blue" />
        </ChartCard>

        <ChartCard title="Embudo de contratación" hint="Por estado · histórico completo">
          <BarList
            items={statusBuckets(counts, APPLICATION_STATUSES, applicationStatusLabels)}
            tone="blue"
          />
        </ChartCard>

        <ChartCard
          title="Postulaciones por vacante"
          hint={`Qué puestos atraen más talento · últimos ${TREND_MONTHS} meses`}
        >
          <BarList items={byVacancy} tone="blue" emptyLabel="Aún no hay postulaciones." />
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
            {latest.map((application) => (
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
            {latest.length === 0 ? (
              <li className="text-ink-muted py-3 text-sm">Aún no hay postulaciones.</li>
            ) : null}
          </ul>
        </ChartCard>
      </div>
    </>
  );
}
