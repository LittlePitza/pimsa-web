import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { Reveal } from "@/components/ui/reveal";
import { missionVision } from "@/content/about";
import { company } from "@/content/company";

/**
 * Mission, vision and values — as an editorial statement, not three equal
 * cards.
 *
 * Three same-sized cards is the layout that makes every corporate site look
 * like the same corporate site (DESIGN.md §6 warns against exactly that
 * centred rhythm). Here the mission carries display weight because it is the
 * one sentence that explains the business; the vision answers it in the
 * margin; the values are a mono checklist, which is how an auditor reads
 * them anyway.
 *
 * Placed late on purpose: nobody picks a supplier from a vision statement,
 * so the proof sections come first and this closes the argument.
 */
export function IdentityStatement({ index = "06" }: { index?: string }) {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden py-24 md:py-32">
      <div className="technical-grid absolute inset-0" aria-hidden />
      <PelletPattern className="absolute top-0 right-0 h-64 w-72 text-green-300/10" />

      <Container className="relative">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <Eyebrow tone="dark">{index} / Identidad</Eyebrow>
            <h2 className="sr-only">Misión, visión y valores</h2>

            {/* The mission at display size — the thesis of the company. */}
            <Reveal>
              <p className="font-display text-paper mt-6 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.2] font-semibold text-balance">
                {missionVision.mission}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-paper/70 text-lead mt-10 max-w-[60ch] border-l-2 border-green-300/40 pl-6">
                {missionVision.vision}
              </p>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="border-t border-blue-400/30 pt-6 lg:mt-2">
              <p className="font-mono text-xs tracking-[0.18em] text-green-300 uppercase">
                Valores operativos
              </p>
              <ul className="mt-6 space-y-0">
                {missionVision.values.map((value) => (
                  <li
                    key={value}
                    className="text-paper/85 flex items-baseline gap-4 border-b border-blue-400/20 py-4 last:border-b-0"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-green-300"
                    />
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
              <p className="text-paper/55 mt-8 font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                {company.tagline}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
