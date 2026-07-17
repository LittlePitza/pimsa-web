import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { Analytics } from "@/components/marketing/analytics";
import { ConsentBanner } from "@/components/marketing/consent-banner";
import { UtmCapture } from "@/components/marketing/utm-capture";

/**
 * Public site layout: header, footer, WhatsApp FAB and the marketing-only
 * client utilities (analytics, consent, UTM capture) — the admin panel
 * doesn't need them, so they live here instead of the root layout.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <UtmCapture />
      <ConsentBanner />
      <Analytics />
    </>
  );
}
