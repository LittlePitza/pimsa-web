import type { StockItem } from "@/types/content";

/**
 * Plastic stock — static data today, built catalog-first so Phase 3 only
 * swaps this file for a database query (PLAN.md §9, DESIGN.md §7).
 * TODO(marketing): replace with the real current availability list.
 */
export const stockItems: StockItem[] = [
  {
    id: "abs-molido-natural",
    material: "ABS",
    form: "Molido",
    color: "Natural",
    availability: "Consultar",
  },
  {
    id: "abs-pellet-negro",
    material: "ABS",
    form: "Pellet",
    color: "Negro",
    availability: "Consultar",
  },
  {
    id: "pc-molido-cristal",
    material: "PC (Policarbonato)",
    form: "Molido",
    color: "Cristal",
    availability: "Consultar",
  },
  {
    id: "pcabs-pellet-gris",
    material: "PC/ABS",
    form: "Pellet",
    color: "Gris",
    availability: "Consultar",
  },
  {
    id: "pa6-molido-negro",
    material: "PA6 (Nylon 6)",
    form: "Molido",
    color: "Negro",
    availability: "Consultar",
    notes: "Disponible con y sin fibra de vidrio",
  },
  {
    id: "pp-pellet-mixto",
    material: "PP (Polipropileno)",
    form: "Pellet",
    color: "Varios",
    availability: "Consultar",
  },
  {
    id: "hdpe-molido-mixto",
    material: "HDPE (Polietileno AD)",
    form: "Molido",
    color: "Varios",
    availability: "Consultar",
  },
  {
    id: "hips-molido-blanco",
    material: "HIPS",
    form: "Molido",
    color: "Blanco",
    availability: "Consultar",
  },
];

/** Distinct values used to build the catalog filters. */
export const stockFilters = {
  forms: [...new Set(stockItems.map((i) => i.form))],
  materials: [...new Set(stockItems.map((i) => i.material))],
};
