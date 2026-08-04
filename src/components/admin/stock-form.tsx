"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";
import { STOCK_AVAILABILITY, STOCK_FORMS } from "@/lib/enums";

export interface StockFormValues {
  material: string;
  form: (typeof STOCK_FORMS)[number];
  color: string;
  availability: (typeof STOCK_AVAILABILITY)[number];
  notes: string;
  published: boolean;
}

const initialState: ActionState = {};

/** Create/edit stock item form; receives a (bound) server action. */
export function StockForm({
  action,
  values,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  values: StockFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // On a validation error the action echoes what was submitted, so the
  // React 19 automatic form reset restores the admin's input.
  const current = state.values ?? {
    ...values,
    published: values.published ? "on" : "",
  };

  return (
    <form action={formAction} className="grid max-w-2xl gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          id="material"
          label="Material"
          required
          maxLength={120}
          defaultValue={current.material}
          placeholder="ABS, PC (Policarbonato)…"
        />
        <InputField
          id="color"
          label="Color"
          maxLength={60}
          defaultValue={current.color}
          placeholder="Natural, Negro, Varios…"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField id="form" label="Presentación" required defaultValue={current.form}>
          {STOCK_FORMS.map((form) => (
            <option key={form} value={form}>
              {form}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="availability"
          label="Disponibilidad"
          required
          defaultValue={current.availability}
        >
          {STOCK_AVAILABILITY.map((availability) => (
            <option key={availability} value={availability}>
              {availability}
            </option>
          ))}
        </SelectField>
      </div>
      <InputField
        id="notes"
        label="Notas (opcional, visibles en el sitio)"
        maxLength={300}
        defaultValue={current.notes}
        placeholder="Disponible con y sin fibra de vidrio"
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={current.published === "on"}
          className="accent-green-600 size-4"
        />
        <span className="text-ink text-sm">Visible en el sitio público (/stock)</span>
      </label>

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
