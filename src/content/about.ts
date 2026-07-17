import type { Milestone, Stat } from "@/types/content";
import { company } from "@/content/company";
import {
  millingCapacityTonsPerYear,
  operationalFacts,
  pelletizingCapacityTonsPerYear,
} from "@/content/operational-facts";

const yearsOperating = new Date().getFullYear() - company.foundedYear;

/**
 * Oversized stats — protagonists of the design (DESIGN.md §4.6).
 * Capacity figures from the corporate deck (PRESENTACION PIMSA):
 * molinos 84,672,000 kg/año · peletizado 5,400,000 kg/año · +100 compañías.
 */
export const stats: Stat[] = [
  { value: yearsOperating, suffix: "+", label: "Años reciclando plásticos de ingeniería" },
  { value: millingCapacityTonsPerYear, suffix: " t", label: "Capacidad anual de molienda" },
  {
    value: pelletizingCapacityTonsPerYear,
    suffix: " t",
    label: "Capacidad anual de peletizado",
  },
  {
    value: operationalFacts.companiesServedMinimum,
    suffix: "+",
    label: "Compañías atendidas en scrap y residuos",
  },
];

/**
 * Company timeline (DESIGN.md §7 — Nosotros).
 * TODO(marketing): validate dates and add missing milestones.
 */
export const milestones: Milestone[] = [
  {
    year: "2008",
    title: "Inician operaciones",
    description:
      "PIMSA nace en el Bajío para dar una segunda vida al scrap plástico de la industria manufacturera.",
  },
  {
    year: "2011",
    title: "Constitución formal",
    description:
      "Se constituye Plásticos de Ingeniería Mexicanos, S.A. de C.V., consolidando la operación como empresa.",
  },
  {
    year: "2015+",
    title: "Certificación y crecimiento",
    description:
      "Certificación del sistema de gestión de calidad bajo ISO 9001:2015, registro IMMEX y DUNS: la operación se profesionaliza para atender a la industria automotriz, línea blanca y electrónica.",
  },
  {
    year: "Hoy",
    title: "Economía circular en serio",
    description:
      "Operamos un ciclo completo: recolección con permisos ambientales, molienda, peletizado y venta de polímeros de ingeniería con entrega a todo México.",
  },
];

/** Mission / vision / values. TODO(marketing): replace with validated text. */
export const missionVision = {
  mission:
    "Transformar el scrap plástico industrial en materia prima confiable, generando valor económico y ambiental para nuestros clientes.",
  vision: "Ser el aliado de referencia en economía circular de plásticos de ingeniería en México.",
  values: ["Gestión de calidad", "Cumplimiento ambiental", "Confiabilidad", "Mejora continua"],
};
