import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { ApplicationForm } from "@/components/sections/application-form";
import { HiringProcess } from "@/components/sections/hiring-process";
import { PageHero } from "@/components/sections/page-hero";
import { StickyApplyCta } from "@/components/sections/sticky-apply-cta";
import { Container } from "@/components/ui/container";
import { getOpenVacancies, getOpenVacancyBySlug } from "@/db/queries/vacancies";
import { employmentTypeLabels, workModeLabels } from "@/lib/labels";
import { jobPostingSchema } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";
import { MAX_CV_LABEL } from "@/lib/uploads";
import { vacancyLocation, vacancyParagraphs, vacancySalaryLabel } from "@/lib/vacancy";

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
    path: `/jobs/${vacancy.slug}`,
  });
}

export default async function VacancyPage({ params }: Props) {
  const { slug } = await params;
  const vacancy = await getOpenVacancyBySlug(slug);
  if (!vacancy) notFound();

  // Empty values are dropped rather than rendered as a blank row.
  const specs = [
    { label: "Área", value: vacancy.department },
    { label: "Ubicación", value: vacancyLocation(vacancy) },
    { label: "Modalidad", value: workModeLabels[vacancy.workMode] },
    { label: "Jornada", value: employmentTypeLabels[vacancy.employmentType] },
    { label: "Sueldo", value: vacancySalaryLabel(vacancy) },
    { label: "Plazas", value: vacancy.openings > 1 ? String(vacancy.openings) : "" },
  ].filter((spec) => spec.value);

  return (
    <>
      <JsonLd data={jobPostingSchema(vacancy)} />

      <PageHero
        eyebrow="Vacante"
        title={vacancy.title}
        intro={vacancy.summary}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Bolsa de trabajo", path: "/jobs" },
          { name: vacancy.title, path: `/jobs/${vacancy.slug}` },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-[7fr_5fr]">
          <div>
            {/* pre-line keeps the single line breaks RRHH typed — the feed
                renders those as <br>, so without it the page and the job
                boards would show the same posting differently. */}
            {vacancyParagraphs(vacancy.description).map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-ink mt-5 max-w-[68ch] whitespace-pre-line first:mt-0"
              >
                {paragraph}
              </p>
            ))}

            <h2 className="font-display text-navy-500 mt-10 text-xl font-semibold">Requisitos</h2>
            <ul className="mt-4 space-y-3">
              {vacancy.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-3">
                  <Check
                    aria-hidden
                    strokeWidth={2}
                    className="mt-1 size-5 shrink-0 text-green-600"
                  />
                  <span className="text-ink">{requirement}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display text-navy-500 mt-10 text-xl font-semibold">Ofrecemos</h2>
            <ul className="mt-4 space-y-3">
              {vacancy.benefits.map((benefit) => (
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
          </div>

          <aside className="lg:pl-4">
            <div className="border-line bg-surface shadow-card rounded-md border">
              <p className="border-line border-b p-5 font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
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
      <section id="postularme" className="bg-surface border-line border-t py-16 md:py-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-h2 text-navy-500 font-semibold">Postúlate</h2>
          <p className="text-ink-muted mt-4">
            Llena el formulario y adjunta tu CV (PDF o Word, máximo {MAX_CV_LABEL}). Tu postulación
            llega directo a Recursos Humanos.
          </p>
          <div className="mt-10">
            <ApplicationForm vacancySlug={vacancy.slug} vacancyTitle={vacancy.title} />
          </div>
        </Container>
      </section>

      <HiringProcess index="02" />

      <section className="border-line border-t py-14">
        <Container>
          <p className="text-ink-muted max-w-[68ch]">
            ¿Esta vacante no es para ti?{" "}
            <Link href="/jobs" className="text-blue-600 underline">
              Vuelve a la bolsa de trabajo
            </Link>{" "}
            o{" "}
            <Link href="/jobs#postulacion-general" className="text-blue-600 underline">
              déjanos tu CV
            </Link>{" "}
            para futuras oportunidades.
          </p>
        </Container>
      </section>

      {/* Bottom padding so the sticky bar never covers the last line on mobile. */}
      <div aria-hidden className="h-20 md:hidden" />
      <StickyApplyCta vacancyTitle={vacancy.title} />
    </>
  );
}
