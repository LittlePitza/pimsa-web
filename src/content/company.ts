import type { Certification, Company, NavItem, SocialLink } from "@/types/content";

/**
 * Company master data (single source of truth for NAP consistency — SEO).
 * TODO(marketing): confirm email, hours, exact phone and social URLs
 * (see docs/marketing-material-request.md §5).
 */
export const company: Company = {
  name: "Plásticos PIMSA",
  legalName: "Plásticos de Ingeniería Mexicanos, S.A. de C.V.",
  foundedYear: 2008,
  incorporatedYear: 2011,
  description:
    "Empresa mexicana de ingeniería en polímeros: recolección de scrap industrial, molienda, peletizado y comercialización de polímeros de ingeniería reciclados con calidad certificada.",
  address: {
    street: "Calle Ingenieros #104",
    neighborhood: "Distrito Industrial Oriente",
    locality: "El Castillo",
    municipality: "Apaseo el Grande",
    state: "Guanajuato",
    postalCode: "38160",
    country: "MX",
  },
  phone: "+52 442 647 7541",
  whatsapp: "5214426477541",
  whatsappDisplay: "+52 1 442 647 7541",
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
export const industries = [
  "Automotriz",
  "Línea blanca",
  "Eléctrico y electrónico",
] as const;

/**
 * Certifications & registries — key trust signals (PLAN.md §2).
 * TODO(marketing): confirm certifying body, validity and publishable detail.
 */
export const certifications: Certification[] = [
  {
    code: "ISO 9001:2015",
    name: "Sistema de Gestión de Calidad",
    description:
      "Procesos de reciclaje y comercialización certificados bajo la norma internacional de gestión de calidad.",
  },
  {
    code: "IMMEX",
    name: "Programa de manufactura y exportación",
    description:
      "Registro que nos permite operar con empresas maquiladoras y de exportación en todo el país.",
  },
  {
    code: "DUNS",
    name: "Registro empresarial internacional",
    description:
      "Identificador global que respalda nuestra confiabilidad comercial ante clientes internacionales.",
  },
];

/** Main navigation. */
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
