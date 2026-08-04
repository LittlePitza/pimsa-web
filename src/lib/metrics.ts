/**
 * Dashboard aggregations — pure functions over rows already fetched from the
 * DB, so they stay dialect-agnostic and easy to reason about.
 *
 * Totals come from SQL (GROUP BY / COUNT) because they cover all of history;
 * the shaping helpers here run over the bounded window the charts actually
 * display, never over the whole table.
 */

/** Months covered by the trend charts — and by the rows they read. */
export const TREND_MONTHS = 6;

/** Rows shown in the "últimos…" cards on the dashboards. */
export const RECENT_LIMIT = 5;

/**
 * Ceiling for the full listing screens. Generous for this site's volume, but
 * it keeps a single page from ever loading an entire table; the pages show
 * the real total next to it so nothing looks silently truncated.
 */
export const ADMIN_LIST_LIMIT = 200;

export interface Bucket {
  label: string;
  value: number;
}

/** Totals per status plus the grand total, as returned by a GROUP BY. */
export interface StatusCounts<S extends string> {
  total: number;
  byStatus: Record<S, number>;
}

/** A zero for every status, so the funnels always show the full set. */
export function emptyStatusRecord<S extends string>(order: readonly S[]): Record<S, number> {
  return Object.fromEntries(order.map((status) => [status, 0])) as Record<S, number>;
}

/** Status counts laid out as chart buckets, in the given (funnel) order. */
export function statusBuckets<S extends string>(
  counts: StatusCounts<S>,
  order: readonly S[],
  labels: Record<S, string>,
): Bucket[] {
  return order.map((status) => ({ label: labels[status], value: counts.byStatus[status] }));
}

/** First day of the month `n - 1` months back — the start of a trend window. */
export function startOfMonthsAgo(n: number, now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() - (n - 1), 1, 0, 0, 0, 0);
}

export interface MonthPoint {
  key: string;
  label: string;
  value: number;
}

/** Safe percentage (0–100), rounded, guarding against divide-by-zero. */
export function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

/** Group items by a string key, sorted by count desc. Blank keys → fallback. */
export function countBy<T>(
  items: T[],
  getKey: (item: T) => string,
  options: { fallback?: string; limit?: number } = {},
): Bucket[] {
  const fallback = options.fallback ?? "Sin especificar";
  const map = new Map<string, number>();
  for (const item of items) {
    const key = (getKey(item) || "").trim() || fallback;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const buckets = [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es"));
  return options.limit ? buckets.slice(0, options.limit) : buckets;
}

/**
 * Count items per status, preserving the given order (for funnels) and
 * including statuses with zero occurrences.
 */
export function tallyStatus<S extends string>(
  items: { status: S }[],
  order: readonly S[],
): { status: S; value: number }[] {
  const map = new Map<S, number>(order.map((status) => [status, 0]));
  for (const item of items) map.set(item.status, (map.get(item.status) ?? 0) + 1);
  return order.map((status) => ({ status, value: map.get(status) ?? 0 }));
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

const monthFormatter = new Intl.DateTimeFormat("es-MX", { month: "short" });

/** The last `n` months (oldest → newest), each with a `YYYY-M` key + label. */
export function lastNMonths(n: number, now: Date = new Date()): Omit<MonthPoint, "value">[] {
  const months: Omit<MonthPoint, "value">[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthFormatter.format(date).replace(".", "");
    months.push({ key: monthKey(date), label });
  }
  return months;
}

/** Count items into the last `n` monthly buckets by their date. */
export function trendByMonth<T>(
  items: T[],
  getDate: (item: T) => Date | null,
  n = 6,
  now: Date = new Date(),
): MonthPoint[] {
  const months = lastNMonths(n, now);
  const index = new Map(months.map((month, i) => [month.key, i]));
  const values = new Array<number>(n).fill(0);
  for (const item of items) {
    const date = getDate(item);
    if (!date) continue;
    const i = index.get(monthKey(date));
    if (i !== undefined) values[i] += 1;
  }
  return months.map((month, i) => ({ ...month, value: values[i] }));
}
