import { notFound } from "next/navigation";
import { updateVacancyAction } from "@/app/admin/actions";
import { VacancyForm } from "@/components/admin/vacancy-form";
import { getVacancyById } from "@/db/queries/vacancies";
import { requireAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVacancyPage({ params }: Props) {
  await requireAdmin();
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
            location: vacancy.location,
            employmentType: vacancy.employmentType,
            salaryRange: vacancy.salaryRange ?? "",
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
