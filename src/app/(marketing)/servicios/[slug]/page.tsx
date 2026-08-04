import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { AnnotatedFigure } from "@/components/ui/annotated-figure";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getService, services } from "@/content/services";
import { serviceSchema } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";

/**
 * Service detail template ×4 — "datasheet energy" (DESIGN.md §7):
 * annotated figure, mono specs strip, process steps, material/model data,
 * photo gallery, benefits, related services and quote CTA.
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

  /**
   * Section numbers, counted at render rather than hard-coded.
   *
   * `service.index` is the catalogue position ("this is service 03 of 4") and
   * used to double as the section index too, so /polimeros showed "01 /
   * SERVICIO" above "01 / PROCESO" — the same number meaning two different
   * things. The hero now spells its number out in words and the sections keep
   * a sequence of their own.
   *
   * It has to be computed because three of these sections are conditional: a
   * fixed sequence would leave gaps like 01, 02, 04 on the services that
   * don't have a material gallery or a model table.
   */
  let sectionCount = 0;
  const nextIndex = () => String(++sectionCount).padStart(2, "0");
  const sectionIndex = {
    process: nextIndex(),
    materials: service.materialShots?.length ? nextIndex() : undefined,
    models: service.containerModels?.length ? nextIndex() : undefined,
    benefits: nextIndex(),
  };

  return (
    <>
      <JsonLd data={serviceSchema(service)} />

      <PageHero
        eyebrow={`Servicio ${service.index} de ${String(services.length).padStart(2, "0")}`}
        title={service.name}
        intro={service.tagline}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: service.name, path: `/servicios/${service.slug}` },
        ]}
      />

      {/* Description + annotated lead figure */}
      <section className="py-20 md:py-28">
        <Container className="grid items-start gap-14 lg:grid-cols-[7fr_5fr]">
          <div>
            {service.description.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-ink text-lead mt-6 max-w-[68ch] first:mt-0"
              >
                {paragraph}
              </p>
            ))}
            <div className="mt-10 flex flex-wrap gap-2">
              {service.materials.map((material) => (
                <Badge key={material}>{material}</Badge>
              ))}
            </div>
          </div>

          <AnnotatedFigure
            image={service.figure}
            preload
            sizes="(min-width: 1024px) 36rem, calc(100vw - 2.5rem)"
            className="lg:pl-4"
          />
        </Container>
      </section>

      {/* Especificaciones — full-width mono datasheet strip */}
      <section aria-label="Especificaciones" className="border-line border-y">
        <Container className="px-0 md:px-0">
          <dl className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {service.specs.map((spec) => (
              <div key={spec.label} className="bg-paper px-5 py-6 md:px-8 lg:py-8">
                <dt className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
                  {spec.label}
                </dt>
                <dd className="text-navy-500 mt-2 text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Process */}
      <section data-band="dark" className="bg-navy-900 py-20 md:py-28">
        <Container>
          <SectionHeading
            index={sectionIndex.process}
            eyebrow="Proceso"
            title="Cómo trabajamos"
            tone="dark"
          />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title} className="border-t border-blue-400/30 pt-5">
                <Reveal delay={i * 60}>
                  <p className="font-mono text-xs font-medium tracking-[0.18em] text-green-300">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-paper mt-3 text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-paper/70 mt-2 text-sm">{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Material close-ups (polymers) */}
      {service.materialShots?.length ? (
        <section className="py-20 md:py-28">
          <Container>
            <SectionHeading
              index={sectionIndex.materials}
              eyebrow="Materiales"
              title="El material, de cerca"
              intro="Fotografía real de nuestros lotes: molidos y pellets por familia de resina."
            />
            <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-6">
              {service.materialShots.map((shot, i) => (
                <li key={shot.src}>
                  <Reveal delay={i * 50}>
                    <div className="border-line relative aspect-square overflow-hidden border">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes="(min-width: 1280px) 12rem, (min-width: 768px) 30vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="text-navy-500 mt-3 font-mono text-sm font-medium tracking-wider">
                      {shot.code}
                    </p>
                    <p className="text-ink-muted mt-0.5 truncate text-xs" title={shot.name}>
                      {shot.name} · {shot.form}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Container models table */}
      {service.containerModels?.length ? (
        <section className="py-20 md:py-28">
          <Container>
            <SectionHeading
              index={sectionIndex.models}
              eyebrow="Modelos"
              title="Medidas disponibles"
              intro={`${service.containerModels.length} modelos en inventario. Medidas externas en pulgadas (frente × fondo × alto).`}
            />
            <div
              tabIndex={0}
              role="region"
              aria-label="Tabla de modelos de contenedores"
              className="border-line focus-visible:outline-blue-600 mt-12 overflow-x-auto border-t focus-visible:outline-2"
            >
              <table className="w-full min-w-[36rem] text-left">
                <thead>
                  <tr className="border-line border-b">
                    <th scope="col" className="text-ink-muted py-4 pr-6 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                      Clave
                    </th>
                    <th scope="col" className="text-ink-muted py-4 pr-6 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                      Medidas externas (in)
                    </th>
                    <th scope="col" className="text-ink-muted py-4 pr-6 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                      Material
                    </th>
                    <th scope="col" className="text-ink-muted py-4 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                      Color
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {service.containerModels.map((model) => (
                    <tr key={model.code} className="border-line border-b">
                      <td className="py-4 pr-6 font-mono text-sm text-green-600">{model.code}</td>
                      <td className="text-navy-500 py-4 pr-6 text-sm font-medium">{model.size}</td>
                      <td className="text-ink py-4 pr-6 text-sm">{model.material}</td>
                      <td className="text-ink py-4 text-sm">{model.color}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-ink-muted mt-4 text-sm">
              Disponibilidad sujeta a inventario. También ofrecemos renta por proyecto y reparación
              de contenedores.
            </p>
          </Container>
        </section>
      ) : null}

      {/* Photo gallery */}
      {service.gallery.length > 0 ? (
        <section className="pb-20 md:pb-28">
          <Container>
            <div className="grid gap-10 md:grid-cols-2">
              {service.gallery.map((image, i) => (
                <Reveal key={image.src} delay={i * 60}>
                  <AnnotatedFigure
                    image={image}
                    sizes="(min-width: 768px) 50vw, calc(100vw - 2.5rem)"
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Benefits */}
      <section className="border-line border-t py-20 md:py-28">
        <Container>
          <SectionHeading
            index={sectionIndex.benefits}
            eyebrow="Beneficios"
            title="Por qué con PIMSA"
          />
          <ul className="mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <Check
                  aria-hidden
                  strokeWidth={2}
                  className="mt-1 size-5 shrink-0 text-green-600"
                />
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
                    <span className="font-mono text-xs text-green-600">{relatedService.index}</span>
                    <span className="font-display text-navy-500 mt-1 block text-lg font-semibold">
                      {relatedService.name}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="text-ink-muted size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-green-600"
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
