"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Marketing error boundary — branded fallback with a retry path. */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[marketing] Unhandled render error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center pt-18">
      <Container className="py-24">
        <Eyebrow>Error temporal</Eyebrow>
        <h1 className="font-display text-h1 text-navy-500 mt-4 font-bold">
          Algo se atascó en la línea
        </h1>
        <p className="text-lead text-ink-muted mt-5 max-w-[50ch]">
          Tuvimos un problema al cargar esta página. Suele resolverse al reintentar; si persiste,
          escríbenos por WhatsApp o desde la página de contacto.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button type="button" onClick={reset}>
            Reintentar
          </Button>
          <ButtonLink href="/" variant="outline">
            Ir al inicio
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
