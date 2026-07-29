/** Shared content types — every file in src/content/ conforms to these. */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SocialLink {
  name: "Facebook" | "LinkedIn" | "Instagram" | "TikTok";
  url: string;
}

export interface Company {
  name: string;
  legalName: string;
  /** Brand tagline, e.g. "Más que reciclaje, una visión a futuro". */
  tagline: string;
  foundedYear: number;
  incorporatedYear: number;
  description: string;
  address: {
    street: string;
    neighborhood: string;
    locality: string;
    municipality: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  /** International format without symbols, e.g. "524422747546" (for wa.me). */
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  hours: string;
  social: SocialLink[];
}

export interface Spec {
  label: string;
  value: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

/** Editorially annotated photo (DESIGN.md §4.5): mono caption + optional tag. */
export interface ServiceImage {
  /** Path under /public, e.g. "/media/servicios/molienda-molino.jpg". */
  src: string;
  alt: string;
  /** Mono caption, e.g. "Fig. 02 — Alimentación del molino". */
  caption: string;
  /** Right-aligned mono tag, e.g. "HDPE · PP". */
  tag?: string;
}

/** Studio close-up of a resin, for the polymers material gallery. */
export interface MaterialShot {
  /** Resin code, e.g. "POM". */
  code: string;
  name: string;
  /** Presentation: "Pellet" | "Molido". */
  form: string;
  src: string;
  alt: string;
}

/** Collapsible container model (dimensions from the PIMSA corporate deck). */
export interface ContainerModel {
  code: string;
  /** External dimensions in inches, e.g. "48 × 45 × 25". */
  size: string;
}

export interface Service {
  slug: string;
  /** Two-digit editorial index, e.g. "01". */
  index: string;
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  specs: Spec[];
  materials: string[];
  process: ProcessStep[];
  benefits: string[];
  /** Lead annotated figure — detail page + hub row thumbnail. */
  figure: ServiceImage;
  /** Supporting annotated photos on the detail page. */
  gallery: ServiceImage[];
  /** Resin close-ups (polymers page only). */
  materialShots?: MaterialShot[];
  /** Container models table (containers page only). */
  containerModels?: ContainerModel[];
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  relatedSlugs: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface Certification {
  code: string;
  name: string;
  description: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}
