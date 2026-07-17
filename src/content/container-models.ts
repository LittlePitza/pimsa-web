import type { ContainerModel } from "@/types/content";

/**
 * Dimensions transcribed from PRESENTACION PIMSA.pdf, page 11.
 * Existing product codes follow the internal SKU convention. The newly
 * documented 48 × 56 × 34 model stays code-neutral until Sales confirms it.
 */
export const containerModels = [
  { code: "2CONNEG30X32X34", size: "30 × 32 × 34" },
  { code: "2CONNEG48X45X25", size: "48 × 45 × 25" },
  { code: "2CONNEG48X45X34", size: "48 × 45 × 34" },
  { code: "2CONNEG48X45X50", size: "48 × 45 × 50" },
  { code: "Consultar", size: "48 × 56 × 34" },
  { code: "2CONNEG48X64X34", size: "48 × 64 × 34" },
  { code: "2CONNEG48X65X34", size: "48 × 65 × 34" },
] satisfies ContainerModel[];

export const containerModelCount = containerModels.length;
export const containerModelRange = `${containerModels[0].size} a ${containerModels[containerModels.length - 1].size}`;
