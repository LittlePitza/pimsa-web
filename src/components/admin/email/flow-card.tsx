"use client";

import { useActionState, useState } from "react";
import { saveEmailFlowAction, type ActionState } from "@/app/admin/actions";
import { EmailListField } from "@/components/admin/email/email-list-field";
import { FormFeedback } from "@/components/admin/form-feedback";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import type { NotificationFlow } from "@/lib/enums";

const initialState: ActionState = {};

export interface FlowCardProps {
  flow: NotificationFlow;
  title: string;
  description: string;
  enabled: boolean;
  to: string;
  cc: string;
  bcc: string;
  subjectTag: string;
  acknowledge: boolean;
  /** Recipients inherited from the server env when `to` is empty. */
  fallback: string;
  /** Copy for the acknowledgement toggle — it differs per flow. */
  acknowledgeLabel: string;
}

/** Small labelled switch; a plain checkbox so the form works without JS. */
function Toggle({
  name,
  label,
  hint,
  defaultChecked,
  onChange,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="border-line flex cursor-pointer items-start gap-3 rounded-sm border p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-green-600"
      />
      <span>
        <span className="text-ink block text-sm font-medium">{label}</span>
        <span className="text-ink-muted mt-0.5 block text-xs">{hint}</span>
      </span>
    </label>
  );
}

/**
 * One notification flow's delivery settings.
 *
 * The card dims when notifications are switched off, so the state that
 * silences a flow is visible from across the screen rather than hidden in an
 * unchecked box — this is the setting most likely to be flipped during a test
 * and forgotten.
 */
export function EmailFlowCard(props: FlowCardProps) {
  const saveFlow = saveEmailFlowAction.bind(null, props.flow);
  const [state, formAction, pending] = useActionState(saveFlow, initialState);
  const [enabled, setEnabled] = useState(props.enabled);

  return (
    <section className="border-line bg-surface shadow-card rounded-md border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-navy-500 text-lg font-bold">{props.title}</h3>
          <p className="text-ink-muted mt-1 text-sm">{props.description}</p>
        </div>
        <span
          className={
            enabled
              ? "shrink-0 font-mono text-xs tracking-wider text-green-600 uppercase"
              : "text-ink-muted shrink-0 font-mono text-xs tracking-wider uppercase"
          }
        >
          {enabled ? "Activo" : "Silenciado"}
        </span>
      </div>

      <form action={formAction} className="mt-6 grid gap-5">
        <div className={enabled ? undefined : "opacity-60"}>
          <div className="grid gap-5">
            <EmailListField
              id="to"
              label="Llega a"
              defaultValue={props.to}
              placeholder={props.fallback || "correo@plasticospimsa.com"}
              hint={
                props.to
                  ? "Separa varios correos con comas."
                  : props.fallback
                    ? `Vacío usa lo configurado en el servidor: ${props.fallback}`
                    : "Sin destinatarios: los registros solo quedarán en el panel."
              }
              required
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <EmailListField
                id="cc"
                label="Con copia (CC)"
                defaultValue={props.cc}
                hint="Visible para todos los destinatarios."
              />
              <EmailListField
                id="bcc"
                label="Copia oculta (CCO)"
                defaultValue={props.bcc}
                hint="Para archivar sin exponer la dirección."
              />
            </div>
            <InputField
              id="subjectTag"
              label="Etiqueta en el asunto"
              defaultValue={props.subjectTag}
              maxLength={40}
              placeholder="[PIMSA Web]"
              // Outlook rules key off the subject line; a fixed prefix is the
              // simplest thing a non-technical user can filter a folder by.
              className="max-w-sm"
            />
            <p className="text-ink-muted -mt-3 text-xs">
              Se antepone al asunto de cada aviso. Útil para crear una regla o una carpeta en
              Outlook.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            name="enabled"
            label="Avisar por correo"
            hint="Apagado, el registro se guarda en el panel pero no se envía ningún aviso."
            defaultChecked={props.enabled}
            onChange={setEnabled}
          />
          <Toggle
            name="acknowledge"
            label="Acuse automático"
            hint={props.acknowledgeLabel}
            defaultChecked={props.acknowledge}
          />
        </div>

        <FormFeedback state={state} />

        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
