"use client";

import { useActionState } from "react";
import { createAccountAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";

const initialState: ActionState = {};

/** Create a new admin account (super-admin only). */
export function NewAccountForm() {
  const [state, formAction, pending] = useActionState(createAccountAction, initialState);

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
          className="border-green-600 rounded-sm border-l-4 bg-white p-3 text-sm sm:col-span-2"
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
