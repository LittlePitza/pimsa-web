"use client";

import { useActionState, useState } from "react";
import { sendTestEmailAction, type ActionState } from "@/app/admin/actions";
import { FormFeedback } from "@/components/admin/form-feedback";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import type { NotificationFlow } from "@/lib/enums";
import { cn } from "@/lib/utils";

const initialState: ActionState = {};

export interface TestPanelFlow {
  flow: NotificationFlow;
  label: string;
  /** Saved recipients, for the "se enviará a" line. */
  recipients: string;
}

/**
 * Sends the real notification template — same layout, same sender, same
 * server — either to the saved recipients or to a single address typed here.
 *
 * The override is what makes this a test rather than a rehearsal: an address
 * can be checked from the inbox that will actually receive it *before* it is
 * saved as the destination for every future lead.
 */
export function EmailTestPanel({ flows }: { flows: TestPanelFlow[] }) {
  const [state, formAction, pending] = useActionState(sendTestEmailAction, initialState);
  const [selected, setSelected] = useState<NotificationFlow>(flows[0]?.flow ?? "leads");
  const [override, setOverride] = useState("");

  const current = flows.find((entry) => entry.flow === selected);
  const destination = override.trim() || current?.recipients || "";

  return (
    <form action={formAction} className="grid max-w-2xl gap-5">
      {flows.length > 1 ? (
        <fieldset className="grid gap-2">
          <legend className="text-ink font-mono text-xs font-medium tracking-wider uppercase">
            Qué plantilla enviar
          </legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {flows.map((entry) => (
              <label
                key={entry.flow}
                className={cn(
                  "cursor-pointer rounded-sm border px-4 py-2 text-sm transition-colors",
                  selected === entry.flow
                    ? "border-navy-500 bg-navy-500 dark:text-navy-900 text-white"
                    : "border-line text-ink hover:border-navy-500",
                )}
              >
                <input
                  type="radio"
                  name="flow"
                  value={entry.flow}
                  checked={selected === entry.flow}
                  onChange={() => setSelected(entry.flow)}
                  className="sr-only"
                />
                {entry.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <input type="hidden" name="flow" value={selected} />
      )}

      <InputField
        id="overrideTo"
        label="Enviar a otro correo (opcional)"
        type="email"
        value={override}
        onChange={(event) => setOverride(event.target.value)}
        placeholder={current?.recipients || "tu.correo@ejemplo.com"}
        autoComplete="off"
      />

      <p className="text-ink-muted -mt-2 text-xs">
        {destination ? (
          <>
            La prueba se enviará a <strong className="text-ink">{destination}</strong>.
          </>
        ) : (
          "Este flujo no tiene destinatarios guardados: escribe un correo para probar."
        )}
      </p>

      <FormFeedback state={state} />

      <div>
        <Button type="submit" variant="outline" disabled={pending || !destination}>
          {pending ? "Enviando…" : "Enviar correo de prueba"}
        </Button>
      </div>
    </form>
  );
}
