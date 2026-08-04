"use client";

import { useActionState, useState } from "react";
import {
  deleteAccountAction,
  resetAccountPasswordAction,
  updateAccountAction,
  type ActionState,
} from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";
import { ADMIN_ROLES, type AdminRole } from "@/lib/enums";
import { roleDescriptions, roleLabels } from "@/lib/roles";
import { formatDate } from "@/lib/utils";

const initialState: ActionState = {};

export interface AccountCardData {
  id: number;
  name: string;
  email: string;
  /** Portal this account enters: whole panel, Marketing only, or RRHH only. */
  role: AdminRole;
  createdAt: Date;
  lastLoginAt: Date | null;
  /** This account is a protected super-admin (cannot be deleted / demoted). */
  isSuper: boolean;
  /** This account belongs to the signed-in user. */
  isSelf: boolean;
}

function Feedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="border-green-600 rounded-sm border-l-4 bg-white p-3 text-sm">
        {state.success}
      </p>
    );
  }
  return null;
}

export function AccountCard({ account }: { account: AccountCardData }) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateAccountAction.bind(null, account.id),
    initialState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    resetAccountPasswordAction.bind(null, account.id),
    initialState,
  );
  const [role, setRole] = useState<AdminRole>(account.role);

  const canDelete = !account.isSelf && !account.isSuper;

  return (
    <li className="border-line bg-surface shadow-card rounded-md border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-navy-500 font-semibold">
            {account.name}
            {account.isSelf ? <span className="text-ink-muted font-sans"> · tú</span> : null}
          </p>
          <p className="text-ink-muted text-sm">{account.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {account.isSuper ? (
            <span className="border-green-600 text-green-600 rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider uppercase">
              Super-admin
            </span>
          ) : (
            <span className="border-line text-navy-500 rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider uppercase">
              {roleLabels[account.role]}
            </span>
          )}
          <span className="text-ink-muted font-mono text-xs">
            Último acceso: {formatDate(account.lastLoginAt)}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-6 border-t border-(--color-line) pt-5 lg:grid-cols-2">
        {/* Profile: name + email */}
        <form action={profileAction} className="grid gap-4">
          <p className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
            Datos de la cuenta
          </p>
          <InputField
            id={`name-${account.id}`}
            name="name"
            label="Nombre"
            defaultValue={account.name}
            required
            maxLength={120}
          />
          <InputField
            id={`email-${account.id}`}
            name="email"
            label="Correo"
            type="email"
            defaultValue={account.email}
            required
            maxLength={190}
          />
          {account.isSuper ? (
            // Super-admins own account management, so they always keep the
            // whole panel — the field is fixed, not editable.
            <>
              <input type="hidden" name="role" value="admin" />
              <p className="text-ink-muted text-xs">
                Los super-administradores conservan el panel completo; su área no se puede
                cambiar.
              </p>
            </>
          ) : (
            <div>
              <SelectField
                id={`role-${account.id}`}
                name="role"
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
          )}
          <Feedback state={profileState} />
          <div>
            <Button type="submit" variant="outline" size="sm" disabled={profilePending}>
              {profilePending ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>

        {/* Password reset */}
        <form action={passwordAction} className="grid gap-4">
          <p className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
            Cambiar contraseña
          </p>
          <InputField
            id={`password-${account.id}`}
            name="password"
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            placeholder="Mínimo 10 caracteres"
          />
          <Feedback state={passwordState} />
          <div>
            <Button type="submit" variant="outline" size="sm" disabled={passwordPending}>
              {passwordPending ? "Actualizando…" : "Actualizar contraseña"}
            </Button>
          </div>
        </form>
      </div>

      {canDelete ? (
        <form
          action={deleteAccountAction.bind(null, account.id)}
          className="mt-5 border-t border-(--color-line) pt-4"
        >
          <ConfirmButton
            message={`¿Eliminar la cuenta de ${account.email}? Esta acción no se puede deshacer.`}
            className="text-sm font-medium text-red-700 hover:underline"
          >
            Eliminar cuenta
          </ConfirmButton>
        </form>
      ) : null}
    </li>
  );
}
