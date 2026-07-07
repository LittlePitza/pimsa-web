import { company, fullAddress } from "@/content/company";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import type { Vacancy } from "@/db/schema";
import type { Faq, Service } from "@/types/content";

/**
 * schema.org JSON-LD builders (PLAN.md §6).
 * Rendered through <JsonLd /> so structured data ships as static HTML.
 */

type JsonLdObject = Record<string, unknown>;

const organizationId = `${SITE_URL}/#organization`;

export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
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
    parentOrganization: { "@id": organizationId },
  };
}

export function serviceSchema(service: Service): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: absoluteUrl(`/servicios/${service.slug}`),
    serviceType: service.name,
    areaServed: { "@type": "Country", name: "México" },
    provider: { "@id": organizationId },
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

/** Google Jobs eligibility for vacancy pages (JobPosting structured data). */
export function jobPostingSchema(vacancy: Vacancy): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancy.description.replace(/\n/g, "<br>"),
    datePosted: (vacancy.publishedAt ?? vacancy.createdAt).toISOString(),
    employmentType: vacancy.employmentType === "Tiempo completo" ? "FULL_TIME" : "OTHER",
    hiringOrganization: { "@id": organizationId },
    jobLocation: {
      "@type": "Place",
      address: postalAddress(),
    },
    directApply: true,
    url: absoluteUrl(`/vacantes/${vacancy.slug}`),
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

export { fullAddress };
