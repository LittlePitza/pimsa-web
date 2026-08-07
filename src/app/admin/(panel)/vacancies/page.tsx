import Link from "next/link";
import { deleteVacancyAction, setVacancyStatusAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ListingCount } from "@/components/admin/listing-count";
import { countVacancies, listVacancies } from "@/db/queries/vacancies";
import { requireArea } from "@/lib/auth";
import { vacancyStatusLabels } from "@/lib/labels";
import { ADMIN_LIST_LIMIT } from "@/lib/metrics";
import { absoluteUrl } from "@/lib/site";
import { cn, formatDate, formatDay } from "@/lib/utils";

export default async function AdminVacanciesPage() {
  await requireArea("rrhh");
  const [vacancies, total] = await Promise.all([listVacancies(ADMIN_LIST_LIMIT), countVacancies()]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-navy-500 text-2xl font-bold">Vacantes</h1>
        <ButtonLink href="/admin/vacancies/new" size="sm">
          Nueva vacante
        </ButtonLink>
      </div>
      <ListingCount shown={vacancies.length} total={total} noun="vacantes" />

      <p className="border-line bg-surface text-ink-muted mt-6 rounded-md border p-4 text-sm">
        Feed para bolsas de trabajo:{" "}
        <a href="/jobs.xml" className="font-mono break-all text-blue-600 underline">
          {absoluteUrl("/jobs.xml")}
        </a>
        <br />
        Entrega esta dirección a Computrabajo, OCC o Indeed y publican solas todas las vacantes en
        estado «Publicada». Google las toma directo de cada página.
      </p>

      <ul className="border-line bg-surface shadow-card mt-8 divide-y divide-(--color-line) rounded-md border">
        {vacancies.map((vacancy) => (
          <li key={vacancy.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/admin/vacancies/${vacancy.id}`}
                  className="text-navy-500 font-display font-semibold hover:text-blue-600"
                >
                  {vacancy.title}
                </Link>
                <Badge
                  className={cn(
                    vacancy.status === "open" && "border-green-600 text-green-600",
                    vacancy.status === "closed" && "border-red-600 text-red-700",
                  )}
                >
                  {vacancyStatusLabels[vacancy.status]}
                </Badge>
              </div>
              <p className="text-ink-muted mt-1 text-sm">
                {vacancy.department || "Sin área"} · /jobs/{vacancy.slug} · Actualizada{" "}
                {formatDate(vacancy.updatedAt)}
                {/* An expired posting still reads "Publicada" here but has already
                    dropped off every board — worth saying out loud. */}
                {vacancy.expiresAt ? (
                  <span className={cn(vacancy.expiresAt < new Date() && "text-red-700")}>
                    {vacancy.expiresAt < new Date() ? " · Venció el " : " · Cierra el "}
                    {formatDay(vacancy.expiresAt)}
                  </span>
                ) : null}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {vacancy.status !== "open" ? (
                <form action={setVacancyStatusAction.bind(null, vacancy.id)}>
                  <input type="hidden" name="status" value="open" />
                  <button
                    type="submit"
                    className="rounded-sm px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-600/10"
                  >
                    Publicar
                  </button>
                </form>
              ) : (
                <form action={setVacancyStatusAction.bind(null, vacancy.id)}>
                  <input type="hidden" name="status" value="closed" />
                  <button
                    type="submit"
                    className="text-ink-muted hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
                  >
                    Cerrar
                  </button>
                </form>
              )}
              <Link
                href={`/admin/vacancies/${vacancy.id}`}
                className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
              >
                Editar
              </Link>
              <form action={deleteVacancyAction.bind(null, vacancy.id)}>
                <ConfirmButton
                  message={`¿Eliminar la vacante "${vacancy.title}"? Esta acción no se puede deshacer.`}
                  className="rounded-sm px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Eliminar
                </ConfirmButton>
              </form>
            </div>
          </li>
        ))}
        {vacancies.length === 0 ? (
          <li className="text-ink-muted p-6 text-sm">
            No hay vacantes. Crea la primera con «Nueva vacante».
          </li>
        ) : null}
      </ul>
    </>
  );
}
