"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/ui/field";
import { EMPLOYMENT_TYPES, SALARY_PERIODS, VACANCY_STATUSES, WORK_MODES } from "@/lib/enums";
import {
  employmentTypeLabels,
  salaryPeriodLabels,
  vacancyStatusLabels,
  workModeLabels,
} from "@/lib/labels";

export interface VacancyFormValues {
  title: string;
  slug: string;
  department: string;
  city: string;
  region: string;
  postalCode: string;
  workMode: (typeof WORK_MODES)[number];
  employmentType: (typeof EMPLOYMENT_TYPES)[number];
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: (typeof SALARY_PERIODS)[number];
  salaryRange: string;
  openings: string;
  /** YYYY-MM-DD for <input type="date">. */
  expiresAt: string;
  summary: string;
  description: string;
  /** One item per line in the textarea. */
  requirements: string;
  benefits: string;
  status: (typeof VACANCY_STATUSES)[number];
}

const initialState: ActionState = {};

/** Mono section rule, so eighteen fields read as four short blocks. */
function FormSection({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border-line border-t pt-6">
      <p className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
        {title}
      </p>
      {hint ? <p className="text-ink-muted mt-2 text-sm">{hint}</p> : null}
    </div>
  );
}

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
        <SelectField
          id="employmentType"
          label="Jornada"
          required
          defaultValue={current.employmentType}
        >
          {EMPLOYMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {employmentTypeLabels[type]}
            </option>
          ))}
        </SelectField>
        <SelectField id="status" label="Estado" required defaultValue={current.status}>
          {VACANCY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {vacancyStatusLabels[status]}
            </option>
          ))}
        </SelectField>
      </div>

      <FormSection
        title="Ubicación"
        hint="Ciudad y estado se publican por separado porque las bolsas de trabajo filtran por ellos: es lo que decide a quién le aparece la vacante."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        <InputField id="city" label="Ciudad" required maxLength={120} defaultValue={current.city} />
        <InputField
          id="region"
          label="Estado"
          required
          maxLength={120}
          defaultValue={current.region}
        />
        <InputField
          id="postalCode"
          label="Código postal (opcional)"
          maxLength={5}
          inputMode="numeric"
          pattern="\d{5}"
          defaultValue={current.postalCode}
          placeholder="38160"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <SelectField id="workMode" label="Modalidad" required defaultValue={current.workMode}>
          {WORK_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {workModeLabels[mode]}
            </option>
          ))}
        </SelectField>
        <InputField
          id="openings"
          label="Plazas disponibles"
          required
          type="number"
          min={1}
          max={999}
          inputMode="numeric"
          defaultValue={current.openings}
        />
        <InputField
          id="expiresAt"
          label="Cierra el (opcional)"
          type="date"
          defaultValue={current.expiresAt}
        />
      </div>

      <FormSection
        title="Sueldo"
        hint="Captura los montos siempre que puedas: son los que llegan estructurados a Google y a las bolsas, y una vacante sin sueldo se filtra fuera de la mayoría de las búsquedas. El texto libre solo se usa cuando no hay montos."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        <InputField
          id="salaryMin"
          label="Sueldo mínimo"
          inputMode="numeric"
          maxLength={12}
          defaultValue={current.salaryMin}
          placeholder="12000"
        />
        <InputField
          id="salaryMax"
          label="Sueldo máximo"
          inputMode="numeric"
          maxLength={12}
          defaultValue={current.salaryMax}
          placeholder="15000"
        />
        <SelectField
          id="salaryPeriod"
          label="Periodo"
          required
          defaultValue={current.salaryPeriod}
        >
          {SALARY_PERIODS.map((period) => (
            <option key={period} value={period}>
              {salaryPeriodLabels[period]}
            </option>
          ))}
        </SelectField>
      </div>
      <InputField
        id="salaryRange"
        label="Texto de sueldo (solo si no capturas montos)"
        maxLength={120}
        defaultValue={current.salaryRange}
        placeholder="Sueldo a tratar según experiencia"
      />

      <FormSection
        title="Contenido"
        hint="Las bolsas publican la descripción, los requisitos y lo que ofreces — nada más. Lo que no esté aquí, el candidato no lo ve fuera de este sitio."
      />
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
