/** Site-wide constants derived from environment. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://plasticospimsa.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Plásticos PIMSA";

/** Absolute URL for a path ("/servicios" → "https://…/servicios"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
