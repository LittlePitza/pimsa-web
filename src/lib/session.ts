import { jwtVerify, SignJWT } from "jose";

/**
 * Signed admin session tokens (jose, HS256). Edge-safe: used by both the
 * proxy (route protection) and server actions (login/logout).
 */

export const SESSION_COOKIE = "pimsa_admin_session";
export const SESSION_HOURS = 8;

export interface AdminSession {
  userId: number;
  email: string;
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set (see .env.example)");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  return new SignJWT({ email: session.email, name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      userId: Number(payload.sub),
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
    };
  } catch {
    return null;
  }
}
