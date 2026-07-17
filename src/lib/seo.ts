import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

interface PageSeo {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/servicios/polimeros". */
  path: string;
  keywords?: string[];
}

/**
 * Branded OG card served by src/app/opengraph-image.tsx. Referenced
 * explicitly because a page-level `openGraph` replaces the inherited one
 * wholesale — without this, pages ship no og:image at all.
 */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — Ingeniería en polímeros reciclados`,
};

/**
 * Shared metadata builder — every page owns its metadata through this
 * helper so canonical URLs, Open Graph and Twitter cards stay consistent.
 */
export function buildMetadata({ title, description, path, keywords }: PageSeo): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_MX",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
