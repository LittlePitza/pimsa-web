import { ADMIN_LIST_LIMIT } from "@/lib/metrics";

/**
 * "Showing N of M" line for the full listing screens.
 *
 * The listings are capped so one page can never load an entire table. That
 * cap has to be visible: a silently truncated list is worse than a slow one,
 * because nobody can tell that older records exist.
 */
export function ListingCount({
  shown,
  total,
  noun,
}: {
  shown: number;
  total: number;
  /** Plural noun for the records, e.g. "leads", "postulaciones". */
  noun: string;
}) {
  if (total === 0) return null;

  const truncated = shown < total;
  return (
    <p className="text-ink-muted mt-4 font-mono text-xs">
      {truncated ? (
        <>
          Mostrando {shown} de {total} {noun} · los {ADMIN_LIST_LIMIT} más recientes
        </>
      ) : (
        <>
          {total} {noun}
        </>
      )}
    </p>
  );
}
