import { ApplicationForm } from "@/components/sections/application-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Spontaneous application — the path for someone whose profile doesn't match
 * any open vacancy.
 *
 * This used to point at /contacto, which posts to the leads endpoint: the
 * candidate's message landed in the commercial inbox, there was nowhere to
 * attach a CV, and RRHH never saw it. Now it files a real application through
 * the same endpoint as every vacancy, and the panel lists it as "Postulación
 * general".
 */
export function SpontaneousApplication({ index = "05" }: { index?: string }) {
  return (
    <section id="postulacion-general" className="bg-surface border-line border-y py-20 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              index={index}
              eyebrow="Postulación espontánea"
              title="¿No hay una vacante para ti hoy?"
              intro="Déjanos tu CV de todas formas. Se queda registrado en nuestra bolsa y Recursos Humanos lo revisa cuando abrimos una posición que embone con tu perfil."
            />
            <ul className="text-ink-muted mt-8 space-y-3 text-sm">
              <li className="border-line border-t pt-3">
                Llega al mismo lugar que las postulaciones a vacante: directo a Recursos Humanos.
              </li>
              <li className="border-line border-t pt-3">
                Tus datos se usan solo para reclutamiento.
              </li>
            </ul>
          </div>

          <Reveal delay={80}>
            <ApplicationForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
