import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Vacancy } from "@/db/schema";

/**
 * Open vacancies — the first thing on the page, because it is the only
 * reason anyone came.
 *
 * Each row carries the three facts that decide whether a candidate keeps
 * reading: where, what shift, and what it pays. Salary especially: hiding it
 * behind a click is the fastest way to lose an operator comparing three job
 * ads on a phone.
 */
export function JobList({ vacancies, index = "01" }: { vacancies: Vacancy[]; index?: string }) {
  return (
    <section id="vacantes" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          index={index}
          eyebrow="Vacantes abiertas"
          title={
            vacancies.length === 0
              ? "Ahora mismo no tenemos vacantes publicadas"
              : `${vacancies.length} ${vacancies.length === 1 ? "vacante abierta" : "vacantes abiertas"}`
          }
          intro={
            vacancies.length === 0
              ? "Nuestro equipo crece por temporadas. Déjanos tu CV aquí abajo y Recursos Humanos lo revisa en cuanto se abre una posición que embone con tu perfil."
              : "Todas se postulan en línea, desde tu celular, adjuntando tu CV."
          }
        />

        {vacancies.length === 0 ? (
          <div className="border-line mt-10 border-t pt-8">
            <ButtonLink href="#postulacion-general" size="lg">
              Dejar mi CV
            </ButtonLink>
          </div>
        ) : (
          <ul className="border-line mt-10 border-t md:mt-14">
            {vacancies.map((vacancy, i) => (
              <Reveal key={vacancy.id} as="li" delay={i * 60} className="border-line block border-b">
                <Link
                  href={`/vacantes/${vacancy.slug}`}
                  className="group grid items-center gap-x-8 gap-y-4 py-8 md:grid-cols-[1fr_auto] md:py-9"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-h3 text-navy-500 group-hover:text-blue-600 font-semibold transition-colors">
                        {vacancy.title}
                      </h3>
                      {vacancy.department ? <Badge>{vacancy.department}</Badge> : null}
                    </div>

                    <p className="text-ink-muted mt-2 max-w-[68ch]">{vacancy.summary}</p>

                    <ul className="text-ink-muted mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-wider uppercase">
                      <li className="flex items-center gap-2">
                        <MapPin aria-hidden className="size-3.5" strokeWidth={1.5} />
                        {vacancy.location}
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock aria-hidden className="size-3.5" strokeWidth={1.5} />
                        {vacancy.employmentType}
                      </li>
                      {vacancy.salaryRange ? (
                        <li className="text-green-600 font-medium">{vacancy.salaryRange}</li>
                      ) : null}
                    </ul>
                  </div>

                  <span className="text-blue-600 inline-flex items-center gap-2 text-sm font-medium">
                    Ver y postularme
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-4 transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
