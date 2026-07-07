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
  title: "Venta de polímeros de ingeniería reciclados en México",
  description:
    "Compra polímeros de ingeniería reciclados —ABS, PC, PA, POM— triturados, molidos y peletizados bajo ISO 9001:2015. También recolección de scrap y maquila de molienda.",
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
