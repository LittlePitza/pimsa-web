"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Admin error boundary. Dashboard queries let DB errors surface on purpose
 * (better an honest error than silent zeros) — this is where they land.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] Unhandled render error:", error);
  }, [error]);

  return (
    <div className="border-line bg-surface shadow-card mx-auto mt-12 max-w-xl rounded-md border p-8">
      <p className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
        Error del panel
      </p>
      <h1 className="font-display text-navy-500 mt-3 text-2xl font-bold">
        No pudimos cargar esta sección
      </h1>
      <p className="text-ink-muted mt-3 text-sm">
        Normalmente es un problema temporal de conexión con la base de datos. Reintenta; si
        persiste, revisa el estado del servidor de base de datos.
      </p>
      <div className="mt-6">
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
