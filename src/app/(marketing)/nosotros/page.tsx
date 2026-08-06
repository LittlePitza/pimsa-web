import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { AboutDatasheet } from "@/components/sections/about-datasheet";
import { CertGrid } from "@/components/sections/cert-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { IdentityStatement } from "@/components/sections/identity-statement";
import { LocationBand } from "@/components/sections/location-band";
import { PageHero } from "@/components/sections/page-hero";
import { PlantShowcase } from "@/components/sections/plant-showcase";
import { StatsBand } from "@/components/sections/stats-band";
import { Timeline } from "@/components/sections/timeline";
import { operationFigures } from "@/content/about";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";
import { aboutPageSchema } from "@/lib/structured-data";
import warehouseHall from "../../../../public/media/corporate/almacen-nave.jpg";

const breadcrumbs = [
  { name: "Inicio", path: "/" },
  { name: "Nosotros", path: "/nosotros" },
];

export const metadata: Metadata = buildMetadata({
  title: "Nosotros — recicladora de plásticos de ingeniería",
  description: `Producimos polímeros de ingeniería reciclados desde ${company.foundedYear} en el Bajío, con entrega a todo México. ISO 9001:2015 y registros IMMEX y DUNS.`,
  path: "/nosotros",
  keywords: [
    "empresa recicladora de plásticos Querétaro",
    "empresa recicladora de plásticos Guanajuato",
    "recicladora de plásticos de ingeniería",
    "polímeros de ingeniería reciclados México",
    "Plásticos PIMSA",
  ],
});

/**
 * About page, ordered for the person who actually reads it: a purchasing or
 * quality engineer deciding whether PIMSA can be a supplier.
 *
 * The sequence answers their questions in the order they ask them — who are
 * you, can you handle my volume, is the plant real, will you survive my
 * audit, how long have you been at this, what do you stand for, where are
 * you — and only then asks for the contact. Mission and values come late on
 * purpose: nobody qualifies a supplier from a vision statement, so the
 * evidence goes first.
 *
 * Every section is a self-contained component fed from src/content, which is
 * the composition promise in DESIGN.md §8. All of it renders on the server;
 * the only client JS on the page is the stat counters and the reveal
 * observer.
 */
export default function AboutPage() {
  return (
    <>
      {/* BreadcrumbList is emitted by <Breadcrumbs> inside PageHero — adding a
          second one here would ship conflicting structured data. */}
      <JsonLd data={aboutPageSchema(operationFigures.map((figure) => figure.src))} />

      <PageHero
        index="01"
        eyebrow="Nosotros"
        title="Ingeniería mexicana en economía circular"
        intro={`Desde ${company.foundedYear}, desde el corazón del Bajío industrial, transformamos el scrap plástico de la industria en materia prima recuperada con calidad documentada para todo México.`}
        breadcrumbs={breadcrumbs}
      />
      <AboutDatasheet />

      {/* A different backdrop from the Home band on purpose — the two pages
          are one click apart and the repeat was the first thing that made
          the site read as a template. */}
      <StatsBand index="02" image={warehouseHall} imagePosition="object-[50%_46%]" />
      <PlantShowcase index="03" />
      <CertGrid index="04" />
      <Timeline index="05" />
      <IdentityStatement index="06" />
      <LocationBand index="07" />

      <CtaBand
        title="Conoce cómo trabajamos"
        intro="Agenda una visita a planta o cuéntanos qué necesita tu operación; te respondemos el mismo día hábil."
      />
    </>
  );
}
