import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceCycle } from "@/components/sections/service-cycle";
import { ServiceFinder } from "@/components/sections/service-finder";
import { ServiceRows } from "@/components/sections/service-rows";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { serviceListSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Servicios de reciclaje industrial de plásticos",
  description:
    "Polímeros de ingeniería reciclados, molienda y peletizado a maquila, recolección de scrap con permisos ambientales y contenedores colapsables industriales.",
  path: "/services",
  keywords: [
    "servicios de reciclaje industrial",
    "reciclaje de plásticos para empresas",
    "maquila de molienda de plástico",
    "compra de scrap plástico industrial",
  ],
});

/**
 * Services hub.
 *
 * It used to be three lines of composition — hero, list, CTA — which made it
 * the thinnest page on the site while being the commercial front door. The
 * order now follows how a buyer actually arrives: they have a situation
 * before they have a service name, so the finder comes first; then the
 * catalogue itself; then the argument for why these four belong together,
 * which is the thing a competitor who only buys scrap or only sells resin
 * cannot say.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd data={serviceListSchema(services)} />

      <PageHero
        eyebrow="Servicios"
        title="Cerramos el círculo del plástico industrial"
        intro="Cuatro servicios integrados: recolectamos tu scrap, lo transformamos y lo devolvemos a la cadena productiva como materia prima recuperada con calidad documentada."
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/services" },
        ]}
      />

      <ServiceFinder index="01" />

      <div className="pt-20 md:pt-28">
        <ServiceRows index="02" />
      </div>

      <ServiceCycle index="03" />

      <CtaBand />
    </>
  );
}
