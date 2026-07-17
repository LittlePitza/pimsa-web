import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Route protection for the admin panel (Next.js 16 proxy).
 * Optimistic first gate (signature + expiry only — no DB access here);
 * getAdminSession re-validates against the database in the admin layout,
 * pages, server actions and API routes.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isApiRoute = pathname.startsWith("/api/");
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
