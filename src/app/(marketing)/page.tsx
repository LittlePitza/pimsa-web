import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { CertGrid } from "@/components/sections/cert-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { IndustriesStrip } from "@/components/sections/industries-strip";
import { JobsBand } from "@/components/sections/jobs-band";
import { ProcessLoop } from "@/components/sections/process-loop";
import { ServicesBento } from "@/components/sections/services-bento";
import { StatsBand } from "@/components/sections/stats-band";
import { faqs } from "@/content/faqs";
import { localBusinessSchema, organizationSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ingeniería en polímeros reciclados en México",
  description:
    "Ingeniería en polímeros: recolección de scrap industrial, molienda, peletizado y venta de polímeros de ingeniería reciclados con certificación ISO 9001:2015 para automotriz, línea blanca y electrónica.",
  path: "/",
  keywords: [
    "ingeniería en polímeros",
    "polímeros de ingeniería reciclados",
    "reciclaje de plásticos de ingeniería",
    "economía circular México",
    "recolección de scrap plástico",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={localBusinessSchema()} />

      <Hero />
      <IndustriesStrip />
      <ProcessLoop />
      <ServicesBento />
      <StatsBand />
      <CertGrid />
      <FaqSection
        items={faqs.slice(0, 4)}
        index="06"
        intro="Las dudas más comunes de nuestros clientes y prospectos."
        showAllLink
      />
      <JobsBand />
      <CtaBand />
    </>
  );
}
