import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * The material cycle as narrative (DESIGN.md §1.2, §7): scrap advances
 * through the process as the user scrolls. The loop stroke draws forward
 * with CSS scroll-driven animation where supported; it degrades to a
 * static diagram + vertical timeline otherwise.
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
    title: "Retorno a producción",
    description:
      "El material vuelve a la cadena productiva como polímero de ingeniería con calidad certificada.",
  },
];

export function ProcessLoop() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Proceso"
          title="El ciclo del material"
          intro="Del scrap industrial al polímero de ingeniería: un ciclo completo, documentado y certificado bajo ISO 9001:2015."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[5fr_7fr]">
          {/* The loop — signature geometric motif */}
          <div className="relative mx-auto hidden max-w-sm items-start lg:flex">
            <svg viewBox="0 0 320 320" className="sticky top-32 w-full" aria-hidden>
              <circle cx="160" cy="160" r="130" className="stroke-line" strokeWidth="1" fill="none" />
              <circle
                cx="160"
                cy="160"
                r="130"
                pathLength="1"
                className="loop-draw stroke-green-500"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 160 160)"
              />
              <text
                x="160"
                y="150"
                textAnchor="middle"
                className="fill-navy-500 font-display text-[26px] font-semibold"
              >
                Ciclo
              </text>
              <text
                x="160"
                y="180"
                textAnchor="middle"
                className="fill-ink-muted font-mono text-[12px] tracking-[0.2em] uppercase"
              >
                del material
              </text>
            </svg>
          </div>

          {/* Stages along a vertical rule */}
          <ol className="border-line relative border-l">
            {stages.map((stage, i) => (
              <li key={stage.index} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
                <span
                  aria-hidden
                  className="bg-green-500 absolute top-1.5 -left-[5px] size-2.5 rounded-full"
                />
                <Reveal delay={i * 60}>
                  <p className="text-green-600 font-mono text-xs font-medium tracking-[0.18em]">
                    {stage.index}
                  </p>
                  <h3 className="font-display text-h3 text-navy-500 mt-2 font-semibold">
                    {stage.title}
                  </h3>
                  <p className="text-ink-muted mt-3 max-w-[52ch]">{stage.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
