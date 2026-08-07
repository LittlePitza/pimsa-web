import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection } from "@/components/sections/faq-section";
import { HiringProcess } from "@/components/sections/hiring-process";
import { JobList } from "@/components/sections/job-list";
import { JobsHero } from "@/components/sections/jobs-hero";
import { SpontaneousApplication } from "@/components/sections/spontaneous-application";
import { WorkAtPimsa } from "@/components/sections/work-at-pimsa";
import { WorkLocation } from "@/components/sections/work-location";
import { candidateFaqs } from "@/content/careers";
import { company } from "@/content/company";
import { getOpenVacancies } from "@/db/queries/vacancies";
import { buildMetadata } from "@/lib/seo";
import { faqPageSchema } from "@/lib/structured-data";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Bolsa de trabajo — Vacantes en PIMSA",
  description: `Vacantes en Plásticos PIMSA, ${company.address.municipality}, ${company.address.state}: producción, mantenimiento, laboratorio, logística, administración, comercial y sistemas. Postúlate en línea con tu CV.`,
  path: "/jobs",
  keywords: [
    "bolsa de trabajo Apaseo el Grande",
    "vacantes Apaseo el Grande",
    "empleo Guanajuato",
    "vacantes administrativas Bajío",
    "trabajo en planta Bajío",
    "vacantes PIMSA",
  ],
});

/**
 * Job board, built for the candidate instead of the buyer.
 *
 * The previous version was a bare list whose only escape hatch — "no veo mi
 * vacante" — pointed at /contact, the SALES form: no CV upload, delivered to
 * the commercial inbox, invisible to RRHH. That is fixed at the root here;
 * every path on this page now files a real application.
 *
 * Order follows what a job seeker asks, in order: what's open, what is this
 * company, what happens after I apply, where would I work, can I apply
 * anyway, and the small print.
 */
export default async function VacanciesPage() {
  const vacancies = await getOpenVacancies();

  return (
    <>
      <JsonLd data={faqPageSchema(candidateFaqs)} />

      <JobsHero
        openCount={vacancies.length}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Bolsa de trabajo", path: "/jobs" },
        ]}
      />

      <JobList vacancies={vacancies} index="01" />
      <WorkAtPimsa index="02" />
      <HiringProcess index="03" />
      <WorkLocation index="04" />
      <SpontaneousApplication index="05" />

      <FaqSection
        items={candidateFaqs}
        index="06"
        title="Dudas antes de postularte"
        intro="Lo que más nos preguntan quienes están por enviar su CV."
      />
    </>
  );
}
