import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { company } from "@/content/company";
import pelletLine from "../../../public/media/corporate/peletizado-linea.jpg";
import heroPolymer from "../../../public/media/hero-polimero.jpg";

/**
 * Home hero: an editorial-industrial split with real PIMSA process
 * photography, material codes and datasheet-style annotations.
 */
export function Hero() {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden">
      <div className="technical-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(93,134,185,0.16),transparent_38%)]"
        aria-hidden
      />
      <PelletPattern className="absolute -top-8 right-0 h-72 w-96 text-green-300/20" />

      <Container className="relative pt-24 pb-10 sm:pt-28 lg:min-h-[50rem] lg:pt-40 lg:pb-16">
        <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.8fr)] lg:gap-14 xl:gap-20">
          <div className="max-w-3xl lg:pb-12">
            <Eyebrow tone="dark">Cobertura nacional · ISO 9001:2015 · IMMEX</Eyebrow>
            <h1 className="font-display text-display text-paper mt-4 font-bold md:mt-6">
              Scrap que vuelve como <span className="text-green-300">ingeniería</span>
            </h1>
            <p className="text-lead text-paper/80 mt-4 max-w-xl md:mt-7">
              Recuperamos, clasificamos y transformamos plásticos industriales en PC, ABS/PC, PA66,
              PP, POM y otras resinas listas para regresar a producción.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              <ButtonLink href="/contacto" variant="accent" size="lg">
                Solicitar cotización
              </ButtonLink>
              <ButtonLink href="/servicios/polimeros" variant="outline-light" size="lg">
                Ver materiales
              </ButtonLink>
            </div>

            <ul className="mt-8 hidden max-w-xl grid-cols-3 border-y border-blue-400/30 py-4 sm:grid">
              {["Molido", "Pellet", "Scrap"].map((item) => (
                <li
                  key={item}
                  className="border-r border-blue-400/30 text-center font-mono text-xs tracking-[0.16em] text-blue-400 uppercase last:border-r-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <figure className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden border border-blue-400/30">
              <Image
                src={pelletLine}
                alt="Pellet negro descargándose desde una tolva en la planta de PIMSA"
                fill
                preload
                /**
                 * This is the LCP element on mobile. `preload` only emits the
                 * <link rel=preload>; Next never derives fetchPriority from it,
                 * so without this the request lands at Low priority and queues
                 * behind the font files.
                 */
                fetchPriority="high"
                sizes="(max-width: 700px) 82vw, (max-width: 1023px) 30rem, (max-width: 1279px) 34vw, 31rem"
                placeholder="blur"
                className="object-cover object-[52%_62%]"
              />
              <div
                className="from-navy-900/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                aria-hidden
              />
              <span
                aria-hidden
                className="absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2 border-green-300"
              />
              <span
                aria-hidden
                className="absolute -right-px -bottom-px h-6 w-6 border-r-2 border-b-2 border-green-300"
              />

              <div className="absolute right-4 bottom-4 left-[44%] hidden items-end justify-between gap-4 sm:flex">
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.18em] text-blue-400 uppercase">
                    Transformación
                  </p>
                  <p className="font-display mt-1 text-xl font-semibold text-white">
                    Pellet terminado
                  </p>
                </div>
                <span className="bg-navy-900/80 shrink-0 border border-green-300/60 px-3 py-1.5 font-mono text-xs text-green-300">
                  PIMSA / 01
                </span>
              </div>
            </div>

            <div className="border-navy-900 absolute bottom-8 left-0 aspect-square w-[38%] overflow-hidden border-8 shadow-2xl">
              <Image
                src={heroPolymer}
                alt=""
                fill
                sizes="(max-width: 700px) 38vw, (max-width: 1023px) 14rem, 15rem"
                placeholder="blur"
                className="object-cover object-[50%_64%]"
              />
            </div>

            <div
              className="absolute -top-6 -right-7 hidden aspect-square w-24 rounded-full border border-green-300/50 lg:block"
              aria-hidden
            />

            <figcaption className="mt-5 ml-[18%] flex items-center justify-between gap-4 font-mono text-xs tracking-[0.18em] text-blue-400 uppercase">
              <span>Planta La Estancia</span>
              <span className="text-green-300">PC · ABS/PC · PA66 · PP</span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-blue-400/30 pt-4 md:mt-14 lg:mt-8">
          <p className="font-mono text-xs tracking-[0.18em] text-blue-400 uppercase">
            {company.tagline}
          </p>
          <p className="hidden font-mono text-xs tracking-[0.18em] text-blue-400 uppercase sm:block">
            Desde {company.foundedYear}
          </p>
        </div>
      </Container>
    </section>
  );
}
