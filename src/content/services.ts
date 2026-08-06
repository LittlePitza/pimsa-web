import type { Service } from "@/types/content";
import {
  containerModelCount,
  containerModelRange,
  containerModels,
} from "@/content/container-models";
import {
  formatInteger,
  millingCapacityTonsPerYear,
  operationalFacts,
  pelletizingCapacityTonsPerYear,
} from "@/content/operational-facts";

const millingCapacityLabel = formatInteger(millingCapacityTonsPerYear);
const pelletizingCapacityLabel = formatInteger(pelletizingCapacityTonsPerYear);

/**
 * Service catalog — drives /servicios hub, the four detail pages,
 * home sections, sitemap entries and Service JSON-LD.
 * TODO(marketing): replace placeholder capacities/coverage with validated
 * figures (docs/marketing-material-request.md §3).
 */
export const services: Service[] = [
  {
    slug: "polimeros",
    index: "01",
    name: "Polímeros de ingeniería",
    tagline: "Materia prima reciclada con proceso controlado",
    summary:
      "Resinas y compuestos de ingeniería reciclados —molidos o peletizados— listos para volver a tu línea de producción con trazabilidad y consistencia de lote.",
    description: [
      "Transformamos scrap post-industrial en polímeros de ingeniería listos para inyección y extrusión. Cada lote pasa por un proceso controlado de inspección, molienda, peletizado, re-formulación y pruebas de laboratorio bajo nuestro sistema de calidad ISO 9001:2015.",
      "La mayoría de nuestros polímeros provienen de componentes automotrices —motor, estructura, transmisión, interiores y dirección—, materiales de ingeniería que reformulamos para las industrias automotriz, de línea blanca y electrónica, con presentaciones consistentes que reducen el costo de materia prima sin sacrificar desempeño.",
    ],
    specs: [
      {
        label: "Materiales destacados",
        value: "PC · ABS/PC · PA66 · PP · PVC · PBT · POM · PMMA · TPO",
      },
      { label: "Presentación", value: "Molido o pellet · Sacos de 25 kg · Súper sacos" },
      {
        label: "Calidad",
        value: "Re-formulación y laboratorio · Sistema de gestión ISO 9001:2015",
      },
      { label: "Entrega", value: "Cobertura nacional" },
    ],
    materials: [
      "PC",
      "ABS/PC",
      "PA66",
      "PP",
      "PVC",
      "PBT",
      "POM",
      "PMMA",
      "TPO",
      "ABS",
      "PA6",
      "HDPE",
      "HIPS",
    ],
    process: [
      {
        title: "Recolección",
        description:
          "Recolectamos los polímeros en las plantas de nuestros proveedores con unidades y documentación propias.",
      },
      {
        title: "Recepción en planta",
        description:
          "Pesaje, identificación y registro del material al ingresar, con trazabilidad desde el primer movimiento.",
      },
      {
        title: "Inspección",
        description:
          "Clasificamos por tipo de resina, color y grado, y separamos contaminantes para garantizar lotes homogéneos.",
      },
      {
        title: "Molienda",
        description:
          "Reducción de tamaño en molinos calibrados, con control de contaminación cruzada entre materiales.",
      },
      {
        title: "Peletizado",
        description:
          "Extrusión y corte a pellet uniforme, la presentación ideal para dosificación directa en máquina.",
      },
      {
        title: "Re-formulación",
        description:
          "Re-formulamos el material como parte del proceso antes de enviarlo a validación de laboratorio.",
      },
      {
        title: "Pruebas de laboratorio",
        description:
          "Cada lote pasa por pruebas de laboratorio antes de liberarse bajo nuestro sistema de gestión de calidad ISO 9001:2015.",
      },
      {
        title: "Liberación y entrega",
        description:
          "Entregamos cada lote liberado, con embalaje e identificación en la presentación que tu proceso requiera.",
      },
    ],
    benefits: [
      "Reducción del costo de materia prima frente a resina virgen",
      "Re-formulación integrada al proceso de recuperación",
      "Validación de laboratorio antes de la entrega",
      "Calidad respaldada por un sistema de gestión ISO 9001:2015",
      "Apoyo a tus metas de economía circular y sustentabilidad",
    ],
    figure: {
      src: "/media/servicios/polimeros-pellets.jpg",
      alt: "Pellets de polímero reciclado color natural sobre fondo negro",
      caption: "Fig. 01 — Pellet reciclado",
      tag: "Producto terminado",
    },
    gallery: [],
    materialShots: [
      {
        code: "POM",
        name: "Acetal",
        form: "Pellet",
        src: "/media/servicios/material-pom.jpg",
        alt: "Pellets negros de acetal POM reciclado",
      },
      {
        code: "PC",
        name: "Policarbonato",
        form: "Molido",
        src: "/media/servicios/material-pc.jpg",
        alt: "Molido cristal de policarbonato reciclado",
      },
      {
        code: "ABS",
        name: "Acrilonitrilo butadieno estireno",
        form: "Molido",
        src: "/media/servicios/material-abs.jpg",
        alt: "Molido gris de ABS reciclado",
      },
      {
        code: "PA6",
        name: "Poliamida (nylon)",
        form: "Molido",
        src: "/media/servicios/material-pa.jpg",
        alt: "Molido natural de poliamida reciclada",
      },
      {
        code: "PMMA",
        name: "Acrílico",
        form: "Molido",
        src: "/media/servicios/material-pmma.jpg",
        alt: "Molido rojo de acrílico PMMA reciclado",
      },
      {
        code: "PBT",
        name: "Poliéster",
        form: "Pellet",
        src: "/media/servicios/material-pbt.jpg",
        alt: "Pellets negros de PBT reciclado",
      },
    ],
    metaTitle: "Polímeros de ingeniería reciclados",
    metaDescription:
      "Venta de polímeros de ingeniería reciclados —PC, ABS/PC, PA66, POM y más— en molido o pellet, con laboratorio e ISO 9001:2015. Cobertura nacional.",
    keywords: [
      "polímeros de ingeniería reciclados",
      "resinas recicladas",
      "venta de plástico reciclado",
      "ABS reciclado",
      "policarbonato reciclado",
    ],
    relatedSlugs: ["molienda-peletizado", "recoleccion-scrap"],
  },
  {
    slug: "molienda-peletizado",
    index: "02",
    name: "Molienda y peletizado",
    tagline: "Maquila de reducción y peletizado para tu material",
    summary:
      "Servicio de maquila: convertimos tu scrap o material fuera de especificación en molido o pellet aprovechable, con control de calidad en cada etapa.",
    description: [
      "Si tu planta genera scrap, colada, piezas rechazadas o material fuera de especificación, lo convertimos en materia prima reutilizable mediante molienda y peletizado a maquila.",
      `Nuestra capacidad instalada respalda volúmenes industriales: ${millingCapacityLabel} toneladas anuales de molienda y ${pelletizingCapacityLabel} toneladas anuales de peletizado. Operamos con controles de limpieza y segregación por material que evitan la contaminación cruzada, y devolvemos tu material en la presentación y granulometría que tu proceso necesita.`,
    ],
    specs: [
      {
        label: "Capacidad",
        value: `Molienda ${millingCapacityLabel} t/año · Peletizado ${pelletizingCapacityLabel} t/año`,
      },
      { label: "Materiales", value: "Termoplásticos de ingeniería y commodities" },
      { label: "Granulometría", value: "Según especificación del cliente" },
      { label: "Logística", value: "Recolección y retorno coordinados" },
    ],
    materials: ["ABS", "PC", "PA", "POM", "PP", "PE", "HIPS", "PMMA"],
    process: [
      {
        title: "Recepción y registro",
        description:
          "Pesaje, identificación y registro de tu material al ingresar a planta, con trazabilidad por lote.",
      },
      {
        title: "Molienda",
        description:
          "Reducción en molinos dedicados con criba según la granulometría que requieras.",
      },
      {
        title: "Peletizado (opcional)",
        description: "Extrusión y corte a pellet para dosificación directa en tus máquinas.",
      },
      {
        title: "Retorno",
        description:
          "Embalaje e identificación del producto terminado y coordinación de la entrega de vuelta a tu planta.",
      },
    ],
    benefits: [
      "Recupera valor del scrap que hoy es un costo",
      "Sin inversión en equipo de molienda propio",
      "Control documentado de contaminación cruzada",
      "Trazabilidad completa de tu material",
    ],
    figure: {
      src: "/media/servicios/molienda-molino.jpg",
      alt: "Scrap plástico negro frente al molino en la planta de PIMSA",
      caption: "Fig. 01 — Área de molienda",
      tag: "Planta La Estancia",
    },
    gallery: [
      {
        src: "/media/servicios/molienda-alimentacion.jpg",
        alt: "Operador alimentando el molino con scrap plástico",
        caption: "Fig. 02 — Alimentación del molino",
        tag: "Molienda",
      },
      {
        src: "/media/servicios/molienda-criba.jpg",
        alt: "Pellet reciclado sobre la malla de cribado",
        caption: "Fig. 03 — Cribado de pellet",
        tag: "Control de calidad",
      },
    ],
    metaTitle: "Molienda y peletizado de plástico (maquila)",
    metaDescription:
      "Maquila de molienda y peletizado de plásticos de ingeniería. Convertimos tu scrap en materia prima reutilizable dentro de un sistema de gestión ISO 9001:2015.",
    keywords: [
      "molienda de plástico",
      "peletizado de plástico",
      "maquila de molienda",
      "reciclaje de plástico industrial",
    ],
    relatedSlugs: ["recoleccion-scrap", "polimeros"],
  },
  {
    slug: "recoleccion-scrap",
    index: "03",
    name: "Recolección de scrap",
    tagline: "Compra y recolección de scrap plástico industrial",
    summary:
      "Recolectamos y compramos el scrap plástico de tu planta con permisos ambientales oficiales, logística propia y documentación completa para tus auditorías.",
    description: [
      "Retiramos de tu planta el scrap plástico post-industrial: colada, piezas rechazadas, purga, empaque rígido y material obsoleto. Contamos con los permisos ambientales oficiales para el manejo y transporte de residuos de manejo especial.",
      "Vamos más allá del retiro: reestructuramos tu área de residuos con la metodología 5S para optimizar espacios, tiempos y seguridad, y trabajamos contigo hacia el objetivo Zero Waste to Landfill, buscando un destino apropiado para cada residuo en lugar del relleno sanitario.",
      `Cada recolección queda documentada, dándote evidencia para auditorías ambientales y programas de economía circular corporativos. Más de ${formatInteger(operationalFacts.companiesServedMinimum)} compañías confían en nosotros para la logística de sus residuos plásticos.`,
    ],
    specs: [
      { label: "Materiales", value: "Scrap termoplástico post-industrial" },
      { label: "Permisos", value: "Autorizaciones ambientales vigentes" },
      { label: "Documentación", value: "Manifiestos y evidencia por recolección" },
      { label: "Cobertura", value: "Centro del país · otras regiones según volumen" },
    ],
    materials: ["ABS", "PC", "PA", "POM", "PP", "PE", "PET", "HIPS"],
    process: [
      {
        title: "Diagnóstico",
        description:
          "Visitamos tu planta, identificamos los materiales y volúmenes generados y definimos el esquema de compra.",
      },
      {
        title: "Programa de recolección",
        description:
          "Establecemos frecuencias y logística de retiro que se adaptan a tu operación.",
      },
      {
        title: "Retiro documentado",
        description:
          "Recolectamos con unidades autorizadas y entregamos la documentación de cada movimiento.",
      },
      {
        title: "Valorización",
        description:
          "Tu scrap se procesa en nuestra planta y se convierte en materia prima recuperada para nuevas aplicaciones.",
      },
    ],
    benefits: [
      "Ingresos por un material que hoy es residuo",
      "Cumplimiento ambiental con permisos oficiales",
      "Documentación completa y reportes precisos para auditorías",
      "Trazabilidad de los residuos en cada movimiento",
      "Área de residuos ordenada bajo metodología 5S: seguridad, higiene y ahorro de tiempos",
      "Ahorro en mano de obra dedicada al manejo de residuos",
    ],
    figure: {
      src: "/media/servicios/recoleccion-gaylords.jpg",
      alt: "Gaylords de scrap plástico recolectado y clasificado en el patio de PIMSA",
      caption: "Fig. 01 — Scrap recolectado",
      tag: "Clasificado por resina",
    },
    gallery: [
      {
        src: "/media/servicios/recoleccion-scrap.jpg",
        alt: "Contenedor industrial lleno de scrap plástico recolectado",
        caption: "Fig. 02 — Scrap post-industrial",
        tag: "Colada · Piezas",
      },
      {
        src: "/media/servicios/recoleccion-patio.jpg",
        alt: "Patio de PIMSA con súper sacos de material recuperado",
        caption: "Fig. 03 — Patio de recepción",
        tag: "Súper sacos",
      },
    ],
    metaTitle: "Recolección y compra de scrap plástico",
    metaDescription:
      "Recolección y compra de scrap plástico industrial con permisos ambientales y documentación para auditorías. Cobertura en el centro de México.",
    keywords: [
      "recolección de scrap plástico",
      "compra de scrap plástico",
      "venta de scrap industrial",
      "manejo de residuos plásticos",
    ],
    relatedSlugs: ["molienda-peletizado", "polimeros"],
  },
  {
    slug: "contenedores",
    index: "04",
    name: "Contenedores colapsables",
    tagline: "Contenedores HD plegables para logística industrial",
    summary:
      "Venta, renta y reparación de contenedores colapsables de alta densidad para almacenaje y transporte industrial: resistentes, apilables y plegables.",
    description: [
      `Comercializamos contenedores colapsables de polietileno de alta densidad, la solución estándar de la industria automotriz y manufacturera para mover componentes entre plantas. Contamos con amplio inventario en ${containerModelCount} medidas y esquemas de venta, renta y reparación.`,
      "Al plegarse reducen su volumen en el viaje de retorno, bajando tus costos de flete y almacenaje. Son durables, higiénicos y compatibles con montacargas y racks estándar.",
    ],
    specs: [
      { label: "Material", value: "Polietileno de alta densidad (HDPE)" },
      { label: "Tipo", value: "Colapsable · Apilable · Grado industrial" },
      { label: "Esquemas", value: "Venta · Renta · Reparación" },
      {
        label: "Medidas",
        value: `${containerModelCount} modelos, de ${containerModelRange} in`,
      },
    ],
    materials: ["HDPE"],
    process: [
      {
        title: "Cotización",
        description: "Dinos medidas, cantidades y uso; te proponemos el contenedor adecuado.",
      },
      {
        title: "Disponibilidad",
        description: "Confirmamos existencia o tiempo de suministro según el volumen.",
      },
      {
        title: "Entrega",
        description: "Coordinamos la logística de entrega en tu planta o centro de distribución.",
      },
      {
        title: "Renta y reparación",
        description:
          "Esquemas de renta por proyecto y reparación de tus contenedores para alargar su vida útil.",
      },
    ],
    benefits: [
      "Hasta 70% menos volumen en viajes de retorno",
      "Mayor vida útil que el empaque de cartón o madera",
      "Compatible con logística estándar (montacargas, racks)",
      "Higiénico y 100% reciclable al final de su vida",
    ],
    figure: {
      src: "/media/servicios/contenedores-frontal.jpg",
      alt: "Contenedor colapsable negro de HDPE en el patio de PIMSA",
      caption: "Fig. 01 — Contenedor armado",
      tag: "HDPE · Grado industrial",
    },
    gallery: [
      {
        src: "/media/servicios/contenedores-colapsado.jpg",
        alt: "Contenedor colapsable plegado mostrando la reducción de volumen",
        caption: "Fig. 02 — Contenedor plegado",
        tag: "−70% volumen",
      },
      {
        src: "/media/servicios/contenedores-stack.jpg",
        alt: "Torres de contenedores colapsables apilados en inventario",
        caption: "Fig. 03 — Inventario en patio",
        tag: "Apilables",
      },
    ],
    containerModels,
    metaTitle: "Contenedores colapsables industriales",
    metaDescription: `Venta, renta y reparación de contenedores colapsables de HDPE: ${containerModelCount} medidas, apilables y plegables. Ideales para automotriz y manufactura.`,
    keywords: [
      "contenedores colapsables",
      "contenedores plegables industriales",
      "contenedores HDPE",
      "renta de contenedores industriales",
      "empaque retornable",
    ],
    relatedSlugs: ["polimeros", "recoleccion-scrap"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/**
 * Situation → service.
 *
 * Nobody arrives searching for "maquila de peletizado". They arrive with a
 * problem in their own words — a yard filling up with scrap, a purchase order
 * to fill, a batch out of spec — and have to guess which of four industry
 * terms covers it. Each line below is the opening sentence of that service's
 * own description, rewritten from the customer's side.
 */
export const serviceFinder: { need: string; slug: string }[] = [
  {
    need: "Mi planta genera scrap plástico y hoy solo representa un costo",
    slug: "recoleccion-scrap",
  },
  {
    need: "Necesito comprar materia prima reciclada para mi producción",
    slug: "polimeros",
  },
  {
    need: "Tengo material fuera de especificación y quiero recuperarlo",
    slug: "molienda-peletizado",
  },
  {
    need: "Necesito mover componentes entre plantas sin gastar en empaque",
    slug: "contenedores",
  },
];

/** Lightweight list serialized by Server Components into forms and controls. */
export const serviceNames = services.map((s) => s.name);
