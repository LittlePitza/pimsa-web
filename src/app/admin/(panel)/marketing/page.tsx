import Link from "next/link";
import { BarList, ChartCard, StatCard, TrendChart } from "@/components/admin/charts";
import { leadsSince, leadStatusCounts, recentLeads } from "@/db/queries/leads";
import { stockCounts } from "@/db/queries/stock";
import { requireArea } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/enums";
import { leadStatusLabels } from "@/lib/labels";
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

export const metadata = { title: "Marketing — Panel" };

/**
 * Marketing dashboard: demand from the contact form + catalog health.
 *
 * Headline numbers come from GROUP BY over the whole table; the charts read
 * only the trend window they display, so the page cost stays flat as leads
 * accumulate.
 */
export default async function MarketingDashboardPage() {
  await requireArea("marketing");

  const since = startOfMonthsAgo(TREND_MONTHS);
  const [counts, windowed, stock, latest] = await Promise.all([
    leadStatusCounts(),
    leadsSince(since),
    stockCounts(),
    recentLeads(RECENT_LIMIT),
  ]);

  const trend = trendByMonth(windowed, (lead) => lead.createdAt, TREND_MONTHS);
  const byService = countBy(windowed, (lead) => lead.service, {
    fallback: "Sin servicio",
    limit: 6,
  });
  const bySource = countBy(windowed, (lead) => lead.utm?.utm_source ?? "", {
    fallback: "Directo / sin campaña",
    limit: 6,
  });

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Marketing</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Demanda entrante del formulario de contacto, origen de campañas y salud del catálogo.
      </p>

      <div className="admin-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads totales" value={counts.total} tone="green" />
        <StatCard
          label="Sin atender"
          value={counts.byStatus.new}
          href="/admin/leads"
          tone="green"
        />
        <StatCard label="En seguimiento" value={counts.byStatus.contacted} tone="navy" />
        <StatCard
          label="Tasa de conversión"
          value={`${percent(counts.byStatus.closed, counts.total)}%`}
          hint={`${counts.byStatus.closed} cerrados de ${counts.total}`}
          tone="blue"
        />
      </div>

      <div className="admin-stagger mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Leads por mes" hint={`Últimos ${TREND_MONTHS} meses`}>
          <TrendChart points={trend} tone="green" />
        </ChartCard>

        <ChartCard title="Embudo de leads" hint="Por estado · histórico completo">
          <BarList items={statusBuckets(counts, LEAD_STATUSES, leadStatusLabels)} tone="green" />
        </ChartCard>

        <ChartCard
          title="Interés por servicio"
          hint={`Qué buscan los prospectos · últimos ${TREND_MONTHS} meses`}
        >
          <BarList items={byService} tone="green" emptyLabel="Aún no hay leads con servicio." />
        </ChartCard>

        <ChartCard
          title="Origen / campaña"
          hint={`Atribución por UTM · últimos ${TREND_MONTHS} meses`}
        >
          <BarList items={bySource} tone="blue" emptyLabel="Aún no hay leads registrados." />
        </ChartCard>
      </div>

      <div className="admin-stagger mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Últimos leads"
          action={
            <Link href="/admin/leads" className="text-sm font-medium text-blue-600">
              Ver todos
            </Link>
          }
        >
          <ul className="divide-line -my-2 divide-y">
            {latest.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-4 py-3">
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
            {latest.length === 0 ? (
              <li className="text-ink-muted py-3 text-sm">Aún no hay leads.</li>
            ) : null}
          </ul>
        </ChartCard>

        <ChartCard
          title="Catálogo de stock"
          action={
            <Link href="/admin/stock" className="text-sm font-medium text-blue-600">
              Administrar
            </Link>
          }
        >
          <div className="flex items-baseline gap-6">
            <div>
              <p className="font-display text-navy-500 text-4xl font-bold">{stock.published}</p>
              <p className="text-ink-muted mt-1 font-mono text-xs tracking-wider uppercase">
                Materiales publicados
              </p>
            </div>
            <div>
              <p className="font-display text-ink-muted text-4xl font-bold">
                {stock.total - stock.published}
              </p>
              <p className="text-ink-muted mt-1 font-mono text-xs tracking-wider uppercase">
                Ocultos
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </>
  );
}
