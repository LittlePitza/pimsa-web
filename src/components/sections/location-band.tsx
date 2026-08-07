import { MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { locationHighlights } from "@/content/about";
import { company, fullAddress } from "@/content/company";

/**
 * Where the plant is, and why that is a commercial argument.
 *
 * This section exists for two readers at once. The engineer evaluating
 * logistics wants to know how far the material has to travel; and the page
 * targets "recicladora de plásticos Querétaro / Guanajuato", which cannot
 * rank on meta keywords alone — the geography has to be in the body, written
 * for a person.
 *
 * The address is rendered from `company` (the NAP single source of truth), so
 * it can never drift from the footer, the contact page or the LocalBusiness
 * structured data.
 */
export function LocationBand({ index = "07" }: { index?: string }) {
  const { address } = company;

  return (
    <section className="border-line border-t py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              index={index}
              eyebrow="Ubicación"
              title="En el Bajío, junto a la industria que atendemos"
            />

            <Reveal>
              <address className="border-line mt-10 border-t pt-6 not-italic">
                <p className="flex items-start gap-3">
                  <MapPin
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-green-600"
                    strokeWidth={1.5}
                  />
                  <span className="text-ink">
                    <span className="font-display text-navy-500 block font-semibold">
                      Planta {address.locality}
                    </span>
                    <span className="text-ink-muted mt-1 block text-sm">{fullAddress()}</span>
                  </span>
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-muted font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                      Horario
                    </dt>
                    <dd className="text-ink mt-1 text-sm">{company.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                      Teléfono
                    </dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={`tel:${company.phone.replace(/\s/g, "")}`}
                        className="text-blue-600 hover:underline"
                      >
                        {company.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </address>
            </Reveal>

            <div className="mt-8">
              <ButtonLink href="/contacto" variant="outline">
                Agendar una visita
              </ButtonLink>
            </div>
          </div>

          <ul className="grid content-start gap-0">
            {locationHighlights.map((item, i) => (
              <Reveal key={item.label} delay={i * 70} as="li">
                <div className="border-line border-t py-7 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-7">
                  <p className="font-mono text-xs tracking-[0.16em] text-green-600 uppercase">
                    {item.label}
                  </p>
                  <p className="text-ink text-lead mt-3 max-w-[54ch]">{item.value}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
