import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getService, services } from "@/content/services";
import { serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * Service detail template ×4 — "datasheet energy" (DESIGN.md §7):
 * specs block in mono, process steps, benefits, related services, quote CTA.
 */

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/servicios/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((relatedSlug) => getService(relatedSlug))
    .filter((s) => s !== undefined);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />

      <PageHero
        index={service.index}
        eyebrow="Servicio"
        title={service.name}
        intro={service.tagline}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: service.name, path: `/servicios/${service.slug}` },
        ]}
      />

      {/* Description + specs datasheet */}
      <section className="py-20 md:py-28">
        <Container className="grid gap-14 lg:grid-cols-[7fr_5fr]">
          <div>
            {service.description.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-ink text-lead mt-6 max-w-[68ch] first:mt-0">
                {paragraph}
              </p>
            ))}
            <div className="mt-10 flex flex-wrap gap-2">
              {service.materials.map((material) => (
                <Badge key={material}>{material}</Badge>
              ))}
            </div>
          </div>

          {/* Especificaciones — mono datasheet block */}
          <aside aria-label="Especificaciones" className="lg:pl-4">
            <div className="border-line bg-surface shadow-card rounded-md border">
              <p className="border-line text-green-600 border-b p-5 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                Especificaciones
              </p>
              <dl>
                {service.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="border-line grid grid-cols-[1fr_2fr] gap-4 border-b p-5 last:border-0"
                  >
                    <dt className="text-ink-muted font-mono text-xs tracking-wider uppercase">
                      {spec.label}
                    </dt>
                    <dd className="text-ink text-sm font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </Container>
      </section>

      {/* Process */}
      <section data-band="dark" className="bg-navy-900 py-20 md:py-28">
        <Container>
          <SectionHeading index={service.index} eyebrow="Proceso" title="Cómo trabajamos" tone="dark" />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title} className="border-blue-400/30 border-t pt-5">
                <Reveal delay={i * 60}>
                  <p className="text-green-300 font-mono text-xs font-medium tracking-[0.18em]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-paper mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="text-paper/70 mt-2 text-sm">{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Beneficios" title="Por qué con PIMSA" />
          <ul className="mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <Check aria-hidden strokeWidth={2} className="text-green-600 mt-1 size-5 shrink-0" />
                <span className="text-ink">{benefit}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Related services — strong internal linking (PLAN.md §5) */}
      {related.length > 0 ? (
        <section className="pb-20 md:pb-28">
          <Container>
            <p className="text-ink-muted font-mono text-xs tracking-[0.18em] uppercase">
              Servicios relacionados
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {related.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  href={`/servicios/${relatedService.slug}`}
                  className="group border-line bg-surface shadow-card hover:shadow-lift flex items-center justify-between gap-4 rounded-md border p-6 transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5"
                >
                  <span>
                    <span className="text-green-600 font-mono text-xs">{relatedService.index}</span>
                    <span className="font-display text-navy-500 mt-1 block text-lg font-semibold">
                      {relatedService.name}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="text-ink-muted group-hover:text-green-600 size-5 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        title={`Cotiza ${service.name.toLowerCase()}`}
        intro="Cuéntanos material, volúmenes y ubicación; te respondemos el mismo día hábil."
      />
      <StickyMobileCta service={service.name} />
    </>
  );
}
