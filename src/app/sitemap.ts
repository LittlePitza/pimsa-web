import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { getOpenVacancies } from "@/db/queries/vacancies";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicios"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/stock"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/vacantes"), lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/nosotros"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contacto"), lastModified, changeFrequency: "yearly", priority: 0.8 },
    {
      url: absoluteUrl("/preguntas-frecuentes"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/servicios/${service.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Resilient: getOpenVacancies returns [] when the DB is unreachable.
  const vacancyRoutes: MetadataRoute.Sitemap = (await getOpenVacancies()).map((vacancy) => ({
    url: absoluteUrl(`/vacantes/${vacancy.slug}`),
    lastModified: vacancy.publishedAt ?? lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...vacancyRoutes];
}
