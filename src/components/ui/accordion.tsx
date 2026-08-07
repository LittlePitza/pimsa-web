import { ChevronDown } from "lucide-react";

/**
 * Accessible accordion built on native <details>/<summary> — works without
 * JS and is fully keyboard-navigable (DESIGN.md §11).
 */
export function AccordionItem({
  index,
  title,
  children,
}: {
  /** Mono index number, e.g. "01". */
  index?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-line border-b">
      <summary className="flex cursor-pointer list-none items-baseline gap-4 py-5 [&::-webkit-details-marker]:hidden">
        {index ? (
          <span className="font-mono text-xs font-medium text-green-600">{index}</span>
        ) : null}
        <span className="text-navy-500 font-display flex-1 text-lg font-medium">{title}</span>
        <ChevronDown
          aria-hidden
          className="text-ink-muted size-5 shrink-0 self-center transition-transform duration-150 group-open:rotate-180"
          strokeWidth={1.5}
        />
      </summary>
      <div className="text-ink-muted max-w-[68ch] pb-6 pl-0 md:pl-9">{children}</div>
    </details>
  );
}

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="border-line border-t">{children}</div>;
}
