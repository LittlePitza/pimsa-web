import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { milestones } from "@/content/about";

/**
 * Company history along a vertical rule with mono year markers
 * (DESIGN.md §7), built to be read while scrolling rather than skimmed.
 *
 * Three layers of motion, each quieter than the last so they add up to depth
 * instead of noise:
 *   1. the heading pins while the milestones travel past it, the same
 *      sticky rhythm the home process section uses;
 *   2. the rule draws itself downward as the list advances — the line
 *      literally is the passage of time the section describes;
 *   3. each marker fills and its year drifts a few pixels as that milestone
 *      reaches reading position.
 *
 * All of it is scroll-driven CSS (see globals.css): no observer, no scroll
 * listener, no JS at all — and it is tied to scroll position, so scrubbing
 * back up plays it in reverse instead of replaying a canned animation.
 * Browsers without `animation-timeline` get today's static timeline, intact.
 */
export function Timeline({ index = "02" }: { index?: string }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              index={index}
              eyebrow="Historia"
              title="Más de una década cerrando el círculo"
              intro="Cada etapa añadió una capacidad que hoy sostiene la operación: primero recuperar material, después formalizar la empresa, luego certificar el sistema de calidad."
            />
          </div>

          <ol className="border-line timeline-rule max-w-2xl border-l">
            {milestones.map((milestone, i) => (
              <li
                key={milestone.year}
                className="timeline-item relative pb-12 pl-8 last:pb-0 md:pl-12"
              >
                <span
                  aria-hidden
                  className="timeline-marker absolute top-2 -left-[5px] size-2.5 rounded-full bg-green-500"
                />
                <Reveal delay={i * 60}>
                  <p className="timeline-year font-mono text-sm font-medium tracking-[0.18em] text-green-600">
                    {milestone.year}
                  </p>
                  <h3 className="font-display text-navy-500 mt-2 text-xl font-semibold">
                    {milestone.title}
                  </h3>
                  <p className="text-ink-muted mt-2 max-w-[56ch]">{milestone.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
