/**
 * Operational figures backed by PRESENTACION PIMSA.pdf (2023):
 * page 8 for installed capacity and page 15 for companies served.
 * Keep these values centralized so stats, service copy and SEO cannot drift.
 */
export const operationalFacts = {
  millingCapacityKgPerYear: 84_672_000,
  pelletizingCapacityKgPerYear: 5_400_000,
  companiesServedMinimum: 100,
} as const;

export const millingCapacityTonsPerYear = operationalFacts.millingCapacityKgPerYear / 1_000;
export const pelletizingCapacityTonsPerYear = operationalFacts.pelletizingCapacityKgPerYear / 1_000;

export function formatInteger(value: number): string {
  return value.toLocaleString("es-MX", { maximumFractionDigits: 0 });
}
