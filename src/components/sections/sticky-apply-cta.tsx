/**
 * Mobile sticky bar on a vacancy page: one button, and it applies.
 *
 * The service pages have an equivalent bar whose buttons are "Cotizar" and
 * WhatsApp — a sales bar. Showing that to someone reading a job ad is
 * addressing the wrong person entirely, which is why this exists separately
 * rather than reusing it with different labels.
 *
 * A plain anchor, so it costs no JavaScript and works before hydration —
 * which matters on the phones this bar exists for.
 */
export function StickyApplyCta({ vacancyTitle }: { vacancyTitle: string }) {
  return (
    <div className="sticky-cta bg-surface border-line fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t p-3 md:hidden print:hidden">
      <p className="text-ink-muted min-w-0 flex-1 truncate font-mono text-[0.65rem] tracking-[0.14em] uppercase">
        {vacancyTitle}
      </p>
      <a
        href="#postularme"
        className="bg-navy-500 shrink-0 rounded-sm px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        Postularme
      </a>
    </div>
  );
}
