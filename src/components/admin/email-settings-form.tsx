"use client";

import { useActionState } from "react";
import { saveEmailSettingsAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";

const initialState: ActionState = {};

/**
 * Recipient lists per email flow. Each area only renders — and the action
 * only saves — the flow it owns: Marketing the contact leads, RRHH the job
 * applications.
 */
export function EmailSettingsForm({
  leadsTo,
  applicationsTo,
  fallback,
  showLeads = true,
  showApplications = true,
}: {
  leadsTo: string;
  applicationsTo: string;
  /** Env fallback shown as placeholder when a field is empty. */
  fallback: string;
  showLeads?: boolean;
  showApplications?: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveEmailSettingsAction, initialState);

  return (
    <form action={formAction} className="grid max-w-2xl gap-6">
      {showLeads ? (
        <InputField
          id="leadsTo"
          label="Leads de contacto — llegan a"
          defaultValue={leadsTo}
          maxLength={500}
          placeholder={fallback || "ventas@plasticospimsa.com"}
        />
      ) : null}
      {showApplications ? (
        <InputField
          id="applicationsTo"
          label="Postulaciones (RH) — llegan a"
          defaultValue={applicationsTo}
          maxLength={500}
          placeholder={fallback || "rh@plasticospimsa.com"}
        />
      ) : null}
      <p className="text-ink-muted text-xs">
        Puedes capturar varios correos separados por comas. Si dejas un campo vacío se usa el
        valor configurado en el servidor ({fallback || "sin configurar"}).
      </p>

      {state.error ? (
        <p role="alert" className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="border-green-600 rounded-sm border-l-4 bg-white p-4 text-sm">
          {state.success}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar configuración"}
        </Button>
      </div>
    </form>
  );
}
