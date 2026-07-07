"use client";

import { useActionState } from "react";
import { signInAction, type ActionState } from "@/app/admin/actions";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";

const initialState: ActionState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <form
          action={formAction}
          className="border-line bg-surface shadow-card mt-8 rounded-md border p-8"
        >
          <h1 className="font-display text-navy-500 text-xl font-semibold">
            Panel de administración
          </h1>
          <div className="mt-6 grid gap-5">
            <InputField
              id="email"
              label="Correo electrónico"
              type="email"
              autoComplete="username"
              required
            />
            <InputField
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              required
            />
            {state.error ? (
              <p role="alert" className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? "Entrando…" : "Entrar"}
            </Button>
          </div>
        </form>
        <p className="text-ink-muted mt-6 text-center text-xs">
          Acceso exclusivo para personal autorizado de Plásticos PIMSA.
        </p>
      </div>
    </main>
  );
}
