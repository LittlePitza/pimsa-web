import { Container } from "@/components/ui/container";
import { industries } from "@/content/company";

/** Mono strip of served industries (DESIGN.md §7 — home). */
export function IndustriesStrip() {
  return (
    <section aria-label="Industrias que atendemos" className="border-line border-b">
      <Container className="flex flex-wrap items-center gap-x-10 gap-y-3 py-6">
        <p className="text-ink-muted font-mono text-xs tracking-[0.18em] uppercase">
          Industrias que atendemos
        </p>
        <ul className="flex flex-wrap gap-x-10 gap-y-2">
          {industries.map((industry) => (
            <li
              key={industry}
              className="text-navy-500 font-mono text-sm font-medium tracking-wider uppercase"
            >
              {industry}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
