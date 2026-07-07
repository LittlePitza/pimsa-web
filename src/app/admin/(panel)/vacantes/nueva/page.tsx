import { createVacancyAction } from "@/app/admin/actions";
import { VacancyForm } from "@/components/admin/vacancy-form";

export default function NewVacancyPage() {
  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Nueva vacante</h1>
      <div className="mt-8">
        <VacancyForm
          action={createVacancyAction}
          submitLabel="Crear vacante"
          values={{
            title: "",
            slug: "",
            department: "",
            location: "Apaseo el Grande, Guanajuato",
            employmentType: "Tiempo completo",
            salaryRange: "",
            summary: "",
            description: "",
            requirements: "",
            benefits: "",
            status: "draft",
          }}
        />
      </div>
    </>
  );
}
