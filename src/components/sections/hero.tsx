import Image from "next/image";
import { HeroMediaBackground } from "@/components/sections/hero-media";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { company } from "@/content/company";
import { heroMedia } from "@/content/home";
import heroPolymer from "../../../public/media/hero-polimero.jpg";

/**
 * Home hero (DESIGN.md §7): full-height navy band, technical grid,
 * pellet motif corner, display headline, dual CTA. Optionally renders
 * plant video/photo behind the overlay (src/content/home.ts).
 */
export function Hero() {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden">
      <HeroMediaBackground media={heroMedia} />
      <div className="technical-grid absolute inset-0" aria-hidden />
      <PelletPattern className="text-green-300/20 absolute -top-8 right-0 h-72 w-96" />

      <Container className="relative flex min-h-[92svh] flex-col justify-center pt-28 pb-20">
        <div className="flex items-center gap-14 xl:gap-20">
          <div className="max-w-3xl">
            <Eyebrow tone="dark">Cobertura nacional · ISO 9001:2015 · IMMEX</Eyebrow>
            <h1 className="font-display text-display text-paper mt-6 font-bold">
              Polímeros de <span className="text-green-300">ingeniería</span>
            </h1>
            <p className="text-lead text-paper/80 mt-7 max-w-xl">
              La materia prima que tu producto necesita: ABS, PC, PA, POM y más resinas
              recicladas — trituradas, molidas y peletizadas en nuestra planta bajo
              ISO 9001:2015, listas para tu línea de inyección o extrusión.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/contacto" variant="accent" size="lg">
                Solicitar cotización
              </ButtonLink>
              <ButtonLink href="/servicios/polimeros" variant="outline-light" size="lg">
                Ver materiales
              </ButtonLink>
            </div>
          </div>

          {/* Datasheet figure: recycled polymer photo, hidden below lg */}
          <figure className="relative hidden min-w-0 flex-1 lg:block" aria-hidden={false}>
            <div className="border-blue-400/30 relative mx-auto aspect-4/5 max-w-sm border xl:max-w-md">
              <Image
                src={heroPolymer}
                alt="Plástico reciclado molido sostenido en una mano dentro de una planta de reciclaje"
                fill
                priority
                sizes="(min-width: 1280px) 28rem, (min-width: 1024px) 24rem, 1px"
                placeholder="blur"
                className="object-cover object-[50%_62%]"
              />
              {/* Navy wash so the photo sits in the brand palette */}
              <div className="bg-navy-900/25 absolute inset-0 mix-blend-multiply" aria-hidden />
              {/* Green corner ticks — technical drawing detail */}
              <span
                aria-hidden
                className="border-green-300 absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2"
              />
              <span
                aria-hidden
                className="border-green-300 absolute -right-px -bottom-px h-6 w-6 border-r-2 border-b-2"
              />
            </div>
            <figcaption className="text-blue-400 mx-auto mt-4 flex max-w-sm items-center justify-between font-mono text-xs tracking-[0.18em] uppercase xl:max-w-md">
              <span>Fig. 01 — Molido</span>
              <span className="text-green-300">ABS · PC · POM</span>
            </figcaption>
          </figure>
        </div>

        {/* Hairline rule with mono annotation — datasheet detail */}
        <div className="border-blue-400/30 mt-24 flex items-center justify-between border-t pt-4">
          <p className="text-blue-400 font-mono text-xs tracking-[0.18em] uppercase">
            Polímeros de ingeniería · Economía circular
          </p>
          <p className="text-blue-400 hidden font-mono text-xs tracking-[0.18em] uppercase sm:block">
            Desde {company.foundedYear}
          </p>
        </div>
      </Container>
    </section>
  );
}
