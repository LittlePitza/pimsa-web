import Image, { type StaticImageData } from "next/image";
import { CardRail } from "@/components/ui/card-rail";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import labPhoto from "../../../public/media/corporate/laboratorio-calidad.jpg";
import pelletLine from "../../../public/media/corporate/peletizado-linea.jpg";
import scrapIndustrial from "../../../public/media/corporate/scrap-industrial.jpg";
import millFeed from "../../../public/media/servicios/molienda-alimentacion.jpg";

/**
 * The material cycle as a documentary contact sheet: real PIMSA process
 * photography paired with the five transformation stages.
 *
 * The frames are deliberately different sizes — a wide establishing shot, two
 * details, a wide closer (DESIGN.md §6: mixed-size cards, not four equal
 * columns, which is what makes a grid read as a template). What they share is
 * the *treatment*: one caption style, one border, one overlay. Varying the
 * size is composition; varying the treatment just looks unfinished.
 *
 * No hover effect on purpose. These figures are not links, and a card that
 * lifts or zooms under the cursor promises a click that never arrives.
 */

interface Shot {
  src: StaticImageData;
  alt: string;
  /** Mono caption, bottom-left. */
  caption: string;
  /** Optional mono tag, bottom-right — the annotated-figure pattern. */
  tag?: string;
  /** Grid span + aspect from `md` up. */
  frame: string;
  /** object-position when the subject isn't centred. */
  position?: string;
  sizes: string;
}

const shots: Shot[] = [
  {
    src: scrapIndustrial,
    alt: "Scrap plástico industrial negro separado para su recuperación",
    caption: "Materia de entrada",
    tag: "Scrap post-industrial",
    frame: "md:col-span-2 md:aspect-[16/10]",
    sizes: "(max-width: 767px) 78vw, (max-width: 1023px) 100vw, (max-width: 1279px) 58vw, 44rem",
  },
  {
    src: millFeed,
    alt: "Alimentación de scrap plástico en el equipo de molienda",
    caption: "Reducción de tamaño",
    tag: "Molienda",
    frame: "md:aspect-[4/3]",
    sizes: "(max-width: 767px) 78vw, (max-width: 1023px) 50vw, (max-width: 1279px) 29vw, 22rem",
  },
  {
    src: pelletLine,
    alt: "Pellet saliendo de una tolva en la línea de PIMSA",
    caption: "Peletizado",
    tag: "Salida",
    frame: "md:aspect-[4/3]",
    position: "object-[50%_62%]",
    sizes: "(max-width: 767px) 78vw, (max-width: 1023px) 50vw, (max-width: 1279px) 29vw, 22rem",
  },
  {
    src: labPhoto,
    alt: "Equipos del laboratorio de control de calidad de PIMSA",
    caption: "Laboratorio y liberación de lote",
    tag: "ISO 9001:2015",
    frame: "md:col-span-2 md:aspect-[16/7]",
    position: "object-[50%_46%]",
    sizes: "(max-width: 767px) 78vw, (max-width: 1023px) 100vw, (max-width: 1279px) 58vw, 44rem",
  },
];

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

function ProcessFigure({ shot }: { shot: Shot }) {
  return (
    <figure
      className={cn(
        "relative h-full overflow-hidden border border-blue-400/30 md:h-auto",
        shot.frame,
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        quality={60}
        sizes={shot.sizes}
        placeholder="blur"
        className={cn("object-cover", shot.position)}
      />
      <figcaption className="bg-navy-900/85 absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 px-3 py-2 font-mono text-[0.65rem] tracking-[0.14em] uppercase">
        <span className="text-blue-400 truncate">{shot.caption}</span>
        {shot.tag ? <span className="text-green-300 shrink-0">{shot.tag}</span> : null}
      </figcaption>
    </figure>
  );
}

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
              {shots.map((shot) => (
                <li
                  key={shot.src.src}
                  className={cn(
                    "w-[78%] shrink-0 snap-start md:w-auto md:shrink",
                    shot.frame.includes("col-span-2") && "md:col-span-2",
                  )}
                >
                  <ProcessFigure shot={shot} />
                </li>
              ))}
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
