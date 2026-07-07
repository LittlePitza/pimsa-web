import type { Service } from "@/types/content";

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
    navLabel: "Polímeros",
    tagline: "Materia prima reciclada con calidad certificada",
    summary:
      "Resinas y compuestos de ingeniería reciclados —molidos o peletizados— listos para volver a tu línea de producción con trazabilidad y consistencia de lote.",
    description: [
      "Transformamos scrap post-industrial en polímeros de ingeniería listos para inyección y extrusión. Cada lote pasa por un proceso controlado de clasificación, molienda, peletizado y verificación bajo nuestro sistema de calidad ISO 9001:2015.",
      "Trabajamos con los materiales que demandan las industrias automotriz, de línea blanca y electrónica, entregando presentaciones consistentes que reducen el costo de materia prima sin sacrificar desempeño.",
    ],
    specs: [
      { label: "Materiales", value: "ABS · PC · PC/ABS · PA6 · PA66 · POM · PP · HDPE · HIPS" },
      { label: "Presentación", value: "Molido o pellet · Sacos de 25 kg · Súper sacos" },
      { label: "Calidad", value: "Proceso certificado ISO 9001:2015" },
      { label: "Entrega", value: "Cobertura nacional" },
    ],
    materials: ["ABS", "PC", "PC/ABS", "PA6", "PA66", "POM", "PP", "HDPE", "HIPS"],
    process: [
      {
        title: "Selección y clasificación",
        description:
          "Identificamos y separamos el material por tipo de resina, color y grado para garantizar lotes homogéneos.",
      },
      {
        title: "Molienda controlada",
        description:
          "Reducción de tamaño en molinos calibrados, con control de contaminación cruzada entre materiales.",
      },
      {
        title: "Peletizado",
        description:
          "Extrusión y corte a pellet uniforme, la presentación ideal para dosificación directa en máquina.",
      },
      {
        title: "Verificación y embalaje",
        description:
          "Inspección de calidad por lote y embalaje en la presentación que tu proceso requiera.",
      },
    ],
    benefits: [
      "Reducción del costo de materia prima frente a resina virgen",
      "Lotes homogéneos con trazabilidad completa",
      "Calidad respaldada por certificación ISO 9001:2015",
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
      "Venta de polímeros de ingeniería reciclados: ABS, PC, PA, POM, HDPE y más, en molido o pellet, con calidad certificada ISO 9001:2015. Cobertura nacional.",
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
    navLabel: "Molienda y peletizado",
    tagline: "Maquila de reducción y peletizado para tu material",
    summary:
      "Servicio de maquila: convertimos tu scrap o material fuera de especificación en molido o pellet aprovechable, con control de calidad en cada etapa.",
    description: [
      "Si tu planta genera scrap, colada, piezas rechazadas o material fuera de especificación, lo convertimos en materia prima reutilizable mediante molienda y peletizado a maquila.",
      "Operamos con controles de limpieza y segregación por material que evitan la contaminación cruzada, y devolvemos tu material en la presentación y granulometría que tu proceso necesita.",
    ],
    specs: [
      { label: "Servicio", value: "Maquila de molienda · Maquila de peletizado" },
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
      "Control de contaminación cruzada certificado",
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
        src: "/media/servicios/molienda-cribado.jpg",
        alt: "Operador cribando pellet reciclado sobre malla",
        caption: "Fig. 03 — Cribado de pellet",
        tag: "Control de calidad",
      },
    ],
    metaTitle: "Molienda y peletizado de plástico (maquila)",
    metaDescription:
      "Maquila de molienda y peletizado de plásticos de ingeniería. Convertimos tu scrap en materia prima reutilizable con calidad ISO 9001:2015.",
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
    navLabel: "Recolección de scrap",
    tagline: "Compra y recolección de scrap plástico industrial",
    summary:
      "Recolectamos y compramos el scrap plástico de tu planta con permisos ambientales oficiales, logística propia y documentación completa para tus auditorías.",
    description: [
      "Retiramos de tu planta el scrap plástico post-industrial: colada, piezas rechazadas, purga, empaque rígido y material obsoleto. Contamos con los permisos ambientales oficiales para el manejo y transporte de residuos de manejo especial.",
      "Cada recolección queda documentada, dándote evidencia para auditorías ambientales y programas de economía circular corporativos.",
    ],
    specs: [
      { label: "Materiales", value: "Scrap termoplástico post-industrial" },
      { label: "Permisos", value: "Autorizaciones ambientales vigentes" },
      { label: "Documentación", value: "Manifiestos y evidencia por recolección" },
      { label: "Cobertura", value: "Bajío y centro del país" },
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
          "Tu scrap se integra a nuestro proceso de reciclaje y vuelve a la cadena productiva.",
      },
    ],
    benefits: [
      "Ingresos por un material que hoy es residuo",
      "Cumplimiento ambiental con permisos oficiales",
      "Documentación completa para auditorías",
      "Logística confiable que no interrumpe tu operación",
    ],
    figure: {
      src: "/media/servicios/recoleccion-camion.jpg",
      alt: "Camión de recolección de PIMSA con su operador en planta",
      caption: "Fig. 01 — Unidad de recolección",
      tag: "Flota propia",
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
      "Recolección y compra de scrap plástico industrial con permisos ambientales oficiales y documentación para auditorías. Cobertura en el Bajío y centro de México.",
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
    navLabel: "Contenedores",
    tagline: "Contenedores HD plegables para logística industrial",
    summary:
      "Venta, renta y reparación de contenedores colapsables de alta densidad para almacenaje y transporte industrial: resistentes, apilables y plegables.",
    description: [
      "Comercializamos contenedores colapsables de polietileno de alta densidad, la solución estándar de la industria automotriz y manufacturera para mover componentes entre plantas. Contamos con amplio inventario en siete medidas y esquemas de venta, renta y reparación.",
      "Al plegarse reducen su volumen en el viaje de retorno, bajando tus costos de flete y almacenaje. Son durables, higiénicos y compatibles con montacargas y racks estándar.",
    ],
    specs: [
      { label: "Material", value: "Polietileno de alta densidad (HDPE)" },
      { label: "Tipo", value: "Colapsable · Apilable · Grado industrial" },
      { label: "Esquemas", value: "Venta · Renta · Reparación" },
      { label: "Medidas", value: "7 modelos, de 30×32×25 a 48×65×34 in" },
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
    containerModels: [
      { code: "2CONNEG30X32X25", size: "30 × 32 × 25" },
      { code: "2CONNEG30X32X34", size: "30 × 32 × 34" },
      { code: "2CONNEG48X45X25", size: "48 × 45 × 25" },
      { code: "2CONNEG48X45X34", size: "48 × 45 × 34" },
      { code: "2CONNEG48X45X50", size: "48 × 45 × 50" },
      { code: "2CONNEG48X64X34", size: "48 × 64 × 34" },
      { code: "2CONNEG48X65X34", size: "48 × 65 × 34" },
    ],
    metaTitle: "Contenedores colapsables industriales",
    metaDescription:
      "Venta, renta y reparación de contenedores colapsables de HDPE para logística industrial: 7 medidas, resistentes, apilables y plegables. Ideales para automotriz y manufactura.",
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

/** Lightweight list for client components (avoids bundling full catalog). */
export const serviceNames = services.map((s) => s.name);
