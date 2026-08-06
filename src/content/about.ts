import type { Milestone, ServiceImage, Spec, Stat } from "@/types/content";
import { company } from "@/content/company";
import {
  millingCapacityTonsPerYear,
  operationalFacts,
  pelletizingCapacityTonsPerYear,
} from "@/content/operational-facts";

const yearsOperating = new Date().getFullYear() - company.foundedYear;

/**
 * Identity card under the About hero — the facts a purchasing or quality
 * engineer checks first, in the mono "datasheet" register of the brand.
 * Every value derives from company data; nothing is written by hand twice.
 */
export const identityFacts: Spec[] = [
  { label: "Razón social", value: company.legalName },
  { label: "Operando desde", value: String(company.foundedYear) },
  { label: "Constituida", value: String(company.incorporatedYear) },
  { label: "Planta", value: `${company.address.municipality}, ${company.address.state}` },
  { label: "Sistema de gestión", value: "ISO 9001:2015" },
  { label: "Cobertura", value: "Toda la República Mexicana" },
];

/**
 * The plant, in evidence. A supplier page without proof of a real operation
 * is a brochure — these are the four stages a visiting auditor would walk
 * through, in the order they happen.
 */
export const operationFigures: ServiceImage[] = [
  {
    src: "/media/corporate/patio-recepcion.jpg",
    alt: "Super sacos y gaylords de scrap plástico en el patio de recepción de PIMSA",
    caption: "Fig. 01 — Recepción y clasificación",
    tag: "Entrada",
  },
  {
    src: "/media/corporate/peletizado-extrusor.jpg",
    alt: "Extrusor y tolva de la línea de peletizado de PIMSA",
    caption: "Fig. 02 — Línea de peletizado",
    tag: "Transformación",
  },
  {
    src: "/media/corporate/laboratorio-balanza.jpg",
    alt: "Balanza analítica del laboratorio de PIMSA con una muestra pesada",
    caption: "Fig. 03 — Control de calidad",
    tag: "Verificación",
  },
  {
    src: "/media/corporate/producto-terminado.jpg",
    alt: "Gaylord de pellet recuperado etiquetado y listo para embarque",
    caption: "Fig. 04 — Producto terminado",
    tag: "Salida",
  },
];

/**
 * Why the Bajío matters commercially. This is also the page's only
 * geographic copy, and the target keywords ("recicladora de plásticos
 * Querétaro / Guanajuato") depend on it existing in the body, not just in
 * the meta tags.
 */
export const locationHighlights: Spec[] = [
  {
    label: "Corredor industrial",
    value:
      "La planta está en el Bajío, entre los clústeres automotrices y de línea blanca de Guanajuato y Querétaro.",
  },
  {
    label: "Cercanía operativa",
    value:
      "Estar junto a quien genera el scrap acorta la recolección y reduce el costo logístico de devolver el material ya transformado.",
  },
  {
    label: "Alcance nacional",
    value:
      "Desde ahí entregamos polímeros de ingeniería recuperados a plantas de toda la República Mexicana.",
  },
];

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
