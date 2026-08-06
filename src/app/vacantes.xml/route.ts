import { getOpenVacancies } from "@/db/queries/vacancies";
import { jobFeedXml } from "@/lib/job-feed";

/** Job feed for the boards. The document itself is built in @/lib/job-feed. */

/**
 * Never statically prerendered.
 *
 * `next build` runs without DATABASE_URL, so a cached copy of this route would
 * be an empty feed — and an empty feed does not mean "no news" to a job board,
 * it means "every posting is closed". Serving it for even ten minutes after a
 * deploy would expire the whole board. The query is a handful of rows and the
 * crawlers hit it a few times a day; paying for it every request is nothing.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  // A DB failure is deliberately left to surface as a 500. Boards keep the
  // last feed they read when a fetch fails, but treat a successful fetch of an
  // empty feed as "everything closed".
  const vacancies = await getOpenVacancies();

  return new Response(jobFeedXml(vacancies), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
}
