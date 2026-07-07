/**
 * First-touch UTM persistence for lead source tracking (PLAN.md §7).
 * Params are captured on landing and attached to contact form submissions.
 */

const STORAGE_KEY = "pimsa-utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

export type UtmParams = Record<string, string>;

export function captureUtmParams(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return; // keep first touch

    const params = new URLSearchParams(window.location.search);
    const utm: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 200);
    }
    if (Object.keys(utm).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // Storage unavailable (private mode) — tracking is best-effort.
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
