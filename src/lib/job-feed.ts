import { company } from "@/content/company";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import {
  vacancyDatePosted,
  vacancyDescriptionHtml,
  vacancyPostalCode,
  vacancySalaryLabel,
  vacancyValidThrough,
} from "@/lib/vacancy";
import type { EmploymentType, WorkMode } from "@/lib/enums";
import type { Vacancy } from "@/db/schema";

/**
 * The XML behind /jobs.xml — one URL to hand to every job board.
 *
 * The format is Indeed's `<source>/<job>` feed, which is the de-facto standard
 * the Latin American boards (Computrabajo, OCC, Bumeran) and the aggregators
 * (Talent.com, Jooble) also accept, so this single document covers all of
 * them. Each board still has to be asked to subscribe to the URL — that part
 * is a phone call, not code.
 *
 * `<url>` points at our own vacancy page on purpose: the candidate lands on
 * the form in this site and the application arrives in /admin/applications,
 * instead of being captured inside a board's own inbox.
 *
 * Kept out of the route handler so it can be exercised without a database.
 */

/** Indeed's `<jobtype>` vocabulary, keyed by our schema.org values. */
const FEED_JOB_TYPES: Record<EmploymentType, string> = {
  FULL_TIME: "fulltime",
  PART_TIME: "parttime",
  CONTRACTOR: "contract",
  TEMPORARY: "temporary",
  INTERN: "internship",
};

/** Left empty for on-site work, which is what a board assumes by default. */
const FEED_REMOTE_TYPES: Record<WorkMode, string> = {
  onsite: "",
  hybrid: "Hybrid remote",
  remote: "Fully remote",
};

/**
 * Wraps a value in CDATA. A literal "]]>" inside the payload would close the
 * section early and corrupt the rest of the document, so it is split across
 * two sections — the standard escape, since CDATA has no character escapes.
 */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** Skips empty values entirely: boards treat a blank tag as a bad record. */
function tag(name: string, value: string | number | null | undefined, indent = "  "): string {
  if (value === null || value === undefined || value === "") return "";
  return `${indent}<${name}>${cdata(String(value))}</${name}>\n`;
}

function jobEntry(vacancy: Vacancy): string {
  const field = (name: string, value: string | number | null | undefined) =>
    tag(name, value, "    ");

  return (
    "  <job>\n" +
    field("referencenumber", vacancy.id) +
    field("title", vacancy.title) +
    field("date", vacancyDatePosted(vacancy).toUTCString()) +
    field("expirationdate", vacancyValidThrough(vacancy).toUTCString()) +
    field("url", absoluteUrl(`/jobs/${vacancy.slug}`)) +
    field("company", company.name) +
    field("sourcename", company.name) +
    field("city", vacancy.city) +
    field("state", vacancy.region) +
    field("country", company.address.country) +
    field("postalcode", vacancyPostalCode(vacancy)) +
    field("category", vacancy.department) +
    field("jobtype", FEED_JOB_TYPES[vacancy.employmentType]) +
    field("remotetype", FEED_REMOTE_TYPES[vacancy.workMode]) +
    field("salary", vacancySalaryLabel(vacancy)) +
    field("openings", vacancy.openings) +
    field("description", vacancyDescriptionHtml(vacancy)) +
    "  </job>\n"
  );
}

export function jobFeedXml(vacancies: Vacancy[], builtAt = new Date()): string {
  return (
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    "<source>\n" +
    tag("publisher", company.name) +
    tag("publisherurl", SITE_URL) +
    tag("lastBuildDate", builtAt.toUTCString()) +
    vacancies.map(jobEntry).join("") +
    "</source>\n"
  );
}
