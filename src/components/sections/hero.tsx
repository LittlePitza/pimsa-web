import { HeroMediaBackground } from "@/components/sections/hero-media";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { company } from "@/content/company";
import { heroMedia } from "@/content/home";

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
        <div className="max-w-3xl">
          <Eyebrow tone="dark">
            {company.address.municipality}, {company.address.state} · ISO 9001:2015 · IMMEX
          </Eyebrow>
          <h1 className="font-display text-display text-paper mt-6 font-bold">
            Ingeniería en reciclaje{" "}
            <span className="text-green-300">de plásticos</span>
          </h1>
          <p className="text-lead text-paper/80 mt-7 max-w-xl">
            Transformamos el scrap plástico de la industria en polímeros de ingeniería
            certificados: recolección con permisos ambientales, molienda, peletizado y retorno
            del material a tu cadena productiva.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contacto" variant="accent" size="lg">
              Solicitar cotización
            </ButtonLink>
            <ButtonLink href="/servicios" variant="outline-light" size="lg">
              Conocer servicios
            </ButtonLink>
          </div>
        </div>

        {/* Hairline rule with mono annotation — datasheet detail */}
        <div className="border-blue-400/30 mt-24 flex items-center justify-between border-t pt-4">
          <p className="text-blue-400 font-mono text-xs tracking-[0.18em] uppercase">
            Economía circular industrial
          </p>
          <p className="text-blue-400 hidden font-mono text-xs tracking-[0.18em] uppercase sm:block">
            Desde {company.foundedYear}
          </p>
        </div>
      </Container>
    </section>
  );
}
