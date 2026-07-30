import Image from "next/image";
import { CardRail } from "@/components/ui/card-rail";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import labPhoto from "../../../public/media/corporate/laboratorio-calidad.jpg";
import pelletLine from "../../../public/media/corporate/peletizado-linea.jpg";
import scrapIndustrial from "../../../public/media/corporate/scrap-industrial.jpg";
import millFeed from "../../../public/media/servicios/molienda-alimentacion.jpg";

/**
 * The material cycle as a documentary contact sheet: real PIMSA process
 * photography paired with the five transformation stages.
 */

const stages = [
  {
    index: "01",
    title: "Recolección de scrap",
    description:
      "Retiramos el scrap plástico de tu planta con unidades autorizadas y documentación ambiental completa.",
  },
  {
    index: "02",
    title: "Clasificación",
    description:
      "Separamos el material por tipo de resina, color y grado para asegurar lotes homogéneos.",
  },
  {
    index: "03",
    title: "Molienda",
    description:
      "Reducimos el material en molinos calibrados con estrictos controles de contaminación cruzada.",
  },
  {
    index: "04",
    title: "Peletizado",
    description:
      "Extruimos y cortamos a pellet uniforme, listo para dosificación directa en máquina.",
  },
  {
    index: "05",
    title: "Re-formulación y laboratorio",
    description:
      "Re-formulamos el material y validamos cada lote en laboratorio bajo nuestro sistema de gestión ISO 9001:2015 antes de liberarlo como materia prima.",
  },
];

export function ProcessLoop() {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden py-12 md:py-24">
      <div className="technical-grid absolute inset-0 opacity-50" aria-hidden />
      <Container>
        <div className="relative">
          <SectionHeading
            index="03"
            eyebrow="Proceso"
            title="De residuo industrial a materia prima"
            intro="Una secuencia documentada de recepción, separación, reducción, peletizado y liberación de material dentro de nuestro sistema de gestión de calidad."
            tone="dark"
          />

          <div className="mt-8 grid gap-8 md:mt-14 md:gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(22rem,5fr)] lg:items-start">
            <CardRail
              label="Planta y proceso PIMSA"
              className="h-56 md:h-auto md:grid-cols-2 lg:sticky lg:top-28"
            >
              <li className="w-[78%] shrink-0 snap-start md:col-span-2 md:w-auto md:shrink">
                <figure className="group relative h-full overflow-hidden border border-blue-400/30 md:aspect-[16/10] md:h-auto">
                  <Image
                    src={scrapIndustrial}
                    alt="Scrap plástico industrial negro separado para su recuperación"
                    fill
                    quality={60}
                    sizes="(max-width: 767px) 78vw, (max-width: 1023px) 100vw, (max-width: 1279px) 58vw, 44rem"
                    placeholder="blur"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                  <div
                    className="from-navy-900/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                    aria-hidden
                  />
                  <figcaption className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 font-mono text-xs tracking-[0.15em] text-white uppercase">
                    <span>Materia de entrada</span>
                    <span className="text-green-300">Scrap post-industrial</span>
                  </figcaption>
                </figure>
              </li>

              <li className="w-[78%] shrink-0 snap-start md:w-auto md:shrink">
                <figure className="relative h-full overflow-hidden border border-blue-400/30 md:aspect-[4/3] md:h-auto">
                  <Image
                    src={millFeed}
                    alt="Alimentación de scrap plástico en el equipo de molienda"
                    fill
                    quality={60}
                    sizes="(max-width: 767px) 78vw, (max-width: 1023px) 50vw, (max-width: 1279px) 29vw, 22rem"
                    placeholder="blur"
                    className="object-cover"
                  />
                  <figcaption className="bg-navy-900/85 absolute right-0 bottom-0 left-0 px-3 py-2 font-mono text-[0.65rem] tracking-[0.14em] text-blue-400 uppercase">
                    Reducción de tamaño
                  </figcaption>
                </figure>
              </li>

              <li className="w-[78%] shrink-0 snap-start md:w-auto md:shrink">
                <figure className="relative h-full overflow-hidden border border-blue-400/30 md:aspect-[4/3] md:h-auto">
                  <Image
                    src={pelletLine}
                    alt="Pellet saliendo de una tolva en la línea de PIMSA"
                    fill
                    quality={60}
                    sizes="(max-width: 767px) 78vw, (max-width: 1023px) 50vw, (max-width: 1279px) 29vw, 22rem"
                    placeholder="blur"
                    className="object-cover object-[50%_62%]"
                  />
                  <figcaption className="bg-navy-900/85 absolute right-0 bottom-0 left-0 px-3 py-2 font-mono text-[0.65rem] tracking-[0.14em] text-blue-400 uppercase">
                    Peletizado
                  </figcaption>
                </figure>
              </li>

              <li className="w-[78%] shrink-0 snap-start md:col-span-2 md:w-auto md:shrink">
                <figure className="relative h-full overflow-hidden border border-blue-400/30 md:aspect-[16/7] md:h-auto">
                  <Image
                    src={labPhoto}
                    alt="Equipos del laboratorio de control de calidad de PIMSA"
                    fill
                    quality={60}
                    sizes="(max-width: 767px) 78vw, (max-width: 1023px) 100vw, (max-width: 1279px) 58vw, 44rem"
                    placeholder="blur"
                    className="object-cover object-[50%_46%]"
                  />
                  <div className="bg-navy-900/25 absolute inset-0" aria-hidden />
                  <figcaption className="bg-navy-900/85 absolute right-0 bottom-0 left-0 px-3 py-2 font-mono text-[0.65rem] tracking-[0.14em] text-blue-400 uppercase">
                    Laboratorio y liberación de lote
                  </figcaption>
                </figure>
              </li>
            </CardRail>

            <ol className="relative border-l border-blue-400/30">
              {stages.map((stage, i) => (
                <li key={stage.index} className="relative pb-9 pl-8 last:pb-0 md:pl-10">
                  <span
                    aria-hidden
                    className="bg-navy-900 absolute top-1.5 -left-[5px] size-2.5 rounded-full ring-2 ring-green-300"
                  />
                  <Reveal delay={i * 55}>
                    <div className="flex items-baseline gap-4">
                      <p className="font-mono text-xs font-medium tracking-[0.18em] text-green-300">
                        {stage.index}
                      </p>
                      <h3 className="font-display text-paper text-xl font-semibold md:text-2xl">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-[52ch] text-sm leading-6 text-blue-400 md:text-base">
                      {stage.description}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
