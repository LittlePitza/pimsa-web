import { Container } from "@/components/ui/container";
import { identityFacts } from "@/content/about";

/**
 * Identity card directly under the hero: the facts a purchasing or quality
 * engineer checks before reading a single paragraph of prose.
 *
 * Set as a mono definition list on a hairline grid — the brand's datasheet
 * register (DESIGN.md §3). A <dl> rather than a table because these are
 * term/value pairs, not tabular data, and screen readers announce the
 * relationship for free.
 */
export function AboutDatasheet() {
  return (
    <section aria-label="Ficha de identidad" className="border-line border-b">
      <Container>
        <dl className="border-line grid grid-cols-1 gap-px overflow-hidden border-x sm:grid-cols-2 lg:grid-cols-3">
          {identityFacts.map((fact) => (
            <div key={fact.label} className="border-line border-b px-5 py-6 md:px-7 md:py-7">
              <dt className="text-ink-muted font-mono text-[0.65rem] tracking-[0.18em] uppercase">
                {fact.label}
              </dt>
              <dd className="font-display text-navy-500 mt-2 text-lg font-semibold text-balance">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
