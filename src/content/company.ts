import type { Certification, Company, NavItem, SocialLink } from "@/types/content";

/**
 * Company master data (single source of truth for NAP consistency — SEO).
 * Phone/WhatsApp confirmed 2026-07-29: 442 274 7546 (all messages route here).
 * Email confirmed 2026-08-07: contacto@plasticospimsa.com is the public inbox
 * and receives the contact-form leads. Job applications are the exception —
 * they carry a CV and go to RRHH (APPLICATIONS_EMAIL_TO). The 2023 corporate
 * deck's hola@plasticospimsa.com is not in use; do not reintroduce it.
 * TODO(marketing): confirm hours and social URLs
 * (see docs/marketing-material-request.md §5).
 */
export const company: Company = {
  name: "Plásticos PIMSA",
  legalName: "Plásticos de Ingeniería Mexicanos, S.A. de C.V.",
  tagline: "Más que reciclaje, una visión a futuro",
  foundedYear: 2008,
  incorporatedYear: 2011,
  description:
    "Empresa mexicana dedicada a la venta de polímeros de ingeniería reciclados —ABS, PC, PA, POM y más— producidos en planta propia mediante recolección de scrap industrial, triturado, molienda y peletizado bajo un sistema de gestión de calidad ISO 9001:2015.",
  address: {
    street: "Calle Ingenieros #104",
    neighborhood: "Distrito Industrial Oriente",
    locality: "El Castillo",
    municipality: "Apaseo el Grande",
    state: "Guanajuato",
    postalCode: "38160",
    country: "MX",
  },
  phone: "+52 442 274 7546",
  whatsapp: "524422747546",
  whatsappDisplay: "+52 442 274 7546",
  email: "contacto@plasticospimsa.com",
  hours: "Lunes a Viernes · 8:00 – 18:00",
  social: [
    // TODO(marketing): confirm official profile URLs before launch.
    { name: "Facebook", url: "https://www.facebook.com/plasticospimsa" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/plasticos-pimsa" },
    { name: "Instagram", url: "https://www.instagram.com/plasticospimsa" },
    { name: "TikTok", url: "https://www.tiktok.com/@plasticospimsa" },
  ] satisfies SocialLink[],
};

/** Industries served — shown as a mono strip on home (DESIGN.md §7). */
export const industries = ["Automotriz", "Línea blanca", "Eléctrico y electrónico"] as const;

/**
 * Certifications & registries — key trust signals (PLAN.md §2).
 * TODO(marketing): confirm certifying body, validity and publishable detail.
 */
export const certifications: Certification[] = [
  {
    code: "ISO 9001:2015",
    name: "Sistema de Gestión de Calidad",
    description:
      "Sistema de gestión certificado bajo la norma internacional de calidad ISO 9001:2015.",
  },
  {
    code: "IMMEX",
    name: "Programa de manufactura y exportación",
    description: "Registro en el programa de manufactura y servicios de exportación.",
  },
  {
    code: "DUNS",
    name: "Registro empresarial internacional",
    description: "Identificador empresarial internacional asignado a la organización.",
  },
];

/**
 * Main navigation. The services submenu is written out by hand ON PURPOSE:
 * the Header is a client component, and deriving these links from
 * src/content/services.ts would drag the whole service catalog into the
 * client bundle. Keep the list in sync with the slugs in services.ts.
 */
export const mainNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  {
    label: "Servicios",
    href: "/servicios",
    children: [
      { label: "Polímeros de ingeniería", href: "/servicios/polimeros" },
      { label: "Molienda y peletizado", href: "/servicios/molienda-peletizado" },
      { label: "Recolección de scrap", href: "/servicios/recoleccion-scrap" },
      { label: "Contenedores colapsables", href: "/servicios/contenedores" },
    ],
  },
  { label: "Stock", href: "/stock" },
  { label: "Bolsa de trabajo", href: "/vacantes" },
  { label: "FAQ", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

/** Footer-only links. */
export const legalNav: NavItem[] = [{ label: "Aviso de privacidad", href: "/aviso-de-privacidad" }];

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function fullAddress(): string {
  const a = company.address;
  return `${a.street}, ${a.neighborhood}, ${a.locality}, ${a.postalCode} ${a.municipality}, ${a.state}, México`;
}
