import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/marketing/analytics";
import { ConsentBanner } from "@/components/marketing/consent-banner";
import { UtmCapture } from "@/components/marketing/utm-capture";
import { company } from "@/content/company";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Self-hosted fonts via next/font — zero CLS (DESIGN.md §3, §10). */
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Reciclaje de plásticos de ingeniería`,
    template: `%s · ${SITE_NAME}`,
  },
  description: company.description,
  openGraph: {
    siteName: SITE_NAME,
    locale: "es_MX",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e1b2e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-navy-500 sr-only z-[60] rounded-sm px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido principal
        </a>
        {children}
        <UtmCapture />
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
