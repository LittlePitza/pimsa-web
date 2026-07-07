import type { Milestone, Stat } from "@/types/content";
import { company } from "@/content/company";

const yearsOperating = new Date().getFullYear() - company.foundedYear;

/**
 * Oversized stats — protagonists of the design (DESIGN.md §4.6).
 * TODO(marketing): add validated figures (tons/month, active clients)
 * once provided (docs/marketing-material-request.md §4).
 */
export const stats: Stat[] = [
  { value: yearsOperating, suffix: "+", label: "Años reciclando plásticos de ingeniería" },
  { value: 3, label: "Industrias atendidas: automotriz, línea blanca y electrónica" },
  { value: 9, prefix: "ISO ", suffix: "001", label: "Sistema de calidad certificado (9001:2015)" },
  { value: 100, suffix: "%", label: "Recolecciones con documentación ambiental" },
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
      "Certificación ISO 9001:2015, registro IMMEX y DUNS: la operación se profesionaliza para atender a la industria automotriz, línea blanca y electrónica.",
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
  vision:
    "Ser el aliado de referencia en economía circular de plásticos de ingeniería en México.",
  values: ["Calidad certificada", "Cumplimiento ambiental", "Confiabilidad", "Mejora continua"],
};
