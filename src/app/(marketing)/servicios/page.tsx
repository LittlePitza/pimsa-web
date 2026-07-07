import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceRows } from "@/components/sections/service-rows";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Servicios de reciclaje industrial de plásticos",
  description:
    "Polímeros de ingeniería reciclados, molienda y peletizado a maquila, recolección de scrap con permisos ambientales y contenedores colapsables industriales.",
  path: "/servicios",
  keywords: [
    "servicios de reciclaje industrial",
    "reciclaje de plásticos para empresas",
    "maquila de molienda de plástico",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicios"
        title="Cerramos el círculo del plástico industrial"
        intro="Cuatro servicios integrados: recolectamos tu scrap, lo transformamos y lo devolvemos a la cadena productiva como materia prima certificada."
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ]}
      />
      <div className="pt-16 md:pt-24">
        <ServiceRows />
      </div>
      <CtaBand />
    </>
  );
}
