import Link from "next/link";
import { ArrowRight, Briefcase, FileText, Inbox, Megaphone, Package, Plus } from "lucide-react";
import { ChartCard, type Segment, SegmentBar, StatCard } from "@/components/admin/charts";
import { ApplicationStatusBadge, LeadStatusBadge } from "@/components/admin/status-badge";
import { applicationStatusCounts, recentApplications } from "@/db/queries/applications";
import { leadStatusCounts, recentLeads } from "@/db/queries/leads";
import { stockCounts } from "@/db/queries/stock";
import { countVacanciesByStatus } from "@/db/queries/vacancies";
import { requireFullPanel } from "@/lib/auth";
import { applicationStatusLabels, leadStatusLabels } from "@/lib/labels";
import { percent, RECENT_LIMIT } from "@/lib/metrics";
import { formatDate } from "@/lib/utils";

/** First letters of the first two words — the avatar for a list row. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "") || "?";
}

function QuickAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="border-line bg-surface text-navy-500 shadow-card hover:shadow-lift inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-all hover:text-blue-600"
    >
      <Plus aria-hidden className="size-4" strokeWidth={1.75} />
      {children}
    </Link>
  );
}

/**
 * Whole-site overview: headline counts + a door into each area. Only
 * whole-panel accounts land here; Marketing and RRHH are sent straight to
 * their own portal by the guard.
 *
 * Every number comes from a COUNT/GROUP BY and every list from a LIMIT, so
 * the page costs the same whether the inbox holds ten rows or a hundred
 * thousand. DB errors surface to the admin error boundary — honest failure
 * beats silently rendering zeros.
 */
export default async function AdminDashboardPage() {
  await requireFullPanel();
  const [leadCounts, applicationCounts, openVacancies, stock, latestLeads, latestApplications] =
    await Promise.all([
      leadStatusCounts(),
      applicationStatusCounts(),
      countVacanciesByStatus("open"),
      stockCounts(),
      recentLeads(RECENT_LIMIT),
      recentApplications(RECENT_LIMIT),
    ]);

  const newLeads = leadCounts.byStatus.new;
  const newApplications = applicationCounts.byStatus.new;

  const leadSegments: Segment[] = [
    { label: leadStatusLabels.new, value: leadCounts.byStatus.new, className: "bg-green-500" },
    {
      label: leadStatusLabels.contacted,
      value: leadCounts.byStatus.contacted,
      className: "bg-blue-400",
    },
    { label: leadStatusLabels.closed, value: leadCounts.byStatus.closed, className: "bg-navy-500" },
  ];

  const applicationSegments: Segment[] = [
    {
      label: applicationStatusLabels.new,
      value: applicationCounts.byStatus.new,
      className: "bg-green-500",
    },
    {
      label: applicationStatusLabels.reviewing,
      value: applicationCounts.byStatus.reviewing,
      className: "bg-blue-400",
    },
    {
      label: applicationStatusLabels.finalist,
      value: applicationCounts.byStatus.finalist,
      className: "bg-navy-500",
    },
    {
      label: applicationStatusLabels.hired,
      value: applicationCounts.byStatus.hired,
      className: "bg-forest-800",
    },
    {
      label: applicationStatusLabels.rejected,
      value: applicationCounts.byStatus.rejected,
      className: "bg-ink-muted/40",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-navy-500 text-2xl font-bold">Panel general</h1>
          <p className="text-ink-muted mt-1 text-sm">Toda la operación del sitio de un vistazo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickAction href="/admin/vacancies/new">Nueva vacante</QuickAction>
          <QuickAction href="/admin/stock/new">Nuevo material</QuickAction>
        </div>
      </div>

      {/* What needs attention first, inventory after. */}
      <div className="admin-stagger mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Leads nuevos"
          value={newLeads}
          hint={`${leadCounts.total} en total`}
          href="/admin/leads"
          tone="green"
          icon={Inbox}
        />
        <StatCard
          label="Postulaciones nuevas"
          value={newApplications}
          hint={`${applicationCounts.total} en total`}
          href="/admin/applications"
          tone="blue"
          icon={FileText}
        />
        <StatCard
          label="Vacantes abiertas"
          value={openVacancies}
          href="/admin/vacancies"
          tone="navy"
          icon={Briefcase}
        />
        <StatCard
          label="Stock publicado"
          value={stock.published}
          hint={`${stock.total - stock.published} ocultos`}
          href="/admin/stock"
          tone="navy"
          icon={Package}
        />
      </div>

      {/* Area portals, each carrying its real funnel instead of an empty door. */}
      <div className="admin-stagger mt-4 grid gap-4 lg:grid-cols-2">
        <Link
          href="/admin/marketing"
          className="group border-line bg-surface shadow-card hover:shadow-lift block rounded-md border p-6 transition-shadow"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-md bg-green-500/10 text-green-600"
              >
                <Megaphone className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="font-display text-navy-500 text-lg font-semibold">Marketing</h2>
                <p className="text-ink-muted text-xs">Leads y catálogo de stock</p>
              </div>
            </div>
            <ArrowRight
              aria-hidden
              className="size-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-ink font-display mt-5 text-2xl font-bold">
            {leadCounts.total}{" "}
            <span className="text-ink-muted text-sm font-normal">
              leads · {percent(leadCounts.byStatus.closed, leadCounts.total)}% cerrados
            </span>
          </p>
          <div className="mt-3">
            <SegmentBar segments={leadSegments} />
          </div>
        </Link>

        <Link
          href="/admin/hr"
          className="group border-line bg-surface shadow-card hover:shadow-lift block rounded-md border p-6 transition-shadow"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-md bg-blue-600/10 text-blue-600"
              >
                <Briefcase className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="font-display text-navy-500 text-lg font-semibold">
                  Recursos Humanos
                </h2>
                <p className="text-ink-muted text-xs">Vacantes y postulaciones</p>
              </div>
            </div>
            <ArrowRight
              aria-hidden
              className="size-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-ink font-display mt-5 text-2xl font-bold">
            {applicationCounts.total}{" "}
            <span className="text-ink-muted text-sm font-normal">
              postulaciones · {openVacancies} vacantes abiertas
            </span>
          </p>
          <div className="mt-3">
            <SegmentBar segments={applicationSegments} />
          </div>
        </Link>
      </div>

      {/* Recent activity across areas */}
      <div className="admin-stagger mt-4 grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Últimos leads"
          action={
            <Link href="/admin/leads" className="text-sm font-medium text-blue-600">
              Ver todos
            </Link>
          }
        >
          <ul className="divide-line -my-2 divide-y">
            {latestLeads.map((lead) => (
              <li key={lead.id} className="flex items-center gap-3 py-3">
                <span
                  aria-hidden
                  className="font-display grid size-9 shrink-0 place-items-center rounded-full bg-green-500/10 text-xs font-semibold text-green-600 uppercase"
                >
                  {initials(lead.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-ink truncate text-sm font-medium">
                    {lead.name}
                    {lead.company ? ` · ${lead.company}` : ""}
                  </p>
                  <p className="text-ink-muted truncate text-xs">
                    {lead.service || "Sin servicio"} · {formatDate(lead.createdAt)}
                  </p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </li>
            ))}
            {latestLeads.length === 0 ? (
              <li className="text-ink-muted py-3 text-sm">Aún no hay leads.</li>
            ) : null}
          </ul>
        </ChartCard>

        <ChartCard
          title="Últimas postulaciones"
          action={
            <Link href="/admin/applications" className="text-sm font-medium text-blue-600">
              Ver todas
            </Link>
          }
        >
          <ul className="divide-line -my-2 divide-y">
            {latestApplications.map((application) => (
              <li key={application.id} className="flex items-center gap-3 py-3">
                <span
                  aria-hidden
                  className="font-display grid size-9 shrink-0 place-items-center rounded-full bg-blue-600/10 text-xs font-semibold text-blue-600 uppercase"
                >
                  {initials(application.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-ink truncate text-sm font-medium">{application.name}</p>
                  <p className="text-ink-muted truncate text-xs">
                    {application.vacancyTitle || "Postulación general"} ·{" "}
                    {formatDate(application.createdAt)}
                  </p>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </li>
            ))}
            {latestApplications.length === 0 ? (
              <li className="text-ink-muted py-3 text-sm">Aún no hay postulaciones.</li>
            ) : null}
          </ul>
        </ChartCard>
      </div>
    </>
  );
}
