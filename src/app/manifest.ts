import type { MetadataRoute } from "next";
import { company } from "@/content/company";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "PIMSA",
    description: company.description,
    start_url: "/",
    display: "browser",
    background_color: "#f7f8f5",
    theme_color: "#0e1b2e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
