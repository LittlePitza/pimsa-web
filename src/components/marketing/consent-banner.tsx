"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { getConsent, GTM_ID, setConsent, subscribeConsent } from "@/lib/analytics";

// During SSR pretend a decision exists so the banner only appears after
// hydration for users who haven't decided yet.
const getServerSnapshot = () => "denied" as const;

/**
 * LFPDPPP-friendly cookie consent banner (PLAN.md §7).
 * Only rendered when GTM is configured — without tags there are no
 * non-essential cookies to consent to.
 */
export function ConsentBanner() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerSnapshot);

  if (!GTM_ID || consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="bg-surface border-line shadow-lift fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-md border p-5 md:inset-x-auto md:right-6 md:bottom-6"
    >
      <p className="text-ink text-sm">
        Usamos cookies para medir el uso del sitio y mejorar tu experiencia. Consulta nuestro{" "}
        <Link href="/aviso-de-privacidad" className="text-blue-600 underline">
          aviso de privacidad
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <Button size="sm" onClick={() => setConsent("granted")}>
          Aceptar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConsent("denied")}>
          Rechazar
        </Button>
      </div>
    </div>
  );
}
