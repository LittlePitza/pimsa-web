import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { workAreas } from "@/content/careers";
import warehouseFloor from "../../../public/media/corporate/nave-produccion.jpg";

/**
 * Job-board hero — deliberately louder than the corporate PageHero.
 *
 * The rest of the site addresses a buyer and earns attention with restraint.
 * This page addresses someone deciding whether to spend twenty minutes
 * writing to us, usually on a phone, often comparing several job ads at
 * once. It gets a photograph, the count of what's open, and one obvious
 * action.
 *
 * The areas strip is the load-bearing detail: from the outside a recycling
 * plant reads as production jobs and nothing else, so the breadth of the
 * operation has to be visible before the first scroll or half the audience
 * self-rejects.
 */
export function JobsHero({ openCount, breadcrumbs }: { openCount: number; breadcrumbs: Crumb[] }) {
  const hasOpenings = openCount > 0;

  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden">
      <Image
        src={warehouseFloor}
        alt=""
        fill
        sizes="100vw"
        quality={55}
        priority
        placeholder="blur"
        className="object-cover object-[50%_52%]"
      />
      <div className="bg-navy-900/85 absolute inset-0 mix-blend-multiply" aria-hidden />
      <div
        className="from-navy-900 via-navy-900/85 to-navy-900/45 absolute inset-0 bg-gradient-to-r"
        aria-hidden
      />
      <PelletPattern className="absolute right-0 bottom-0 h-52 w-72 text-green-300/12" />

      <Container className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        <Breadcrumbs items={breadcrumbs} tone="dark" />

        <div className="mt-10 max-w-3xl">
          <Eyebrow tone="dark">Bolsa de trabajo</Eyebrow>
          <h1 className="font-display text-h1 text-paper mt-4 font-bold text-balance">
            Trabaja con nosotros
          </h1>
          <p className="text-paper/80 text-lead mt-6 max-w-[62ch]">
            Buscamos gente para todas las áreas de la empresa, con o sin experiencia previa en la
            industria del plástico. Todas las vacantes se postulan en línea, con tu CV, y llegan
            directo a Recursos Humanos.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink
              href={hasOpenings ? "#vacantes" : "#postulacion-general"}
              variant="accent"
              size="lg"
            >
              {hasOpenings
                ? `Ver ${openCount} ${openCount === 1 ? "vacante" : "vacantes"}`
                : "Dejar mi CV"}
              <ArrowDown aria-hidden className="size-4" strokeWidth={2} />
            </ButtonLink>
            {hasOpenings ? (
              <ButtonLink href="#postulacion-general" variant="outline-light" size="lg">
                No veo mi puesto
              </ButtonLink>
            ) : null}
          </div>
        </div>

        {/* Breadth of the operation, before anyone assumes it's all plant work. */}
        <ul
          aria-label="Áreas de la empresa"
          className="mt-14 flex flex-wrap gap-x-3 gap-y-2 border-t border-blue-400/30 pt-6"
        >
          {workAreas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-blue-400/35 px-3 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-blue-400 uppercase"
            >
              {area}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
