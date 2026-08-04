import Link from "next/link";
import { BarList, ChartCard, StatCard, TrendChart } from "@/components/admin/charts";
import { LEAD_STATUSES } from "@/lib/enums";
import { listLeads } from "@/db/queries/leads";
import { listStockItems } from "@/db/queries/stock";
import { requireArea } from "@/lib/auth";
import { leadStatusLabels } from "@/lib/labels";
import { countBy, percent, tallyStatus, trendByMonth } from "@/lib/metrics";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Marketing — Panel" };

/** Marketing dashboard: demand from the contact form + catalog health. */
export default async function MarketingDashboardPage() {
  await requireArea("marketing");
  const [leads, stock] = await Promise.all([listLeads(), listStockItems()]);

  const total = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contacted = leads.filter((lead) => lead.status === "contacted").length;
  const closed = leads.filter((lead) => lead.status === "closed").length;

  const statusBuckets = tallyStatus(leads, LEAD_STATUSES).map((row) => ({
    label: leadStatusLabels[row.status],
    value: row.value,
  }));
  const trend = trendByMonth(leads, (lead) => lead.createdAt, 6);
  const byService = countBy(leads, (lead) => lead.service, {
    fallback: "Sin servicio",
    limit: 6,
  });
  const bySource = countBy(leads, (lead) => lead.utm?.utm_source ?? "", {
    fallback: "Directo / sin campaña",
    limit: 6,
  });
  const publishedStock = stock.filter((item) => item.published).length;

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Marketing</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Demanda entrante del formulario de contacto, origen de campañas y salud del catálogo.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads totales" value={total} tone="green" />
        <StatCard label="Sin atender" value={newLeads} href="/admin/leads" tone="green" />
        <StatCard label="En seguimiento" value={contacted} tone="navy" />
        <StatCard
          label="Tasa de conversión"
          value={`${percent(closed, total)}%`}
          hint={`${closed} cerrados de ${total}`}
          tone="blue"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Leads por mes" hint="Últimos 6 meses">
          <TrendChart points={trend} tone="green" />
        </ChartCard>

        <ChartCard title="Embudo de leads" hint="Por estado">
          <BarList items={statusBuckets} tone="green" />
        </ChartCard>

        <ChartCard title="Interés por servicio" hint="Qué buscan los prospectos">
          <BarList items={byService} tone="green" emptyLabel="Aún no hay leads con servicio." />
        </ChartCard>

        <ChartCard title="Origen / campaña" hint="Atribución por UTM">
          <BarList items={bySource} tone="blue" emptyLabel="Aún no hay leads registrados." />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Últimos leads"
          action={
            <Link href="/admin/leads" className="text-blue-600 text-sm font-medium">
              Ver todos
            </Link>
          }
        >
          <ul className="divide-line -my-2 divide-y">
            {leads.slice(0, 5).map((lead) => (
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
            {leads.length === 0 ? (
              <li className="text-ink-muted py-3 text-sm">Aún no hay leads.</li>
            ) : null}
          </ul>
        </ChartCard>

        <ChartCard
          title="Catálogo de stock"
          action={
            <Link href="/admin/stock" className="text-blue-600 text-sm font-medium">
              Administrar
            </Link>
          }
        >
          <div className="flex items-baseline gap-6">
            <div>
              <p className="font-display text-navy-500 text-4xl font-bold">{publishedStock}</p>
              <p className="text-ink-muted mt-1 font-mono text-xs tracking-wider uppercase">
                Materiales publicados
              </p>
            </div>
            <div>
              <p className="font-display text-ink-muted text-4xl font-bold">
                {stock.length - publishedStock}
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
