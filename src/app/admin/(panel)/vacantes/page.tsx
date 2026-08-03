import Link from "next/link";
import { deleteVacancyAction, setVacancyStatusAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { listVacancies } from "@/db/queries/vacancies";
import { requireArea } from "@/lib/auth";
import { vacancyStatusLabels } from "@/lib/labels";
import { cn, formatDate } from "@/lib/utils";

export default async function AdminVacanciesPage() {
  await requireArea("rrhh");
  const vacancies = await listVacancies();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-navy-500 text-2xl font-bold">Vacantes</h1>
        <ButtonLink href="/admin/vacantes/nueva" size="sm">
          Nueva vacante
        </ButtonLink>
      </div>

      <ul className="border-line bg-surface shadow-card mt-8 divide-y divide-(--color-line) rounded-md border">
        {vacancies.map((vacancy) => (
          <li key={vacancy.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/admin/vacantes/${vacancy.id}`}
                  className="text-navy-500 hover:text-blue-600 font-display font-semibold"
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
                {vacancy.department || "Sin área"} · /vacantes/{vacancy.slug} · Actualizada{" "}
                {formatDate(vacancy.updatedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {vacancy.status !== "open" ? (
                <form action={setVacancyStatusAction.bind(null, vacancy.id)}>
                  <input type="hidden" name="status" value="open" />
                  <button
                    type="submit"
                    className="text-green-600 hover:bg-green-600/10 rounded-sm px-3 py-1.5 text-sm font-medium"
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
                href={`/admin/vacantes/${vacancy.id}`}
                className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
              >
                Editar
              </Link>
              <form action={deleteVacancyAction.bind(null, vacancy.id)}>
                <ConfirmButton
                  message={`¿Eliminar la vacante "${vacancy.title}"? Esta acción no se puede deshacer.`}
                  className="text-red-700 hover:bg-red-50 rounded-sm px-3 py-1.5 text-sm font-medium"
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
