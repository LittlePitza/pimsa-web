import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
