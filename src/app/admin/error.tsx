"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Boundary for the panel *layout* itself. `(panel)/error.tsx` sits beside that
 * layout, and an error.tsx never catches the layout at its own level — so
 * without this file a layout failure fell all the way through to
 * global-error.tsx, which renders a contentless "unexpected error" page with
 * no way to tell a DB outage from a bad session.
 *
 * The digest is the only thread back to the real stack trace, which Next logs
 * server-side and never sends to the browser. Showing it turns "it broke" into
 * something greppable in the Hostinger logs.
 */
export default function AdminShellError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] Panel shell error:", error);
  }, [error]);

  return (
    <div className="border-line bg-surface shadow-card mx-auto mt-12 max-w-xl rounded-md border p-8">
      <p className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
        Error del panel
      </p>
      <h1 className="font-display text-navy-500 mt-3 text-2xl font-bold">
        No pudimos cargar el panel
      </h1>
      <p className="text-ink-muted mt-3 text-sm">
        Casi siempre es la conexión con la base de datos. Reintenta; si persiste, revisa las
        variables de entorno del servidor (DATABASE_URL, AUTH_SECRET) y que las migraciones estén
        aplicadas.
      </p>
      {error.digest ? (
        <p className="text-ink-muted mt-4 font-mono text-xs">
          Referencia para los logs del servidor: <span className="text-ink">{error.digest}</span>
        </p>
      ) : null}
      <div className="mt-6">
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
