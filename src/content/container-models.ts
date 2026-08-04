import type { ContainerModel } from "@/types/content";

/**
 * Dimensions transcribed from PRESENTACION PIMSA.pdf, page 11.
 * Existing product codes follow the internal SKU convention. The newly
 * documented 48 × 56 × 34 model stays code-neutral until Sales confirms it.
 *
 * Material and colour live on each row rather than being written into the
 * table markup: they are facts about the product, and hard-coding them in
 * JSX made the component silently wrong for any future model that isn't
 * black HDPE. The SKU prefix (2CONNEG = contenedor negro) already encodes
 * the colour, so the two must agree.
 */
const HDPE_BLACK = { material: "HDPE", color: "Negro" } as const;

export const containerModels = [
  { code: "2CONNEG30X32X34", size: "30 × 32 × 34", ...HDPE_BLACK },
  { code: "2CONNEG48X45X25", size: "48 × 45 × 25", ...HDPE_BLACK },
  { code: "2CONNEG48X45X34", size: "48 × 45 × 34", ...HDPE_BLACK },
  { code: "2CONNEG48X45X50", size: "48 × 45 × 50", ...HDPE_BLACK },
  { code: "Consultar", size: "48 × 56 × 34", ...HDPE_BLACK },
  { code: "2CONNEG48X64X34", size: "48 × 64 × 34", ...HDPE_BLACK },
  { code: "2CONNEG48X65X34", size: "48 × 65 × 34", ...HDPE_BLACK },
] satisfies ContainerModel[];

export const containerModelCount = containerModels.length;
export const containerModelRange = `${containerModels[0].size} a ${containerModels[containerModels.length - 1].size}`;
