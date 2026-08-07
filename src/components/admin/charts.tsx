import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { Bucket, MonthPoint } from "@/lib/metrics";
import { cn } from "@/lib/utils";

/**
 * Lightweight, server-rendered dashboard primitives (no client JS): KPI tiles,
 * horizontal bar lists, segmented distributions and a CSS bar chart. Colored
 * per area via `tone`.
 */

type Tone = "green" | "blue" | "navy";

const barFill: Record<Tone, string> = {
  green: "bg-green-500",
  blue: "bg-blue-600",
  navy: "bg-navy-500",
};

const valueText: Record<Tone, string> = {
  green: "text-green-600",
  blue: "text-blue-600",
  navy: "text-navy-500",
};

const chipTone: Record<Tone, string> = {
  green: "bg-green-500/10 text-green-600",
  blue: "bg-blue-600/10 text-blue-600",
  navy: "bg-navy-500/10 text-navy-500",
};

/** KPI tile: label + big number, optionally an icon chip, a hint and a link. */
export function StatCard({
  label,
  value,
  hint,
  href,
  tone = "navy",
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-ink-muted font-mono text-xs tracking-wider uppercase">{label}</p>
        {Icon ? (
          <span
            aria-hidden
            className={cn("grid size-9 shrink-0 place-items-center rounded-md", chipTone[tone])}
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
      <p className={cn("font-display mt-2 text-3xl font-bold sm:text-4xl", valueText[tone])}>
        {value}
      </p>
      {hint ? <p className="text-ink-muted mt-1.5 text-xs">{hint}</p> : null}
    </>
  );

  const className =
    "border-line bg-surface shadow-card block rounded-md border p-5" +
    (href ? " hover:shadow-lift hover:border-navy-500/20 transition-all" : "");

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export interface Segment {
  label: string;
  value: number;
  /** Tailwind bg-* class painting both the bar segment and its legend dot. */
  className: string;
}

/**
 * Proportional distribution: one bar split by status plus a legend with the
 * exact counts, so the shape is scannable and the numbers are still there.
 */
export function SegmentBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div>
      <div className="bg-line/60 flex h-2 overflow-hidden rounded-full">
        {total > 0
          ? segments
              .filter((segment) => segment.value > 0)
              .map((segment) => (
                <span
                  key={segment.label}
                  className={segment.className}
                  style={{ width: `${(segment.value / total) * 100}%` }}
                />
              ))
          : null}
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5">
            <span aria-hidden className={cn("size-2 shrink-0 rounded-full", segment.className)} />
            <dt className="text-ink-muted text-xs">{segment.label}</dt>
            <dd className="text-ink font-mono text-xs">{segment.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Card wrapper with a mono eyebrow heading for a chart/section. */
export function ChartCard({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line bg-surface shadow-card rounded-md border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
            {title}
          </h2>
          {hint ? <p className="text-ink-muted mt-1 text-sm">{hint}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * Horizontal bars. Order is preserved (sort upstream): pass sorted buckets for
 * rankings, ordered ones for funnels.
 */
export function BarList({
  items,
  tone = "green",
  emptyLabel = "Sin datos todavía.",
}: {
  items: Bucket[];
  tone?: Tone;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="text-ink-muted text-sm">{emptyLabel}</p>;
  }
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3">
          <span className="text-ink truncate text-sm" title={item.label}>
            {item.label}
          </span>
          <span className="bg-line/60 relative h-2.5 overflow-hidden rounded-full">
            <span
              className={cn("admin-bar absolute inset-y-0 left-0 rounded-full", barFill[tone])}
              style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%` }}
            />
          </span>
          <span className="text-ink-muted text-right font-mono text-sm">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

/** Vertical CSS bar chart for a monthly trend. */
export function TrendChart({ points, tone = "green" }: { points: MonthPoint[]; tone?: Tone }) {
  const max = Math.max(1, ...points.map((point) => point.value));

  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3">
      {points.map((point, i) => (
        <div key={point.key} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-ink-muted font-mono text-xs">{point.value}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className={cn("admin-column w-full rounded-t", barFill[tone])}
              style={{
                height: `${point.value > 0 ? Math.max((point.value / max) * 100, 3) : 0}%`,
                // Left-to-right sweep, so the trend reads in reading order.
                animationDelay: `${i * 45}ms`,
              }}
            />
          </div>
          <span className="text-ink-muted font-mono text-[10px] tracking-wider uppercase">
            {point.label}
          </span>
        </div>
      ))}
    </div>
  );
}
