import { Container } from "@/components/ui/container";
import { industries } from "@/content/company";

/** Mono strip of served industries (DESIGN.md §7 — home). */
export function IndustriesStrip() {
  return (
    <section aria-label="Industrias que atendemos" className="border-line border-b">
      <Container className="flex flex-nowrap items-center gap-x-6 overflow-x-auto py-4 md:flex-wrap md:gap-x-10 md:gap-y-3 md:overflow-visible md:py-6">
        <p className="text-ink-muted shrink-0 font-mono text-xs tracking-[0.18em] uppercase">
          Industrias que atendemos
        </p>
        <ul className="flex shrink-0 flex-nowrap gap-x-7 md:flex-wrap md:gap-x-10 md:gap-y-2">
          {industries.map((industry) => (
            <li
              key={industry}
              className="text-navy-500 font-mono text-xs font-medium tracking-wider whitespace-nowrap uppercase md:text-sm"
            >
              {industry}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
