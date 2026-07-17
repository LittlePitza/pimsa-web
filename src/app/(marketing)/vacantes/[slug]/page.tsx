import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { ApplicationForm } from "@/components/sections/application-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { getOpenVacancies, getOpenVacancyBySlug } from "@/db/queries/vacancies";
import { jobPostingSchema } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender open vacancies at build; dynamicParams stays true (default) so
 * vacancies published after the deploy still resolve on demand.
 */
export async function generateStaticParams() {
  const vacancies = await getOpenVacancies();
  return vacancies.map((vacancy) => ({ slug: vacancy.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await getOpenVacancyBySlug(slug);
  if (!vacancy) return {};

  return buildMetadata({
    title: `${vacancy.title} — Vacante`,
    description: vacancy.summary,
    path: `/vacantes/${vacancy.slug}`,
  });
}

export default async function VacancyPage({ params }: Props) {
  const { slug } = await params;
  const vacancy = await getOpenVacancyBySlug(slug);
  if (!vacancy) notFound();

  const specs = [
    { label: "Área", value: vacancy.department },
    { label: "Ubicación", value: vacancy.location },
    { label: "Jornada", value: vacancy.employmentType },
    ...(vacancy.salaryRange ? [{ label: "Sueldo", value: vacancy.salaryRange }] : []),
  ];

  return (
    <>
      <JsonLd data={jobPostingSchema(vacancy)} />

      <PageHero
        eyebrow="Vacante"
        title={vacancy.title}
        intro={vacancy.summary}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Bolsa de trabajo", path: "/vacantes" },
          { name: vacancy.title, path: `/vacantes/${vacancy.slug}` },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-[7fr_5fr]">
          <div>
            {vacancy.description.split(/\n{2,}/).map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-ink mt-5 max-w-[68ch] first:mt-0">
                {paragraph}
              </p>
            ))}

            <h2 className="font-display text-navy-500 mt-10 text-xl font-semibold">Requisitos</h2>
            <ul className="mt-4 space-y-3">
              {vacancy.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-3">
                  <Check aria-hidden strokeWidth={2} className="text-green-600 mt-1 size-5 shrink-0" />
                  <span className="text-ink">{requirement}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display text-navy-500 mt-10 text-xl font-semibold">Ofrecemos</h2>
            <ul className="mt-4 space-y-3">
              {vacancy.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check aria-hidden strokeWidth={2} className="text-green-600 mt-1 size-5 shrink-0" />
                  <span className="text-ink">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pl-4">
            <div className="border-line bg-surface shadow-card rounded-md border">
              <p className="border-line text-green-600 border-b p-5 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                Datos de la vacante
              </p>
              <dl>
                {specs.map((spec) => (
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

      {/* Application form */}
      <section id="postularme" className="border-line border-t py-16 md:py-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-h2 text-navy-500 font-semibold">Postúlate</h2>
          <p className="text-ink-muted mt-4">
            Llena el formulario y adjunta tu CV (PDF o Word, máximo 5 MB). Nuestro equipo de
            Recursos Humanos revisará tu perfil y te contactará.
          </p>
          <div className="mt-10">
            <ApplicationForm vacancySlug={vacancy.slug} vacancyTitle={vacancy.title} />
          </div>
        </Container>
      </section>
    </>
  );
}
