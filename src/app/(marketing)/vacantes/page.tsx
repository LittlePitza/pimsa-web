import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getOpenVacancies } from "@/db/queries/vacancies";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Bolsa de trabajo — Vacantes en PIMSA",
  description:
    "Únete al equipo de Plásticos PIMSA en Apaseo el Grande, Guanajuato. Consulta las vacantes abiertas en producción, administración y mantenimiento, y postúlate en línea.",
  path: "/vacantes",
  keywords: ["bolsa de trabajo Apaseo el Grande", "vacantes reciclaje Guanajuato", "empleo PIMSA"],
});

export default async function VacanciesPage() {
  const vacancies = await getOpenVacancies();

  return (
    <>
      <PageHero
        eyebrow="Bolsa de trabajo"
        title="Únete al equipo"
        intro="Somos una empresa en crecimiento con más de 15 años dando una segunda vida al plástico industrial. Estas son nuestras vacantes abiertas."
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Bolsa de trabajo", path: "/vacantes" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          {vacancies.length === 0 ? (
            <div className="border-line bg-surface shadow-card max-w-2xl rounded-md border p-8">
              <h2 className="font-display text-navy-500 text-xl font-semibold">
                Por el momento no hay vacantes abiertas
              </h2>
              <p className="text-ink-muted mt-3">
                Nuestro equipo crece constantemente. Escríbenos y guardaremos tu perfil para
                futuras oportunidades.
              </p>
              <ButtonLink href="/contacto" className="mt-6">
                Enviar mis datos
              </ButtonLink>
            </div>
          ) : (
            <ul className="border-line border-t">
              {vacancies.map((vacancy) => (
                <li key={vacancy.id} className="border-line border-b">
                  <Link
                    href={`/vacantes/${vacancy.slug}`}
                    className="group grid items-center gap-x-8 gap-y-3 py-8 md:grid-cols-[1fr_auto] md:py-9"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-h3 text-navy-500 group-hover:text-blue-600 font-semibold transition-colors">
                          {vacancy.title}
                        </h2>
                        <Badge>{vacancy.department}</Badge>
                      </div>
                      <p className="text-ink-muted mt-2 max-w-[68ch]">{vacancy.summary}</p>
                      <p className="text-ink-muted mt-3 flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
                        <MapPin aria-hidden className="size-3.5" strokeWidth={1.5} />
                        {vacancy.location} · {vacancy.employmentType}
                      </p>
                    </div>
                    <span className="text-blue-600 inline-flex items-center gap-2 text-sm font-medium">
                      Ver vacante
                      <ArrowRight
                        aria-hidden
                        strokeWidth={1.5}
                        className="size-4 transition-transform duration-150 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="text-ink-muted mt-10 max-w-[68ch] text-sm">
            ¿No encuentras una vacante para tu perfil? Envíanos tu CV por medio del{" "}
            <Link href="/contacto" className="text-blue-600 underline">
              formulario de contacto
            </Link>{" "}
            y lo tendremos en cuenta para futuras oportunidades.
          </p>
        </Container>
      </section>
    </>
  );
}
