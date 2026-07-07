"use client";

import { ButtonLink } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/content/company";

/**
 * Sticky bottom CTA bar on service pages, mobile only (DESIGN.md §6).
 * The WhatsApp FAB moves up when this bar is present (see globals.css :has rule).
 */
export function StickyMobileCta({ service }: { service: string }) {
  return (
    <div className="sticky-cta bg-surface border-line fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t p-3 md:hidden print:hidden">
      <ButtonLink href="/contacto" className="flex-1" size="md">
        Cotizar
      </ButtonLink>
      <ButtonLink
        href={whatsappUrl(`Hola, me interesa el servicio de ${service}.`)}
        variant="outline"
        size="md"
        className="flex-1"
        onClick={() => trackEvent("whatsapp_click", { location: "sticky_cta", service })}
      >
        WhatsApp
      </ButtonLink>
    </div>
  );
}
