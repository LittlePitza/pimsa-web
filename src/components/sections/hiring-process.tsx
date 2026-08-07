import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { hiringSteps } from "@/content/careers";

/**
 * What happens after you press send.
 *
 * The single most common anxiety in a job application is silence — not
 * knowing whether anyone received it. These four steps are the real pipeline
 * the panel runs (the application statuses in the database), so the page
 * describes the process that actually exists rather than a comfortable
 * invention.
 *
 * Note the absence of any timeframe: nothing in the system enforces one, and
 * a response time nobody is committed to is worse than no promise at all.
 */
export function HiringProcess({ index = "03" }: { index?: string }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          index={index}
          eyebrow="El proceso"
          title="Qué pasa después de que envías tu CV"
          intro="Sin misterio y sin intermediarios: tu postulación llega directo al equipo de Recursos Humanos."
        />

        <ol className="mt-12 grid gap-px md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {hiringSteps.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 70}>
              <div className="border-line h-full border-t pt-6">
                <p className="font-display text-5xl leading-none font-black tracking-[-0.05em] text-green-600/25">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-navy-500 mt-4 text-lg font-semibold text-balance">
                  {step.title}
                </h3>
                <p className="text-ink-muted mt-2 max-w-[38ch] text-sm leading-6">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
