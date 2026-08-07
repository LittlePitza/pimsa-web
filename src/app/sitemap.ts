import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { getOpenVacancies } from "@/db/queries/vacancies";
import { absoluteUrl } from "@/lib/site";

/**
 * Regenerated hourly (and on demand via revalidatePath when a vacancy is
 * published), so new vacancies reach the sitemap without a redeploy.
 * lastModified is only set where a real date exists — a fake "now" on every
 * build teaches Google to ignore the field.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/stock"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/jobs"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Degrade partially on a DB outage: better a sitemap without vacancies
  // than a 500 that hides every URL from crawlers.
  const vacancies = await getOpenVacancies().catch((error) => {
    console.error("[sitemap] Vacancies unavailable, serving static routes only:", error);
    return [];
  });

  const vacancyRoutes: MetadataRoute.Sitemap = vacancies.map((vacancy) => ({
    url: absoluteUrl(`/jobs/${vacancy.slug}`),
    lastModified: vacancy.publishedAt ?? vacancy.createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...vacancyRoutes];
}
