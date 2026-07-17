"use client";

import { trackEvent } from "@/lib/analytics";
import { company, whatsappUrl } from "@/content/company";

/** Floating WhatsApp button with click tracking (PLAN.md §7). */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl("Hola, me gustaría solicitar una cotización.")}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={`Escríbenos por WhatsApp: ${company.whatsappDisplay}`}
      onClick={() => trackEvent("whatsapp_click", { location: "fab" })}
      className="whatsapp-fab shadow-lift fixed right-3 bottom-3 z-40 flex size-12 items-center justify-center rounded-full bg-green-500 transition-colors duration-150 hover:bg-green-300 sm:right-5 sm:bottom-5 sm:size-14 print:hidden"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="fill-navy-900 size-6 sm:size-7">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88m8.41-18.29A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.33-1.66a11.88 11.88 0 0 0 5.66 1.44h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.49-8.4" />
      </svg>
    </a>
  );
}
