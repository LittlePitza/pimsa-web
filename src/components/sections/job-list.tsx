import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Vacancy } from "@/db/schema";
import { employmentTypeLabels, workModeLabels } from "@/lib/labels";
import { slugify } from "@/lib/utils";
import { vacancyLocation, vacancySalaryLabel } from "@/lib/vacancy";

/**
 * Open vacancies — the first thing on the page, because it is the only
 * reason anyone came.
 *
 * Grouped by area rather than listed flat. Two reasons: a candidate scans for
 * their own field and skips the rest, and the grouping itself proves the
 * company hires beyond the plant floor — the assumption that sinks
 * applications to a recycler.
 *
 * The area chips are plain anchors, not a JS filter: they cost nothing, the
 * page stays static, and they work before hydration on the phones most of
 * this traffic arrives on. Grouping only kicks in when there is actually
 * something to group; below that it would be ceremony around three rows.
 */

/** Below this many vacancies a flat list reads better than grouped sections. */
const GROUPING_THRESHOLD = 4;

const UNGROUPED = "Otras áreas";

function groupByArea(vacancies: Vacancy[]): { area: string; items: Vacancy[] }[] {
  const groups = new Map<string, Vacancy[]>();
  for (const vacancy of vacancies) {
    const area = vacancy.department.trim() || UNGROUPED;
    groups.set(area, [...(groups.get(area) ?? []), vacancy]);
  }
  // Most openings first; ties alphabetically so the order is stable.
  return [...groups.entries()]
    .map(([area, items]) => ({ area, items }))
    .sort((a, b) => b.items.length - a.items.length || a.area.localeCompare(b.area, "es"));
}

function JobRow({ vacancy }: { vacancy: Vacancy }) {
  const salary = vacancySalaryLabel(vacancy);

  return (
    <Link
      href={`/vacantes/${vacancy.slug}`}
      className="group grid items-center gap-x-8 gap-y-4 py-7 md:grid-cols-[1fr_auto] md:py-8"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="font-display text-navy-500 text-xl font-semibold transition-colors group-hover:text-blue-600 md:text-2xl">
            {vacancy.title}
          </h4>
          {vacancy.department ? <Badge>{vacancy.department}</Badge> : null}
        </div>

        <p className="text-ink-muted mt-2 max-w-[68ch]">{vacancy.summary}</p>

        <ul className="text-ink-muted mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-wider uppercase">
          <li className="flex items-center gap-2">
            <MapPin aria-hidden className="size-3.5" strokeWidth={1.5} />
            {vacancyLocation(vacancy)}
            {vacancy.workMode !== "onsite" ? ` · ${workModeLabels[vacancy.workMode]}` : ""}
          </li>
          <li className="flex items-center gap-2">
            <Clock aria-hidden className="size-3.5" strokeWidth={1.5} />
            {employmentTypeLabels[vacancy.employmentType]}
          </li>
          {salary ? <li className="font-medium text-green-600">{salary}</li> : null}
        </ul>
      </div>

      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
        Ver y postularme
        <ArrowRight
          aria-hidden
          strokeWidth={1.5}
          className="size-4 transition-transform duration-150 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export function JobList({ vacancies, index = "01" }: { vacancies: Vacancy[]; index?: string }) {
  const groups = groupByArea(vacancies);
  const grouped = vacancies.length >= GROUPING_THRESHOLD && groups.length > 1;

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
              ? "Publicamos posiciones de todas las áreas conforme se abren. Déjanos tu CV aquí abajo y Recursos Humanos lo revisa en cuanto surge algo que embone con tu perfil."
              : "Todas se postulan en línea, desde tu celular, adjuntando tu CV."
          }
        />

        {vacancies.length === 0 ? (
          <div className="border-line mt-10 border-t pt-8">
            <ButtonLink href="#postulacion-general" size="lg">
              Dejar mi CV
            </ButtonLink>
          </div>
        ) : grouped ? (
          <>
            <ul aria-label="Ir a un área" className="mt-10 flex flex-wrap gap-2">
              {groups.map((group) => (
                <li key={group.area}>
                  <a
                    href={`#area-${slugify(group.area)}`}
                    className="border-line text-ink inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors hover:border-blue-600 hover:text-blue-600"
                  >
                    {group.area}
                    <span className="text-ink-muted font-mono text-xs">{group.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 space-y-14">
              {groups.map((group, gi) => (
                <div key={group.area} id={`area-${slugify(group.area)}`} className="scroll-mt-28">
                  <div className="border-line flex items-baseline justify-between gap-4 border-b pb-3">
                    <h3 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
                      {group.area}
                    </h3>
                    <span className="text-ink-muted font-mono text-xs">
                      {group.items.length} {group.items.length === 1 ? "posición" : "posiciones"}
                    </span>
                  </div>
                  <ul>
                    {group.items.map((vacancy, i) => (
                      <Reveal
                        key={vacancy.id}
                        as="li"
                        delay={Math.min(gi * 40 + i * 60, 240)}
                        className="border-line block border-b"
                      >
                        <JobRow vacancy={vacancy} />
                      </Reveal>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : (
          <ul className="border-line mt-10 border-t md:mt-14">
            {vacancies.map((vacancy, i) => (
              <Reveal
                key={vacancy.id}
                as="li"
                delay={i * 60}
                className="border-line block border-b"
              >
                <JobRow vacancy={vacancy} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
