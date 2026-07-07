import type { Metadata } from "next";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { company, fullAddress, whatsappUrl } from "@/content/company";
import { localBusinessSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contacto y cotizaciones",
  description: `Cotiza recolección de scrap, molienda, peletizado o compra de polímeros reciclados. ${fullAddress()}. WhatsApp ${company.whatsappDisplay}.`,
  path: "/contacto",
  keywords: ["contacto recicladora Apaseo el Grande", "cotizar reciclaje de plástico"],
});

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${company.legalName}, ${fullAddress()}`,
)}`;

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu material"
        intro="Cuéntanos qué scrap generas o qué polímero necesitas. Te respondemos en horario hábil, normalmente el mismo día."
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Contacto", path: "/contacto" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-[7fr_5fr]">
          {/* Form */}
          <div>
            <h2 className="font-display text-navy-500 text-2xl font-semibold">
              Solicita tu cotización
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* NAP + channels (DESIGN.md §7 — split layout) */}
          <aside className="lg:pl-4">
            <div className="border-line bg-surface shadow-card rounded-md border">
              <p className="border-line text-green-600 border-b p-5 font-mono text-xs font-medium tracking-[0.18em] uppercase">
                Datos de contacto
              </p>
              <div className="space-y-6 p-6">
                <div className="flex gap-4">
                  <MapPin aria-hidden strokeWidth={1.5} className="text-blue-600 mt-1 size-5 shrink-0" />
                  <div>
                    <p className="text-ink text-sm">{fullAddress()}</p>
                    <a
                      href={mapsUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-blue-600 mt-1 inline-block text-sm underline"
                    >
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone aria-hidden strokeWidth={1.5} className="text-blue-600 mt-1 size-5 shrink-0" />
                  <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-ink text-sm">
                    {company.phone}
                  </a>
                </div>
                <div className="flex gap-4">
                  <Mail aria-hidden strokeWidth={1.5} className="text-blue-600 mt-1 size-5 shrink-0" />
                  <a href={`mailto:${company.email}`} className="text-ink text-sm">
                    {company.email}
                  </a>
                </div>
                <div className="flex gap-4">
                  <Clock aria-hidden strokeWidth={1.5} className="text-blue-600 mt-1 size-5 shrink-0" />
                  <p className="text-ink text-sm">{company.hours}</p>
                </div>
              </div>
              <div className="border-line border-t p-6">
                <ButtonLink href={whatsappUrl()} variant="primary" className="w-full">
                  Escribir por WhatsApp
                </ButtonLink>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
