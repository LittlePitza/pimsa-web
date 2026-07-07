import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { milestones } from "@/content/about";

/** Company history along a vertical rule with mono year markers (DESIGN.md §7). */
export function Timeline() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Historia"
          title="Más de una década cerrando el círculo"
        />

        <ol className="border-line mt-14 max-w-2xl border-l">
          {milestones.map((milestone, i) => (
            <li key={milestone.year} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              <span
                aria-hidden
                className="bg-green-500 absolute top-2 -left-[5px] size-2.5 rounded-full"
              />
              <Reveal delay={i * 60}>
                <p className="text-green-600 font-mono text-sm font-medium tracking-[0.18em]">
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
      </Container>
    </section>
  );
}
