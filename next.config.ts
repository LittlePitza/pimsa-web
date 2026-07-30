import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy. 'unsafe-inline' for scripts is required by
 * Next.js inline bootstrap scripts and the GTM snippet; external script
 * sources stay locked to self + Google Tag Manager. If Marketing adds more
 * tags through GTM (e.g. Meta pixel), extend script-src/connect-src here.
 * Dev needs 'unsafe-eval' (React refresh) and ws: (HMR).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""} https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net`,
  "frame-src https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // 2 years; the site is HTTPS-only behind the Hostinger proxy.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    /**
     * Ship the stylesheet inside the document instead of as a linked chunk.
     * The link was render-blocking and PageSpeed put it at ~590 ms, since a
     * separate request costs a full round trip before anything can paint.
     *
     * Measured under real network throttling (Lantern on localhost hides this
     * — it charges no round trip): LCP score 78-82 -> 97, FCP 2.7 s -> 1.9 s.
     * The cost is a bigger document (45 -> 86 KB gzipped, as Next repeats the
     * CSS in the RSC payload) and main-thread time to parse it, which the
     * 10 ms production TBT has ample room to absorb.
     */
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /**
     * Non-default qualities must be allow-listed (Next 16). 50 is used by
     * decorative full-bleed backgrounds, 60 by the below-the-fold card
     * imagery (indistinguishable from 75 in AVIF at card size, and the bytes
     * come straight off the mobile critical path).
     */
    qualities: [50, 60, 75],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    /**
     * 301 map from the old WordPress URLs — critical to keep existing
     * rankings (PLAN.md §6). TODO: complete this list after exporting the
     * current site's URL inventory (needs WP admin access, see
     * docs/marketing-material-request.md §7).
     */
    return [];
  },
};

export default nextConfig;
