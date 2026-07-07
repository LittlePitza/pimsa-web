import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqSection } from "@/components/sections/faq-section";
import { PageHero } from "@/components/sections/page-hero";
import { faqs } from "@/content/faqs";
import { faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Preguntas frecuentes sobre reciclaje de plásticos",
  description:
    "Respuestas a las dudas más comunes: qué materiales compramos, cobertura de recolección, certificaciones, presentaciones de venta y cómo cotizar.",
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <PageHero
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        intro="Todo lo que necesitas saber antes de vender tu scrap o comprar material reciclado. ¿No encuentras tu respuesta? Escríbenos."
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Preguntas frecuentes", path: "/preguntas-frecuentes" },
        ]}
      />

      <FaqSection items={faqs} index="01" title="Dudas comunes" />

      <CtaBand
        title="¿Tienes otra pregunta?"
        intro="Escríbenos por WhatsApp o llena el formulario; te respondemos el mismo día hábil."
      />
    </>
  );
}
