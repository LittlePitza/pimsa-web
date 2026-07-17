"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/ui/field";
import { VACANCY_STATUSES } from "@/db/schema";
import { vacancyStatusLabels } from "@/lib/labels";

export interface VacancyFormValues {
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  summary: string;
  description: string;
  /** One item per line in the textarea. */
  requirements: string;
  benefits: string;
  status: (typeof VACANCY_STATUSES)[number];
}

const initialState: ActionState = {};

/** Create/edit vacancy form; receives a (bound) server action. */
export function VacancyForm({
  action,
  values,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  values: VacancyFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // On a validation error the action echoes what was submitted, so the
  // React 19 automatic form reset restores the admin's input, not the
  // original record.
  const current = { ...values, ...state.values };

  return (
    <form action={formAction} className="grid max-w-3xl gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField id="title" label="Título" required maxLength={160} defaultValue={current.title} />
        <InputField
          id="slug"
          label="Slug (URL, opcional)"
          maxLength={160}
          defaultValue={current.slug}
          placeholder="se genera del título si se deja vacío"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <InputField
          id="department"
          label="Área"
          maxLength={120}
          defaultValue={current.department}
          placeholder="Producción"
        />
        <InputField
          id="location"
          label="Ubicación"
          required
          maxLength={160}
          defaultValue={current.location}
        />
        <InputField
          id="employmentType"
          label="Jornada"
          required
          maxLength={60}
          defaultValue={current.employmentType}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          id="salaryRange"
          label="Sueldo (opcional, visible)"
          maxLength={120}
          defaultValue={current.salaryRange}
          placeholder="$12,000 – $15,000 mensuales"
        />
        <SelectField id="status" label="Estado" required defaultValue={current.status}>
          {VACANCY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {vacancyStatusLabels[status]}
            </option>
          ))}
        </SelectField>
      </div>
      <TextareaField
        id="summary"
        label="Resumen (listado y buscadores)"
        required
        rows={2}
        maxLength={500}
        defaultValue={current.summary}
      />
      <TextareaField
        id="description"
        label="Descripción (párrafos separados por línea en blanco)"
        required
        rows={8}
        maxLength={20000}
        defaultValue={current.description}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextareaField
          id="requirements"
          label="Requisitos (uno por línea)"
          rows={6}
          maxLength={5000}
          defaultValue={current.requirements}
        />
        <TextareaField
          id="benefits"
          label="Ofrecemos (uno por línea)"
          rows={6}
          maxLength={5000}
          defaultValue={current.benefits}
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
