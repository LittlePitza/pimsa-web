/**
 * Client IP extraction, shared by the rate-limited endpoints.
 *
 * Behind the reverse proxy the LAST x-forwarded-for entry is the one the
 * proxy itself appended (trustworthy); earlier entries are client-supplied
 * and spoofable, so using the first would let an attacker rotate rate-limit
 * keys at will.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  const parts = forwarded.split(",");
  return parts[parts.length - 1]?.trim() || "unknown";
}
