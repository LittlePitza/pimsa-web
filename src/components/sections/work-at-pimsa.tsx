import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyWorkHere } from "@/content/careers";
import pelletLine from "../../../public/media/corporate/peletizado-linea.jpg";

/**
 * What the company is, explained to a candidate instead of a buyer.
 *
 * Someone applying for a plant job does not care about "economía circular"
 * or "polímeros de ingeniería" — they want to know what they would actually
 * be doing, whether the place is organised, and whether it will still be
 * here next year. Each point answers one of those, in facts.
 */
export function WorkAtPimsa({ index = "02" }: { index?: string }) {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden py-20 md:py-28">
      <div className="technical-grid absolute inset-0 opacity-50" aria-hidden />
      <PelletPattern className="absolute right-0 bottom-0 h-48 w-64 text-green-300/10" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              index={index}
              eyebrow="Trabajar en PIMSA"
              title="Qué hacemos aquí, en corto"
              intro="Recogemos el plástico que sobra en las fábricas de la región, lo procesamos y lo devolvemos convertido en materia prima. Ese negocio necesita gente en planta, pero también en laboratorio, logística, compras, sistemas y el área comercial."
              tone="dark"
            />

            <dl className="mt-10 grid gap-0">
              {whyWorkHere.map((item, i) => (
                <Reveal key={item.label} delay={i * 60}>
                  <div className="border-t border-blue-400/25 py-5">
                    <dt className="font-mono text-xs tracking-[0.16em] text-green-300 uppercase">
                      {item.label}
                    </dt>
                    <dd className="text-paper/80 mt-2 max-w-[56ch]">{item.value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal delay={120}>
            <figure className="relative">
              <div className="relative aspect-4/5 overflow-hidden border border-blue-400/30">
                <Image
                  src={pelletLine}
                  alt="Operador trabajando junto a la línea de peletizado en la planta de PIMSA"
                  fill
                  quality={65}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  placeholder="blur"
                  className="object-cover object-[50%_62%]"
                />
                <div
                  className="from-navy-900/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-xs tracking-[0.14em] text-blue-400 uppercase">
                <span>Línea de peletizado</span>
                <span className="text-green-300">Planta El Castillo</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
