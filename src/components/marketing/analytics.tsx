"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { getConsent, GTM_ID, subscribeConsent } from "@/lib/analytics";

const getServerSnapshot = () => null;

/**
 * Loads Google Tag Manager only after the user grants cookie consent
 * (PLAN.md §6 — zero render-blocking third parties; §7 — consent gating).
 */
export function Analytics() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerSnapshot);

  if (!GTM_ID || consent !== "granted") return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
