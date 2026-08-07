import { company } from "@/content/company";
import { salaryPeriodLabels } from "@/lib/labels";
import type { Vacancy } from "@/db/schema";

/**
 * One vacancy, three audiences: the candidate reading /vacantes/[slug], the
 * JobPosting JSON-LD Google Jobs indexes, and the XML feed Indeed and the
 * Latin American boards pull from. Every derived value they share is built
 * here so a listing can never advertise a salary, a city or a closing date
 * that the page itself does not show.
 */

/** Everything is quoted in Mexican pesos; the plant hires in one country. */
export const SALARY_CURRENCY = "MXN";

/** How long a posting stays valid when RRHH captured no explicit close date. */
const DEFAULT_VALID_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Apaseo el Grande, Guanajuato" — the display form of city + region. */
export function vacancyLocation(vacancy: Vacancy): string {
  return [vacancy.city, vacancy.region].filter(Boolean).join(", ");
}

/** True when the vacancy sits at the company's own plant. */
export function vacancyIsAtHeadquarters(vacancy: Vacancy): boolean {
  return vacancy.city.trim().toLowerCase() === company.address.municipality.toLowerCase();
}

/**
 * Falls back to the plant's postal code only for vacancies actually at the
 * plant — sending Apaseo's 38160 along with a Celaya address would put the
 * job on the wrong map pin.
 */
export function vacancyPostalCode(vacancy: Vacancy): string {
  if (vacancy.postalCode) return vacancy.postalCode;
  return vacancyIsAtHeadquarters(vacancy) ? company.address.postalCode : "";
}

export function vacancyDatePosted(vacancy: Vacancy): Date {
  return vacancy.publishedAt ?? vacancy.createdAt;
}

/**
 * Boards drop a posting once this date passes, which is the point: a vacancy
 * nobody closed in the panel stops being advertised on its own instead of
 * collecting applications for a job that was filled months ago.
 */
export function vacancyValidThrough(vacancy: Vacancy): Date {
  return (
    vacancy.expiresAt ??
    new Date(vacancyDatePosted(vacancy).getTime() + DEFAULT_VALID_DAYS * DAY_MS)
  );
}

const pesos = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: SALARY_CURRENCY,
  maximumFractionDigits: 0,
});

/**
 * "$12,000 – $15,000 mensuales", or the free-text note when no amounts were
 * captured, or "" when the vacancy does not publish a salary at all.
 */
export function vacancySalaryLabel(vacancy: Vacancy): string {
  const { salaryMin, salaryMax } = vacancy;
  if (salaryMin === null && salaryMax === null) return vacancy.salaryRange ?? "";

  const amount =
    salaryMin !== null && salaryMax !== null && salaryMin !== salaryMax
      ? `${pesos.format(salaryMin)} – ${pesos.format(salaryMax)}`
      : pesos.format(salaryMin ?? salaryMax ?? 0);

  return `${amount} ${salaryPeriodLabels[vacancy.salaryPeriod]}`;
}

/**
 * Splits a description into paragraphs on blank lines.
 *
 * CRLF is normalised first: the admin panel is used from Windows, so the text
 * arrives with "\r\n" endings and a naive /\n{2,}/ never matches the blank
 * line between two paragraphs — the whole posting collapses into one block,
 * and the stray "\r" leaks into the feed's HTML.
 */
export function vacancyParagraphs(description: string): string[] {
  return description
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
}

function htmlList(heading: string, items: string[]): string {
  if (items.length === 0) return "";
  const entries = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<h3>${heading}</h3><ul>${entries}</ul>`;
}

/**
 * The whole posting as HTML — description, requirements and benefits together.
 *
 * The boards render this block and nothing else: whatever is missing here is
 * missing from the candidate's view on Indeed or Computrabajo, however
 * complete the page on our own site looks. Admin-authored text is escaped
 * before any markup is added, so a stray "<" in a description cannot break the
 * feed or inject markup into someone else's site.
 */
export function vacancyDescriptionHtml(vacancy: Vacancy): string {
  const paragraphs = vacancyParagraphs(vacancy.description)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");

  return [
    paragraphs,
    htmlList("Requisitos", vacancy.requirements),
    htmlList("Ofrecemos", vacancy.benefits),
  ].join("");
}
