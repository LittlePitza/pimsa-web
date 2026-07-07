"use client";

import { useActionState } from "react";
import { sendTestEmailAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const initialState: ActionState = {};

/** Sends a test message to the configured recipients of one email flow. */
export function TestEmailForm() {
  const [state, formAction, pending] = useActionState(sendTestEmailAction, initialState);

  return (
    <form action={formAction} className="mt-6 grid max-w-2xl gap-4">
      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          name="kind"
          value="leads"
          variant="outline"
          size="sm"
          disabled={pending}
        >
          {pending ? "Enviando…" : "Probar correo de leads"}
        </Button>
        <Button
          type="submit"
          name="kind"
          value="applications"
          variant="outline"
          size="sm"
          disabled={pending}
        >
          {pending ? "Enviando…" : "Probar correo de RH"}
        </Button>
      </div>

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
    </form>
  );
}
