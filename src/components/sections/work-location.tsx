import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { company, fullAddress } from "@/content/company";
import plantExterior from "../../../public/media/corporate/fachada-planta.jpg";

/**
 * Where the job actually is.
 *
 * Commute is often the deciding factor — more than the title and sometimes
 * more than the pay — and it applies as much to an accountant as to a machine
 * operator. So it gets its own section with the exact address and a maps link
 * that opens straight into directions, rather than a line of small print in
 * the footer.
 *
 * No hours here on purpose: the shift belongs to the posting and to RRHH, and
 * publishing one on the site would turn it into a promise the site is making.
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
              intro="Planta y oficinas están en el mismo sitio, en el corredor industrial de Apaseo el Grande — trabajes en producción, en laboratorio o en un escritorio."
            />

            <Reveal>
              <address className="border-line mt-10 border-t pt-6 not-italic">
                <p className="flex items-start gap-3">
                  <MapPin
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-green-600"
                    strokeWidth={1.5}
                  />
                  <span>
                    <span className="font-display text-navy-500 block font-semibold">
                      Planta {company.address.locality}
                    </span>
                    <span className="text-ink-muted mt-1 block text-sm">{fullAddress()}</span>
                  </span>
                </p>
                {/* Sin horario a proposito: el turno lo define Recursos Humanos
                    por puesto, y publicarlo aqui lo volveria un compromiso del
                    sitio. Cada vacante lleva el suyo. */}
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
                  className="object-cover object-[50%_58%]"
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
