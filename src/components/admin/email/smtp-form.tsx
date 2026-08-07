"use client";

import { useActionState } from "react";
import { resetSmtpAction, saveSmtpAction, type ActionState } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { FormFeedback } from "@/components/admin/form-feedback";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";

const initialState: ActionState = {};

/**
 * The sending mailbox. Super-admin only — see `saveSmtpAction`.
 *
 * The password is write-only: it is stored encrypted and never sent back to
 * the browser, so the field renders empty on every load and a blank submit
 * means "keep the one you have". That is also why the reset is a separate
 * action — clearing credentials has to be deliberate, not the accidental
 * result of saving a form with an empty field.
 */
export function SmtpForm({
  host,
  port,
  user,
  fromName,
  fromAddress,
  hasStoredPassword,
  /** True when the values shown come from the server env, not the panel. */
  inheritedFromServer,
}: {
  host: string;
  port: number;
  user: string;
  fromName: string;
  fromAddress: string;
  hasStoredPassword: boolean;
  inheritedFromServer: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveSmtpAction, initialState);

  return (
    <div className="grid max-w-2xl gap-6">
      {inheritedFromServer ? (
        <p className="border-line bg-surface rounded-sm border border-l-4 border-l-blue-600 p-4 text-sm">
          Estos datos vienen de las variables de entorno del servidor. Si guardas aquí, el panel
          toma el control y podrás cambiar el buzón sin volver a desplegar.
        </p>
      ) : null}

      <form action={formAction} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
          <InputField
            id="host"
            label="Servidor SMTP"
            defaultValue={host}
            placeholder="smtp.hostinger.com"
            maxLength={190}
            autoComplete="off"
            required
          />
          <InputField
            id="port"
            label="Puerto"
            type="number"
            defaultValue={port}
            min={1}
            max={65535}
            required
          />
        </div>
        <p className="text-ink-muted -mt-2 text-xs">
          En Hostinger: <span className="font-mono">smtp.hostinger.com</span>, puerto 465. El 465
          cifra desde el inicio; el 587 empieza en claro y cambia a cifrado (STARTTLS).
        </p>

        <InputField
          id="user"
          label="Buzón (usuario)"
          type="email"
          defaultValue={user}
          placeholder="web@plasticospimsa.com"
          maxLength={190}
          autoComplete="off"
          required
        />

        <InputField
          id="password"
          label="Contraseña del buzón"
          type="password"
          placeholder={
            hasStoredPassword ? "•••••••• (guardada — déjala vacía para conservarla)" : ""
          }
          maxLength={200}
          autoComplete="new-password"
          required={!hasStoredPassword}
        />
        <p className="text-ink-muted -mt-2 text-xs">
          Se guarda cifrada en la base de datos y nunca se vuelve a mostrar.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="fromName"
            label="Nombre del remitente"
            defaultValue={fromName}
            placeholder="Plásticos PIMSA"
            maxLength={80}
          />
          <InputField
            id="fromAddress"
            label="Dirección del remitente"
            type="email"
            defaultValue={fromAddress}
            placeholder="web@plasticospimsa.com"
            maxLength={190}
            required
          />
        </div>
        <p className="text-ink-muted -mt-2 text-xs">
          La dirección del remitente debe ser un buzón real de tu dominio. Si no lo es, los
          servidores de destino marcarán los avisos como spam o los rechazarán.
        </p>

        <FormFeedback state={state} />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar cuenta de envío"}
          </Button>
        </div>
      </form>

      {!inheritedFromServer ? (
        <form action={resetSmtpAction} className="border-line border-t pt-5">
          <ConfirmButton
            message="Se borrarán los datos de la cuenta guardados en el panel y el sitio volverá a usar la configuración del servidor. ¿Continuar?"
            className="text-sm font-medium text-red-700 underline underline-offset-4"
          >
            Volver a la configuración del servidor
          </ConfirmButton>
        </form>
      ) : null}
    </div>
  );
}
