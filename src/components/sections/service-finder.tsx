import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getService, serviceFinder } from "@/content/services";

/**
 * Situation-first router into the catalogue.
 *
 * The four service names are industry vocabulary — "maquila de peletizado",
 * "polímeros de ingeniería" — and a plant manager with a yard full of scrap
 * has to translate their problem into that vocabulary before they can pick a
 * link. This section does the translation for them: it states the situation
 * in their words and points at the service that answers it.
 *
 * Deliberately above the catalogue rows: it is the cheapest possible way to
 * stop someone bouncing because they weren't sure which of four industrial
 * terms described their own problem.
 */
export function ServiceFinder({ index = "01" }: { index?: string }) {
  return (
    <section className="border-line border-b py-20 md:py-28">
      <Container>
        <SectionHeading
          index={index}
          eyebrow="Por dónde empezar"
          title="¿Cuál es tu situación?"
          intro="Cada caso lleva a un servicio distinto. Si tu operación cae en más de uno, mejor: los cuatro trabajan juntos."
        />

        <ul className="mt-12 grid gap-px md:mt-14 md:grid-cols-2">
          {serviceFinder.map((entry, i) => {
            const service = getService(entry.slug);
            if (!service) return null;

            return (
              <Reveal key={entry.slug} as="li" delay={i * 60}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group border-line hover:border-blue-600 flex h-full flex-col justify-between gap-6 border-t py-6 transition-colors md:pr-8"
                >
                  <p className="text-ink text-lead max-w-[38ch] text-balance">
                    <span aria-hidden className="text-ink-muted/50 mr-2 font-mono text-sm">
                      ↳
                    </span>
                    {entry.need}
                  </p>

                  <p className="flex items-center gap-3">
                    <span className="text-green-600 font-mono text-xs tracking-[0.16em] uppercase">
                      {service.index}
                    </span>
                    <span className="font-display text-navy-500 group-hover:text-blue-600 font-semibold transition-colors">
                      {service.name}
                    </span>
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.5}
                      className="text-ink-muted group-hover:text-green-600 size-4 transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
