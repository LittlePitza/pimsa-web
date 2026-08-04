import Image from "next/image";
import { Clock, MapPin, Navigation } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { company, fullAddress } from "@/content/company";
import plantExterior from "../../../public/media/corporate/planta-la-estancia.jpg";

/**
 * Where the job actually is.
 *
 * For a plant role this is often the deciding factor — more than the title
 * and sometimes more than the pay. So it gets its own section with the exact
 * address, the office hours, and a maps link that opens straight into
 * directions, rather than a line of small print in the footer.
 *
 * The maps URL is built from the address string in `company`, so it can
 * never point somewhere the rest of the site doesn't.
 */
export function WorkLocation({ index = "04" }: { index?: string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress())}`;

  return (
    <section className="border-line border-t py-20 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              index={index}
              eyebrow="Ubicación"
              title="Dónde trabajarías"
              intro="Toda nuestra operación está en una sola planta, en el corredor industrial de Apaseo el Grande."
            />

            <Reveal>
              <address className="border-line mt-10 border-t pt-6 not-italic">
                <p className="flex items-start gap-3">
                  <MapPin
                    aria-hidden
                    className="text-green-600 mt-1 size-5 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>
                    <span className="font-display text-navy-500 block font-semibold">
                      Planta {company.address.locality}
                    </span>
                    <span className="text-ink-muted mt-1 block text-sm">{fullAddress()}</span>
                  </span>
                </p>
                <p className="text-ink-muted mt-5 flex items-center gap-3 text-sm">
                  <Clock aria-hidden className="text-green-600 size-5 shrink-0" strokeWidth={1.5} />
                  <span>
                    Oficina: {company.hours}
                    <span className="text-ink-muted/80 block text-xs">
                      Los turnos de planta se detallan en cada vacante.
                    </span>
                  </span>
                </p>
              </address>
            </Reveal>

            <div className="mt-8">
              <ButtonLink
                href={mapsUrl}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation aria-hidden className="size-4" strokeWidth={1.5} />
                Cómo llegar
              </ButtonLink>
            </div>
          </div>

          <Reveal delay={100}>
            <figure>
              <div className="border-line relative aspect-16/10 overflow-hidden border">
                <Image
                  src={plantExterior}
                  alt="Vista exterior de la planta de Plásticos PIMSA en Apaseo el Grande, Guanajuato"
                  fill
                  quality={65}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  placeholder="blur"
                  className="object-cover object-[50%_60%]"
                />
              </div>
              <figcaption className="text-ink-muted mt-3 font-mono text-xs tracking-[0.14em] uppercase">
                La planta por fuera
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
