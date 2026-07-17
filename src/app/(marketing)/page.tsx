import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { CertGrid } from "@/components/sections/cert-grid";
import { CircularityManifesto } from "@/components/sections/circularity-manifesto";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { IndustriesStrip } from "@/components/sections/industries-strip";
import { JobsBand } from "@/components/sections/jobs-band";
import { MaterialAtlas } from "@/components/sections/material-atlas";
import { ProcessLoop } from "@/components/sections/process-loop";
import { ServicesBento } from "@/components/sections/services-bento";
import { StatsBand } from "@/components/sections/stats-band";
import { faqs } from "@/content/faqs";
import { localBusinessSchema, organizationSchema } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Venta de polímeros de ingeniería reciclados",
  description:
    "Compra polímeros de ingeniería reciclados —ABS, PC, PA, POM— con sistema de gestión ISO 9001:2015. Recolección de scrap y maquila de molienda en México.",
  path: "/",
  keywords: [
    "venta de polímeros de ingeniería",
    "comprar polímeros reciclados",
    "polímeros de ingeniería reciclados",
    "ABS PC PA POM reciclado México",
    "polímeros para inyección y extrusión",
    "molienda y peletizado de plásticos",
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
      <MaterialAtlas />
      <ProcessLoop />
      <ServicesBento />
      <StatsBand />
      <CircularityManifesto />
      <CertGrid />
      <FaqSection
        items={faqs.slice(0, 4)}
        index="08"
        intro="Las dudas más comunes de nuestros clientes y prospectos."
        showAllLink
      />
      <JobsBand />
      <CtaBand />
    </>
  );
}
