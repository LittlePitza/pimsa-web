import type { Metadata } from "next";
import { CertGrid } from "@/components/sections/cert-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Timeline } from "@/components/sections/timeline";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { missionVision } from "@/content/about";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

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

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Nosotros"
        title="Ingeniería mexicana en economía circular"
        intro={`Desde ${company.foundedYear}, desde el corazón del Bajío industrial, transformamos el scrap plástico de la industria en materia prima recuperada con calidad documentada para todo México.`}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Nosotros", path: "/nosotros" },
        ]}
      />

      {/* Mission / vision / values */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeading
            index="01"
            eyebrow="Identidad"
            title="Lo que nos mueve"
            intro="No somos una recicladora genérica: somos una empresa de ingeniería que convierte el scrap en materia prima recuperada para nuevas aplicaciones."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Card className="h-full">
              <p className="font-mono text-xs tracking-[0.18em] text-green-600 uppercase">Misión</p>
              <p className="text-ink mt-4">{missionVision.mission}</p>
            </Card>
            <Card className="h-full">
              <p className="font-mono text-xs tracking-[0.18em] text-green-600 uppercase">Visión</p>
              <p className="text-ink mt-4">{missionVision.vision}</p>
            </Card>
            <Card className="h-full">
              <p className="font-mono text-xs tracking-[0.18em] text-green-600 uppercase">
                Valores
              </p>
              <ul className="text-ink mt-4 space-y-2">
                {missionVision.values.map((value) => (
                  <li key={value} className="flex items-baseline gap-3">
                    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-green-500" />
                    {value}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <Timeline />
      <CertGrid index="03" />
      <CtaBand
        title="Conoce cómo trabajamos"
        intro="Agenda una visita o cuéntanos qué necesita tu operación; te respondemos el mismo día hábil."
      />
    </>
  );
}
