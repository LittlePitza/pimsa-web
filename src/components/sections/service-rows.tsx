import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/content/services";

/**
 * Services hub as an index/table-of-contents (DESIGN.md §7): each service a
 * full-width row with a big index number, name, summary, photo and arrow.
 * The photo sits desaturated and shifts to full colour on hover.
 *
 * Two things the first version got wrong. It printed `tagline` — the short
 * five-word label — while each service also carries a written `summary` that
 * says what the service actually does; that copy existed and never reached
 * this page. And the photograph was `hidden md:block`, so phones, which are
 * most of the traffic, got a plain text list of an offer that is entirely
 * visual.
 */
export function ServiceRows({ index }: { index?: string }) {
  return (
    <section aria-label={index ? undefined : "Catálogo de servicios"}>
      <Container className="pb-24 md:pb-32">
        {index ? (
          <SectionHeading
            index={index}
            eyebrow="Catálogo"
            title="Los cuatro servicios"
            intro="Cada uno funciona por separado y todos se refuerzan entre sí."
            className="mb-12 md:mb-14"
          />
        ) : null}
        <ul className="border-line border-t">
          {services.map((service, i) => (
            <li key={service.slug} className="border-line border-b">
              <Reveal delay={i * 60}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group grid gap-x-8 gap-y-5 py-8 md:grid-cols-[auto_1fr_11rem_auto] md:items-center md:py-10"
                >
                  {/* Phones get number and photo side by side; the number alone
                      would waste a whole line on a 375px screen. */}
                  <div className="flex items-center gap-5 md:contents">
                    <span
                      aria-hidden
                      className="font-display text-h1 text-line shrink-0 font-bold transition-colors duration-150 group-hover:text-green-500"
                    >
                      {service.index}
                    </span>

                    <span className="border-line relative aspect-4/3 w-28 shrink-0 overflow-hidden border md:order-1 md:w-auto">
                      <Image
                        src={service.figure.src}
                        alt={service.figure.alt}
                        fill
                        sizes="(min-width: 768px) 11rem, 7rem"
                        className="object-cover grayscale-[0.85] transition-[filter,scale] duration-300 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </span>
                  </div>

                  <div className="min-w-0">
                    {/* h3 under the section's own h2: the service names are the
                        catalogue's outline, nested inside it rather than
                        competing with it. */}
                    <h3 className="font-display text-h3 text-navy-500 font-semibold transition-colors group-hover:text-blue-600">
                      {service.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs tracking-[0.14em] text-green-600 uppercase">
                      {service.tagline}
                    </p>
                    <p className="text-ink-muted mt-3 max-w-[62ch]">{service.summary}</p>
                  </div>

                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="text-ink-muted hidden size-7 transition-[translate,color] duration-150 group-hover:translate-x-2 group-hover:text-green-600 md:block"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
