import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/content/services";

/** Services bento grid on home (DESIGN.md §7): 1 large + rest small. */
export function ServicesBento() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Servicios"
          title="Un solo aliado para todo el ciclo"
          intro="Cuatro servicios que cierran el círculo del plástico industrial: del residuo a la materia prima."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const featured = i === 0;
            return (
              <Reveal key={service.slug} delay={i * 60} className={featured ? "lg:col-span-2 lg:row-span-1" : ""}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group bg-surface border-line shadow-card hover:shadow-lift block h-full rounded-md border p-7 transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5"
                >
                  <div className="flex h-full flex-col">
                    <p className="text-green-600 font-mono text-xs font-medium tracking-[0.18em]">
                      {service.index}
                    </p>
                    <h3 className="font-display text-navy-500 mt-3 text-2xl font-semibold">
                      {service.name}
                    </h3>
                    <p className="text-ink-muted mt-3 max-w-[52ch] text-sm">{service.summary}</p>

                    {featured ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {service.materials.slice(0, 6).map((material) => (
                          <Badge key={material}>{material}</Badge>
                        ))}
                      </div>
                    ) : null}

                    <span className="text-blue-600 mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium">
                      Ver servicio
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-150 group-hover:translate-x-1"
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
