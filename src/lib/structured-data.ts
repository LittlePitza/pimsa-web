import { certifications, company } from "@/content/company";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import type { Vacancy } from "@/db/schema";
import type { Faq, Service } from "@/types/content";

/**
 * schema.org JSON-LD builders (PLAN.md §6).
 * Rendered through <JsonLd /> so structured data ships as static HTML.
 *
 * Naming note: this module is app-level structured data; the database schema
 * lives in src/db/schema.ts.
 */

type JsonLdObject = Record<string, unknown>;

const organizationId = `${SITE_URL}/#organization`;

/**
 * Compact Organization node embedded wherever the org is referenced.
 * Google resolves `@id` references only within the same page, so pages that
 * don't render the full Organization (services, vacancies) still need
 * name/url/logo inline for rich-result eligibility.
 */
function organizationNode(): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: company.name,
    url: SITE_URL,
    logo: absoluteUrl("/media/brand/pimsa-logo.png"),
  };
}

export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    ...organizationNode(),
    legalName: company.legalName,
    foundingDate: String(company.foundedYear),
    description: company.description,
    address: postalAddress(),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: company.phone,
      contactType: "sales",
      areaServed: "MX",
      availableLanguage: ["es"],
    },
    sameAs: company.social.map((s) => s.url),
  };
}

export function localBusinessSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: company.name,
    url: SITE_URL,
    image: [absoluteUrl("/media/corporate/planta-la-estancia.jpg")],
    telephone: company.phone,
    email: company.email,
    address: postalAddress(),
    // TODO(marketing): add "geo" once the exact Google Maps pin is confirmed.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    parentOrganization: organizationNode(),
  };
}

export function serviceSchema(service: Service): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: absoluteUrl(`/servicios/${service.slug}`),
    image: absoluteUrl(service.figure.src),
    serviceType: service.name,
    areaServed: { "@type": "Country", name: "México" },
    provider: organizationNode(),
  };
}

/**
 * ItemList for the services hub.
 *
 * Each detail page already carries its own Service node; this tells Google
 * the four are one ordered catalogue rather than four unrelated pages, which
 * is what lets the set surface together for a category query. Positions
 * follow the editorial index so the markup and the visible numbering agree.
 */
export function serviceListSchema(list: Service[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de Plásticos PIMSA",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: list.length,
    itemListElement: list.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: service.name,
      description: service.summary,
      url: absoluteUrl(`/servicios/${service.slug}`),
    })),
  };
}

export function faqPageSchema(faqs: Faq[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Days a posting stays valid for Google Jobs when no explicit close date exists. */
const JOB_POSTING_VALID_DAYS = 60;

/** Google Jobs eligibility for vacancy pages (JobPosting structured data). */
export function jobPostingSchema(vacancy: Vacancy): JsonLdObject {
  const datePosted = vacancy.publishedAt ?? vacancy.createdAt;
  const validThrough = new Date(
    datePosted.getTime() + JOB_POSTING_VALID_DAYS * 24 * 60 * 60 * 1000,
  );

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancy.description.replace(/\n/g, "<br>"),
    datePosted: datePosted.toISOString(),
    validThrough: validThrough.toISOString(),
    employmentType: vacancy.employmentType === "Tiempo completo" ? "FULL_TIME" : "OTHER",
    hiringOrganization: organizationNode(),
    jobLocation: {
      "@type": "Place",
      address: postalAddress(),
    },
    directApply: true,
    url: absoluteUrl(`/vacantes/${vacancy.slug}`),
  };
}

/**
 * AboutPage node for /nosotros.
 *
 * `mainEntity` points at the Organization so Google reads the page as the
 * company's own description rather than a loose article, which is what makes
 * it eligible to feed the knowledge panel. The images are the real plant
 * photographs the page already shows — claiming pictures the page doesn't
 * render is exactly the kind of mismatch that gets structured data ignored.
 */
export function aboutPageSchema(images: string[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/nosotros#aboutpage`,
    url: absoluteUrl("/nosotros"),
    name: `Nosotros — ${company.name}`,
    description: company.description,
    inLanguage: "es-MX",
    primaryImageOfPage: images[0] ? absoluteUrl(images[0]) : undefined,
    image: images.map((src) => absoluteUrl(src)),
    mainEntity: {
      ...organizationNode(),
      legalName: company.legalName,
      foundingDate: String(company.foundedYear),
      description: company.description,
      address: postalAddress(),
      areaServed: { "@type": "Country", name: "México" },
      hasCredential: certifications.map((cert) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: cert.name,
        name: cert.code,
      })),
      sameAs: company.social.map((s) => s.url),
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function postalAddress(): JsonLdObject {
  const a = company.address;
  return {
    "@type": "PostalAddress",
    streetAddress: `${a.street}, ${a.neighborhood}, ${a.locality}`,
    addressLocality: a.municipality,
    addressRegion: a.state,
    postalCode: a.postalCode,
    addressCountry: a.country,
  };
}
