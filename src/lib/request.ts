/**
 * Client IP extraction, shared by the rate-limited endpoints.
 *
 * `x-forwarded-for` is a chain: each proxy appends the address it received
 * the request from. Entries near the FRONT are client-supplied and trivially
 * spoofable — trusting those would let an attacker mint a fresh rate-limit
 * key per request. So we read from the BACK, which is what our own
 * infrastructure appended.
 *
 * The catch: the number of trusted hops depends on the platform, and getting
 * it wrong is silently catastrophic in the other direction. If the edge adds
 * an internal hop, the last entry is the same private address for everybody,
 * every visitor lands in one bucket, and a single spammer locks the contact
 * form for the whole country. Hence `skip private addresses from the back`
 * instead of a hard-coded hop count: internal addresses are never a real
 * client, so walking past them lands on the outermost public address the
 * infrastructure saw — correct whether there is one internal hop or three.
 */

/**
 * Bare address from one chain entry, dropping any port.
 * IPv6 with a port is bracketed (`[::1]:443`); IPv4 with a port has exactly
 * one colon (`1.2.3.4:443`). A bare IPv6 has several colons and no brackets,
 * so it must be left alone.
 */
function bareAddress(entry: string): string {
  if (entry.startsWith("[")) {
    const end = entry.indexOf("]");
    return end === -1 ? entry.slice(1) : entry.slice(1, end);
  }
  const firstColon = entry.indexOf(":");
  const isIpv4WithPort = firstColon !== -1 && entry.indexOf(":", firstColon + 1) === -1;
  return isIpv4WithPort ? entry.slice(0, firstColon) : entry;
}

/** RFC1918 / loopback / link-local / CGNAT / IPv6 unique-local and loopback. */
function isPrivateAddress(ip: string): boolean {
  const value = bareAddress(ip).toLowerCase();

  if (value === "::1" || value === "127.0.0.1" || value === "localhost") return true;
  // IPv6 unique-local (fc00::/7) and link-local (fe80::/10).
  if (/^f[cd]/.test(value) || value.startsWith("fe80:")) return true;

  const octets = value.split(".");
  if (octets.length !== 4) return false;
  const [a, b] = octets.map(Number);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;

  if (a === 10 || a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 100.64.0.0/10 — carrier-grade NAT, also never a distinct end client.
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

/**
 * True when a browser submitted this request from another site.
 *
 * Server actions get this check from Next itself; route handlers do not, and
 * `/api/applications` takes multipart — a "simple" request a third-party page
 * can POST cross-origin with no preflight to stop it.
 *
 * Absent `Origin` is treated as same-origin on purpose: non-browser clients
 * omit it, and this guard exists to stop a browser being used as someone's
 * proxy, not to enforce that callers be browsers.
 */
export function isCrossOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return false;

  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host !== host;
  } catch {
    // Unparseable Origin is not something a normal browser sends.
    return true;
  }
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";

  const chain = forwarded
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (let i = chain.length - 1; i >= 0; i--) {
    const candidate = chain[i];
    if (!isPrivateAddress(candidate)) return bareAddress(candidate);
  }

  // Every hop was internal — fall back to the last one rather than lumping
  // these requests in with header-less traffic.
  return chain[chain.length - 1] ?? "unknown";
}
