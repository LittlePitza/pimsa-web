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
  /** International format without symbols, e.g. "5214426477541" (for wa.me). */
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

export interface Service {
  slug: string;
  /** Two-digit editorial index, e.g. "01". */
  index: string;
  name: string;
  navLabel: string;
  tagline: string;
  summary: string;
  description: string[];
  specs: Spec[];
  materials: string[];
  process: ProcessStep[];
  benefits: string[];
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

export type StockForm = "Molido" | "Pellet" | "Original";

export interface StockItem {
  id: string;
  material: string;
  form: StockForm;
  color: string;
  availability: "Disponible" | "Bajo pedido" | "Consultar";
  notes?: string;
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
