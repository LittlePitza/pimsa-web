import { createVacancyAction } from "@/app/admin/actions";
import { VacancyForm } from "@/components/admin/vacancy-form";
import { company } from "@/content/company";
import { requireArea } from "@/lib/auth";

export default async function NewVacancyPage() {
  await requireArea("rrhh");

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
            // Most hiring is at the plant, so it starts there.
            city: company.address.municipality,
            region: company.address.state,
            postalCode: "",
            workMode: "onsite",
            employmentType: "FULL_TIME",
            salaryMin: "",
            salaryMax: "",
            salaryPeriod: "MONTH",
            salaryRange: "",
            openings: "1",
            expiresAt: "",
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
