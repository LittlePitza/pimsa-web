import { cn } from "@/lib/utils";

/**
 * Card rail: horizontal snap-scroll on phones, the section's own grid from
 * `md` up. Every card stays in the DOM (nothing hidden from crawlers or
 * screen readers) while long card grids stop stacking into several screens
 * of vertical scroll.
 *
 * Full-bleed via negative margin so cards can scroll past the container
 * gutter; `scroll-px-5` snaps them back in line with the body text. Pass the
 * desktop grid classes through `className`, and give each child a mobile
 * width plus `shrink-0 snap-start` (see callers).
 *
 * `tabIndex` keeps the rail reachable by keyboard: several rails hold cards
 * with no focusable content of their own, which would otherwise be
 * unscrollable without a pointer.
 */
export function CardRail({
  label,
  className,
  children,
}: {
  /** Accessible name for the scrollable region. */
  label: string;
  /** Desktop grid classes, applied from `md` up. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul
      tabIndex={0}
      aria-label={label}
      className={cn(
        "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-3",
        "md:mx-0 md:grid md:snap-none md:scroll-px-0 md:overflow-visible md:px-0 md:pb-0",
        className,
      )}
    >
      {children}
    </ul>
  );
}
