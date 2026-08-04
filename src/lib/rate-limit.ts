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

interface Bucket {
  /** Window size this bucket was created with — cleanup must honor it. */
  windowMs: number;
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/** Timestamps still inside the window, pruned of anything older. */
function liveTimestamps(key: string, windowMs: number, now: number): number[] {
  return (buckets.get(key)?.timestamps ?? []).filter((t) => t > now - windowMs);
}

/**
 * Read-only check. Use with `recordAttempt` when only *failures* should count
 * against the budget — a login throttle that also charges successful sign-ins
 * punishes the legitimate user for the attacker's traffic.
 */
export function isRateLimited(key: string, { limit, windowMs }: Options): boolean {
  const now = Date.now();
  const timestamps = liveTimestamps(key, windowMs, now);
  buckets.set(key, { windowMs, timestamps });
  return timestamps.length >= limit;
}

/** Charges one hit against the budget without checking it. */
export function recordAttempt(key: string, { windowMs }: Options): void {
  const now = Date.now();
  const timestamps = liveTimestamps(key, windowMs, now);
  timestamps.push(now);
  buckets.set(key, { windowMs, timestamps });
}

export function rateLimit(key: string, { limit, windowMs }: Options): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (buckets.get(key)?.timestamps ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    buckets.set(key, { windowMs, timestamps });
    return false;
  }

  timestamps.push(now);
  buckets.set(key, { windowMs, timestamps });

  // Opportunistic cleanup so the map never grows unbounded. Each bucket is
  // judged against its own window (endpoints use different window sizes).
  if (buckets.size > 1000) {
    for (const [k, bucket] of buckets) {
      if (bucket.timestamps.every((t) => t <= now - bucket.windowMs)) buckets.delete(k);
    }
  }

  return true;
}
