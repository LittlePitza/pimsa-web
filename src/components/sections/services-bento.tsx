import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

const serviceLayout = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"] as const;

/** Image-led service grid using the real operational photography. */
export function ServicesBento() {
  return (
    <section className="bg-surface py-20 md:py-24">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Servicios"
          title="Materia prima primero, servicios que cierran el ciclo"
          intro="Polímeros de ingeniería listos para producción — respaldados por los servicios que los hacen posibles: recolección de scrap, molienda y peletizado."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {services.map((service, i) => {
            const featured = i === 0;
            const wide = i === 0 || i === 3;
            return (
              <Reveal key={service.slug} delay={i * 60} className={cn("min-w-0", serviceLayout[i])}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group border-line shadow-card hover:shadow-lift block h-full overflow-hidden rounded-sm border bg-white transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5"
                >
                  <div className="flex h-full flex-col">
                    <div
                      className={cn(
                        "bg-navy-900 relative overflow-hidden",
                        featured ? "aspect-[16/8]" : "aspect-[16/9]",
                      )}
                    >
                      <Image
                        src={service.figure.src}
                        alt={service.figure.alt}
                        fill
                        sizes={
                          wide
                            ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 58vw"
                            : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 42vw"
                        }
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                      <div
                        className="from-navy-900/90 to-navy-900/10 absolute inset-0 bg-gradient-to-t via-transparent"
                        aria-hidden
                      />
                      <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-4">
                        <span className="text-navy-900 bg-green-500 px-3 py-1.5 font-mono text-xs font-semibold tracking-[0.14em]">
                          {service.index}
                        </span>
                        {service.figure.tag ? (
                          <span className="bg-navy-900/80 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.14em] text-blue-400 uppercase backdrop-blur-sm">
                            {service.figure.tag}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <h3 className="font-display text-navy-500 text-2xl font-semibold md:text-[1.75rem]">
                        {service.name}
                      </h3>
                      <p className="text-ink-muted mt-3 max-w-[58ch] text-sm">{service.summary}</p>

                      {featured ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {service.materials.slice(0, 6).map((material) => (
                            <Badge key={material}>{material}</Badge>
                          ))}
                        </div>
                      ) : null}

                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-blue-600">
                        Ver servicio
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform duration-150 group-hover:translate-x-1"
                          strokeWidth={1.5}
                        />
                      </span>
                    </div>
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
