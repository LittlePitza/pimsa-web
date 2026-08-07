import { certifications, company } from "@/content/company";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import {
  SALARY_CURRENCY,
  vacancyDatePosted,
  vacancyDescriptionHtml,
  vacancyIsAtHeadquarters,
  vacancyPostalCode,
  vacancyValidThrough,
} from "@/lib/vacancy";
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
    image: [absoluteUrl("/media/corporate/fachada-planta.jpg")],
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
    url: absoluteUrl(`/services/${service.slug}`),
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
      url: absoluteUrl(`/services/${service.slug}`),
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

/**
 * baseSalary, only when real amounts exist.
 *
 * A free-text note like "sueldo a tratar" is deliberately NOT emitted: Google
 * discards a MonetaryAmount it cannot read as a number, and a wrong one is
 * worse than none — the posting gets filtered out of every salary-bounded
 * search a candidate runs.
 */
function baseSalaryNode(vacancy: Vacancy): JsonLdObject | undefined {
  const { salaryMin, salaryMax } = vacancy;
  if (salaryMin === null && salaryMax === null) return undefined;

  const spread = salaryMin !== null && salaryMax !== null && salaryMin !== salaryMax;
  return {
    "@type": "MonetaryAmount",
    currency: SALARY_CURRENCY,
    value: {
      "@type": "QuantitativeValue",
      ...(spread
        ? { minValue: salaryMin, maxValue: salaryMax }
        : { value: salaryMin ?? salaryMax }),
      unitText: vacancy.salaryPeriod,
    },
  };
}

/** Where the job physically is — the plant's street only when it IS the plant. */
function vacancyAddress(vacancy: Vacancy): JsonLdObject {
  const a = company.address;
  const postalCode = vacancyPostalCode(vacancy);
  return {
    "@type": "PostalAddress",
    streetAddress: vacancyIsAtHeadquarters(vacancy)
      ? `${a.street}, ${a.neighborhood}, ${a.locality}`
      : undefined,
    addressLocality: vacancy.city,
    addressRegion: vacancy.region,
    postalCode: postalCode || undefined,
    addressCountry: a.country,
  };
}

/**
 * Google Jobs eligibility for vacancy pages (JobPosting structured data).
 *
 * `directApply: true` is a claim Google checks: the URL must land on a form
 * the candidate can actually submit, which /jobs/[slug] does. It is also
 * what keeps the application in our own panel instead of a board's inbox.
 */
export function jobPostingSchema(vacancy: Vacancy): JsonLdObject {
  const remote = vacancy.workMode === "remote";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancyDescriptionHtml(vacancy),
    identifier: {
      "@type": "PropertyValue",
      name: company.name,
      value: String(vacancy.id),
    },
    datePosted: vacancyDatePosted(vacancy).toISOString(),
    validThrough: vacancyValidThrough(vacancy).toISOString(),
    employmentType: vacancy.employmentType,
    // sameAs repeats the site URL by design here: inside a JobPosting, Google
    // reads it as the employer's own website rather than as a social profile.
    hiringOrganization: { ...organizationNode(), sameAs: SITE_URL },
    jobLocation: { "@type": "Place", address: vacancyAddress(vacancy) },
    // A remote posting still declares a jobLocation (the hiring site) plus the
    // country a candidate may live in; dropping the location instead makes
    // Google treat the listing as incomplete.
    jobLocationType: remote ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: remote ? { "@type": "Country", name: "México" } : undefined,
    baseSalary: baseSalaryNode(vacancy),
    occupationalCategory: vacancy.department || undefined,
    totalJobOpenings: vacancy.openings,
    directApply: true,
    url: absoluteUrl(`/jobs/${vacancy.slug}`),
  };
}

/**
 * AboutPage node for /about.
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
    "@id": `${SITE_URL}/about#aboutpage`,
    url: absoluteUrl("/about"),
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
