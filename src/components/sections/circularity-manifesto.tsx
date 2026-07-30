import Image from "next/image";
import { CheckCircle2, Recycle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import scrapIndustrial from "../../../public/media/corporate/scrap-industrial.jpg";

const circularPractices = [
  "Metodología 5S en la gestión de scrap",
  "Trazabilidad y documentación por recolección",
  "Valorización antes de disposición final",
] as const;

export function CircularityManifesto() {
  return (
    <section data-band="dark" className="bg-forest-800 relative overflow-hidden py-12 md:py-24">
      <PelletPattern className="absolute -right-16 -bottom-16 h-80 w-[32rem] text-green-300/10" />
      <Container className="relative">
        <Eyebrow tone="dark">06 · Compromiso circular</Eyebrow>

        <p className="font-display text-paper mt-7 flex flex-wrap items-center gap-x-[0.22em] text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.055em] uppercase">
          {/* Visible words are decorative typography; readers get the full phrase. */}
          <span className="sr-only">IN RECYCLE WE TRUST.</span>
          <span aria-hidden>IN</span>
          <span
            aria-hidden
            className="text-navy-900 inline-flex aspect-square h-[0.78em] items-center justify-center rounded-full bg-green-500"
          >
            <Recycle className="h-[0.58em] w-[0.58em]" strokeWidth={2.2} />
          </span>
          <span aria-hidden>WE TRUST.</span>
        </p>

        <div className="mt-10 grid gap-4 border-t border-green-300/25 pt-4 lg:grid-cols-[minmax(19rem,5fr)_minmax(0,7fr)]">
          <article className="bg-paper text-navy-900 relative overflow-hidden p-7 md:p-9">
            <span
              aria-hidden
              className="font-display absolute -top-10 -right-6 text-[10rem] leading-none font-black text-green-500/10"
            >
              0
            </span>
            <p className="font-mono text-xs tracking-[0.18em] text-green-600 uppercase">
              Objetivo ambiental
            </p>
            <div className="mt-8">
              <p className="font-display text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.78] font-black tracking-[-0.06em] text-green-600 uppercase">
                Zero
              </p>
              <p className="font-display text-ink-muted text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.88] font-black tracking-[-0.06em] uppercase">
                Waste
              </p>
            </div>
            <p className="text-ink-muted mt-8 max-w-[38ch]">
              Trabajamos para avanzar hacia Zero Waste to Landfill: recuperar valor del residuo
              antes de considerarlo descarte.
            </p>
          </article>

          <article className="relative min-h-[28rem] overflow-hidden">
            <Image
              src={scrapIndustrial}
              alt="Scrap plástico industrial separado para su valorización"
              fill
              quality={60}
              sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 58vw, 44rem"
              placeholder="blur"
              className="object-cover"
            />
            <div
              className="from-navy-900 via-navy-900/45 absolute inset-0 bg-gradient-to-t to-transparent"
              aria-hidden
            />

            <div className="absolute right-0 bottom-0 left-0 p-7 md:p-9">
              <p className="font-mono text-xs tracking-[0.18em] text-green-300 uppercase">
                Del residuo al recurso
              </p>
              <h2 className="font-display text-paper mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
                La circularidad se demuestra en cada retiro, lote y nueva aplicación.
              </h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {circularPractices.map((practice) => (
                  <li
                    key={practice}
                    className="bg-navy-900/75 flex gap-3 border border-blue-400/30 p-4 text-sm text-white backdrop-blur-sm"
                  >
                    <CheckCircle2
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-green-300"
                      strokeWidth={1.8}
                    />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
