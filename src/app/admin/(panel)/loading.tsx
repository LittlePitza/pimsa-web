/**
 * Panel loading state.
 *
 * Every panel screen queries a MySQL server that lives across the network, so
 * navigation used to be a dead click: nothing moved between clicking a nav
 * link and the server answering. Next streams this instantly while the page
 * awaits its data.
 *
 * The shape deliberately mirrors what actually arrives — a heading, a row of
 * stat tiles, then content blocks — so the layout doesn't lurch when the real
 * page swaps in.
 */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando…</span>

      <div className="skeleton h-8 w-56" />
      <div className="skeleton mt-3 h-4 w-full max-w-md" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="border-line bg-surface rounded-md border p-6">
            <div className="skeleton h-10 w-20" />
            <div className="skeleton mt-3 h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="border-line bg-surface rounded-md border p-6">
            <div className="skeleton h-3 w-32" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 4 }, (_, row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="skeleton h-3 w-28 shrink-0" />
                  <div
                    className="skeleton h-2.5 flex-1"
                    /* Descending widths read as data, not as four identical rows. */
                    style={{ maxWidth: `${90 - row * 18}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
