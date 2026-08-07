import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { company, fullAddress } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Aviso de privacidad",
    description: `Aviso de privacidad de ${company.legalName} conforme a la LFPDPPP.`,
    path: "/privacy",
  }),
  // TODO(marketing): remove noindex once the legal team delivers the final
  // LFPDPPP text (docs/marketing-material-request.md §3 — P1).
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Aviso de privacidad"
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Aviso de privacidad", path: "/privacy" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <div className="bg-surface shadow-card mb-10 rounded-md border-l-4 border-green-600 p-5">
            <p className="text-ink text-sm">
              <strong>Documento en revisión.</strong> Este texto es una estructura base; el aviso de
              privacidad definitivo conforme a la LFPDPPP será publicado antes del lanzamiento del
              sitio.
            </p>
          </div>

          <div className="[&_h2]:font-display [&_h2]:text-navy-500 [&_p]:text-ink-muted space-y-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3">
            <div>
              <h2>1. Responsable de los datos personales</h2>
              <p>
                {company.legalName}, con domicilio en {fullAddress()}, es responsable del
                tratamiento de los datos personales que nos proporciones.
              </p>
            </div>
            <div>
              <h2>2. Datos que recabamos</h2>
              <p>
                Recabamos los datos de contacto que nos compartes a través del formulario del sitio,
                WhatsApp, teléfono o correo: nombre, empresa, correo electrónico y teléfono.
              </p>
            </div>
            <div>
              <h2>3. Finalidades del tratamiento</h2>
              <p>
                Utilizamos tus datos para atender tus solicitudes de información y cotización, dar
                seguimiento comercial y, en su caso, formalizar la relación de negocio.
              </p>
            </div>
            <div>
              <h2>4. Derechos ARCO</h2>
              <p>
                Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición
                escribiendo a {company.email}.
              </p>
            </div>
            <div>
              <h2>5. Cookies y tecnologías de seguimiento</h2>
              <p>
                Este sitio utiliza cookies de análisis únicamente con tu consentimiento previo.
                Puedes rechazarlas sin que ello afecte la navegación.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
