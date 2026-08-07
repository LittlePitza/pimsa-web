"use client";

import { useActionState, useState } from "react";
import { createAccountAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";
import { ADMIN_ROLES, type AdminRole } from "@/lib/enums";
import { roleDescriptions, roleLabels } from "@/lib/roles";

const initialState: ActionState = {};

/** Create a new admin account (super-admin only). */
export function NewAccountForm() {
  const [state, formAction, pending] = useActionState(createAccountAction, initialState);
  const [role, setRole] = useState<AdminRole>("marketing");

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <InputField id="name" label="Nombre" autoComplete="off" required maxLength={120} />
      <InputField
        id="email"
        label="Correo"
        type="email"
        autoComplete="off"
        required
        maxLength={190}
        placeholder="nombre@plasticospimsa.com"
      />
      <div className="sm:col-span-2">
        <SelectField
          id="role"
          label="Área"
          required
          value={role}
          onChange={(event) => setRole(event.target.value as AdminRole)}
        >
          {ADMIN_ROLES.map((option) => (
            <option key={option} value={option}>
              {roleLabels[option]}
            </option>
          ))}
        </SelectField>
        <p className="text-ink-muted mt-2 text-xs">{roleDescriptions[role]}</p>
      </div>
      <InputField
        id="password"
        label="Contraseña temporal"
        type="password"
        autoComplete="new-password"
        required
        minLength={10}
        placeholder="Mínimo 10 caracteres"
        className="sm:col-span-2"
      />

      {state.error ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="bg-surface rounded-sm border-l-4 border-green-600 p-3 text-sm sm:col-span-2"
        >
          {state.success}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear cuenta"}
        </Button>
      </div>
    </form>
  );
}
