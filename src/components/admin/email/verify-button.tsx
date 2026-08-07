"use client";

import { useActionState } from "react";
import { verifySmtpAction, type ActionState } from "@/app/admin/actions";
import { FormFeedback } from "@/components/admin/form-feedback";
import { Button } from "@/components/ui/button";

const initialState: ActionState = {};

/**
 * Opens an SMTP connection and authenticates, without sending anything.
 *
 * Separate from the test email on purpose: when nothing arrives, this
 * distinguishes "the server rejected our password" from "we sent it and it
 * went somewhere else" — two problems with entirely different fixes, which a
 * single "probar" button leaves fused together.
 */
export function VerifySmtpButton() {
  const [state, formAction, pending] = useActionState(verifySmtpAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Conectando…" : "Probar conexión"}
        </Button>
      </div>
      <FormFeedback state={state} />
    </form>
  );
}
