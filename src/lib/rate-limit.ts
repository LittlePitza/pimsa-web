/**
 * In-memory sliding-window rate limiter.
 * Suitable for the single-instance Node.js deployment on Hostinger;
 * swap for a Redis-backed limiter if the app ever scales horizontally.
 */

interface Options {
  /** Max requests allowed per window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, { limit, windowMs }: Options): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (buckets.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);

  // Opportunistic cleanup so the map never grows unbounded.
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= windowStart)) buckets.delete(k);
    }
  }

  return true;
}
