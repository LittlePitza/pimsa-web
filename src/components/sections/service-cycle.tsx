import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getService } from "@/content/services";

/**
 * Why there are four services and not four unrelated line items.
 *
 * Most companies in this market do one half: they either buy scrap or they
 * sell recycled resin. PIMSA closes the loop, and that is the commercial
 * argument — the same material can leave a customer's plant as waste and come
 * back as feedstock, under one supplier and one set of paperwork. A hub that
 * only lists four services never makes that argument.
 *
 * Containers sit apart on purpose: they are not a stage of the cycle, they
 * are what physically carries the material through it in both directions.
 */

const cycle = [
  {
    slug: "recoleccion-scrap",
    role: "Sale de tu planta",
    detail: "Retiramos el scrap con permisos y documentación por movimiento.",
  },
  {
    slug: "molienda-peletizado",
    role: "Se transforma",
    detail: "Molienda y peletizado en nuestra planta, con control por lote.",
  },
  {
    slug: "polimeros",
    role: "Vuelve como materia prima",
    detail: "Regresa a producción como resina liberada por laboratorio.",
  },
];

export function ServiceCycle({ index = "03" }: { index?: string }) {
  const containers = getService("contenedores");

  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden py-20 md:py-28">
      <div className="technical-grid absolute inset-0 opacity-50" aria-hidden />
      <PelletPattern className="absolute bottom-0 left-0 h-48 w-64 text-green-300/10" />

      <Container className="relative">
        <SectionHeading
          index={index}
          eyebrow="Cómo encajan"
          title="Los cuatro son un solo círculo"
          intro="La mayoría compra scrap o vende resina. Nosotros hacemos el ciclo completo, así que el mismo material puede salir de tu planta como residuo y volver como materia prima, con un solo proveedor y un solo expediente."
          tone="dark"
        />

        <ol className="mt-14 grid gap-px md:grid-cols-3">
          {cycle.map((stage, i) => {
            const service = getService(stage.slug);
            if (!service) return null;

            return (
              <Reveal key={stage.slug} as="li" delay={i * 80}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group flex h-full flex-col border-t border-blue-400/30 pt-6 transition-colors hover:border-green-300 md:pr-8"
                >
                  <p className="font-mono text-xs tracking-[0.16em] text-green-300 uppercase">
                    {stage.role}
                  </p>
                  <h3 className="font-display text-paper mt-3 text-xl font-semibold transition-colors group-hover:text-green-300">
                    {service.name}
                  </h3>
                  <p className="text-paper/70 mt-2 max-w-[36ch] text-sm leading-6">
                    {stage.detail}
                  </p>
                  <span className="mt-5 flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-blue-400 uppercase">
                    {service.index}
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-3.5 transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ol>

        {containers ? (
          <Reveal delay={240}>
            <div className="mt-12 flex flex-col gap-4 border-t border-blue-400/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-paper/70 max-w-[62ch] text-sm">
                <span className="font-mono text-xs tracking-[0.16em] text-green-300 uppercase">
                  Y en ambos sentidos ·{" "}
                </span>
                Los contenedores colapsables son lo que mueve el material por todo el círculo, de
                ida y de vuelta.
              </p>
              <Link
                href={`/servicios/${containers.slug}`}
                className="hover:text-paper group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-green-300 transition-colors"
              >
                {containers.name}
                <ArrowRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 transition-transform duration-150 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
