import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Analytics } from "@/components/marketing/analytics";
import { ConsentBanner } from "@/components/marketing/consent-banner";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

/** 404 — the loop motif, broken (DESIGN.md §7). */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <section className="flex min-h-[70svh] items-center pt-18">
          <Container className="py-24">
            <svg
              viewBox="0 0 120 120"
              aria-hidden
              className="size-24"
              fill="none"
              strokeLinecap="round"
            >
              {/* Broken loop */}
              <path
                d="M104 60a44 44 0 1 1-24-39.2"
                className="stroke-line"
                strokeWidth="6"
                strokeDasharray="12 10"
              />
              <circle cx="92" cy="26" r="10" className="fill-green-500" />
            </svg>
            <Eyebrow className="mt-10">Error 404</Eyebrow>
            <h1 className="font-display text-h1 text-navy-500 mt-4 font-bold">
              Este material se extravió
            </h1>
            <p className="text-lead text-ink-muted mt-5 max-w-[50ch]">
              La página que buscas no existe o cambió de lugar. Volvamos a ponerla en el ciclo.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/">Ir al inicio</ButtonLink>
              <ButtonLink href="/services" variant="outline">
                Ver servicios
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <ConsentBanner />
      <Analytics />
    </>
  );
}
