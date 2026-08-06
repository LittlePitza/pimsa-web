import { notFound } from "next/navigation";
import { updateVacancyAction } from "@/app/admin/actions";
import { VacancyForm } from "@/components/admin/vacancy-form";
import { getVacancyById } from "@/db/queries/vacancies";
import { requireArea } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

/** <input type="date"> only accepts YYYY-MM-DD. */
function dateInputValue(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function EditVacancyPage({ params }: Props) {
  await requireArea("rrhh");
  const { id } = await params;
  const vacancyId = Number(id);
  if (!Number.isInteger(vacancyId)) notFound();

  const vacancy = await getVacancyById(vacancyId);
  if (!vacancy) notFound();

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Editar vacante</h1>
      <p className="text-ink-muted mt-2 font-mono text-xs">/vacantes/{vacancy.slug}</p>
      <div className="mt-8">
        <VacancyForm
          action={updateVacancyAction.bind(null, vacancy.id)}
          submitLabel="Guardar cambios"
          values={{
            title: vacancy.title,
            slug: vacancy.slug,
            department: vacancy.department,
            city: vacancy.city,
            region: vacancy.region,
            postalCode: vacancy.postalCode,
            workMode: vacancy.workMode,
            employmentType: vacancy.employmentType,
            salaryMin: vacancy.salaryMin?.toString() ?? "",
            salaryMax: vacancy.salaryMax?.toString() ?? "",
            salaryPeriod: vacancy.salaryPeriod,
            salaryRange: vacancy.salaryRange ?? "",
            openings: String(vacancy.openings),
            expiresAt: dateInputValue(vacancy.expiresAt),
            summary: vacancy.summary,
            description: vacancy.description,
            requirements: vacancy.requirements.join("\n"),
            benefits: vacancy.benefits.join("\n"),
            status: vacancy.status,
          }}
        />
      </div>
    </>
  );
}
