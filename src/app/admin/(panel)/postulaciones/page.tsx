import { setApplicationStatusAction } from "@/app/admin/actions";
import { APPLICATION_STATUSES } from "@/db/schema";
import { listApplications } from "@/db/queries/applications";
import { applicationStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default async function AdminApplicationsPage() {
  const applications = await listApplications();

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Postulaciones</h1>
      <p className="text-ink-muted mt-2 text-sm">
        Candidatos recibidos desde la bolsa de trabajo. Los CVs se descargan desde cada tarjeta.
      </p>

      <ul className="mt-8 space-y-4">
        {applications.map((application) => (
          <li
            key={application.id}
            className="border-line bg-surface shadow-card rounded-md border p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-navy-500 font-semibold">{application.name}</p>
                <p className="text-ink-muted mt-0.5 text-sm">
                  {application.vacancyTitle || "Postulación general"} ·{" "}
                  {formatDate(application.createdAt)}
                </p>
                <p className="text-ink mt-2 text-sm">
                  <a href={`mailto:${application.email}`} className="text-blue-600 underline">
                    {application.email}
                  </a>{" "}
                  · <a href={`tel:${application.phone}`}>{application.phone}</a>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {application.cvFileId ? (
                  <a
                    href={`/api/admin/cv/${application.cvFileId}`}
                    className="border-navy-500 text-navy-500 hover:bg-navy-500 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors hover:text-white"
                  >
                    Descargar CV
                  </a>
                ) : (
                  <span className="text-ink-muted text-sm">Sin CV</span>
                )}
                <form
                  action={setApplicationStatusAction.bind(null, application.id)}
                  className="flex items-center gap-2"
                >
                  <label htmlFor={`status-${application.id}`} className="sr-only">
                    Estado de la postulación
                  </label>
                  <select
                    id={`status-${application.id}`}
                    name="status"
                    defaultValue={application.status}
                    className="border-line bg-surface text-ink rounded-sm border px-2 py-1.5 text-sm"
                  >
                    {APPLICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {applicationStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
                  >
                    Guardar
                  </button>
                </form>
              </div>
            </div>

            <details className="mt-4">
              <summary className="text-blue-600 cursor-pointer text-sm font-medium">
                Ver mensaje
              </summary>
              <p className="text-ink-muted mt-2 text-sm whitespace-pre-line">
                {application.message}
              </p>
            </details>
          </li>
        ))}
        {applications.length === 0 ? (
          <li className="border-line bg-surface text-ink-muted rounded-md border p-6 text-sm">
            Aún no hay postulaciones.
          </li>
        ) : null}
      </ul>
    </>
  );
}
