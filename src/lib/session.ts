import type { AdminRole } from "@/lib/enums";
import { jwtVerify, SignJWT } from "jose";

/**
 * Signed admin session tokens (jose, HS256). Edge-safe: used by both the
 * proxy (route protection) and server actions (login/logout).
 *
 * The token carries a `pwv` claim (short hash of the password hash) so that
 * resetting a password or deleting an account invalidates its sessions — the
 * DB check lives in getAdminSession (Node); the proxy stays optimistic.
 *
 * The role deliberately stays OUT of the token: it is read fresh from the DB
 * on every request, so moving someone between areas takes effect immediately
 * instead of waiting out an 8-hour token.
 */

/** __Host- prefix binds the cookie to secure + path=/ (production only: dev runs on http). */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-pimsa_admin_session" : "pimsa_admin_session";
export const SESSION_HOURS = 8;

/** Who the token says you are — everything that is actually signed into it. */
export interface SessionIdentity {
  userId: number;
  email: string;
  name: string;
}

export interface AdminSession extends SessionIdentity {
  /** Panel area this account may enter. Always read fresh from the database. */
  role: AdminRole;
}

export interface VerifiedSession extends SessionIdentity {
  /** Password-version claim; compared against the stored hash on the server. */
  pwv?: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set (see .env.example)");
  }
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters long");
  }
  return new TextEncoder().encode(secret);
}

/** Short, stable fingerprint of the password hash (edge-safe Web Crypto). */
export async function passwordVersion(passwordHash: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(passwordHash));
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(
  session: SessionIdentity,
  passwordHash: string,
): Promise<string> {
  return new SignJWT({
    email: session.email,
    name: session.name,
    pwv: await passwordVersion(passwordHash),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<VerifiedSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      userId: Number(payload.sub),
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      pwv: typeof payload.pwv === "string" ? payload.pwv : undefined,
    };
  } catch {
    return null;
  }
}
