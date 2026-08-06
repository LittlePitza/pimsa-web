import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { SITE_URL } from "@/lib/site";

/**
 * Two jobs, in order: send every request to the canonical hostname, then
 * guard the admin panel.
 */

/**
 * Canonical host redirect.
 *
 * The site answers on `www.` and `beta.` as well as the apex — the same app
 * behind three doors — which splits ranking signals between them and lets a
 * job board hand candidates a URL on the wrong hostname.
 *
 * Deliberately narrow: only hostnames *under* the canonical domain are
 * redirected. localhost, direct IP access and the host's own health checks
 * never match, and a request already on the canonical host returns early, so
 * no request can bounce in a loop even if the deployment is reached through
 * something unexpected.
 */
function canonicalHostRedirect(request: NextRequest): NextResponse | null {
  const canonical = new URL(SITE_URL);
  const host = (request.headers.get("host") ?? request.nextUrl.host).toLowerCase();
  if (host === canonical.host) return null;

  // Compare without ports so a non-standard port never masks a match.
  const hostname = host.split(":")[0];
  if (!hostname.endsWith(`.${canonical.hostname}`)) return null;

  const url = request.nextUrl.clone();
  url.protocol = canonical.protocol;
  url.hostname = canonical.hostname;
  // Assigning `host` would KEEP the incoming port when the canonical URL has
  // none, sending production traffic to https://plasticospimsa.com:3000.
  // hostname + port are set separately so the port is genuinely cleared.
  url.port = canonical.port;
  // 308 rather than 307: this is permanent, and the method must survive so a
  // form posted to the wrong hostname is not silently turned into a GET.
  return NextResponse.redirect(url, 308);
}

/**
 * Route protection for the admin panel (Next.js 16 proxy).
 * Optimistic first gate (signature + expiry only — no DB access here);
 * getAdminSession re-validates against the database in the admin layout,
 * pages, server actions and API routes.
 */
export async function proxy(request: NextRequest) {
  const redirect = canonicalHostRedirect(request);
  if (redirect) return redirect;

  const { pathname } = request.nextUrl;

  // The matcher now spans the whole site for the host check above, so the
  // session is only read — and verified — on the paths that actually need it.
  const isApiRoute = pathname.startsWith("/api/admin");
  const isAdminRoute = pathname.startsWith("/admin");
  if (!isApiRoute && !isAdminRoute) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isLoginPage = pathname === "/admin/login";

  if (!session && isApiRoute) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!session && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /** Everything except Next's build output and static media. */
  matcher: ["/((?!_next/static|_next/image|media/|favicon\\.ico).*)"],
};
