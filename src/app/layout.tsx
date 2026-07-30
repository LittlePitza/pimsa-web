import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { company } from "@/content/company";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Self-hosted fonts via next/font — zero CLS (DESIGN.md §3, §10).
 *
 * Space Grotesk and Inter are variable (one file each) and carry the h1 and
 * body copy, so they stay preloaded on the critical path.
 *
 * IBM Plex Mono ships one file per weight and only dresses small uppercase
 * labels, never the LCP text. Preloading its weights put ~30 KB of High
 * priority requests ahead of the hero image, which then downloaded at Low
 * priority. It now loads off the critical path and swaps in; next/font's
 * metric-matched fallback keeps that swap from shifting layout.
 */
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  preload: false,
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
  // data-scroll-behavior lets Next.js jump instantly to the top on route changes
  // instead of animating the whole page height (the pages are long on mobile),
  // while keeping smooth scrolling for in-page anchors.
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
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
      </body>
    </html>
  );
}
