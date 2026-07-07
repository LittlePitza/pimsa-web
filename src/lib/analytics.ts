/** Client-side analytics helpers (GTM dataLayer). */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

export type ConsentValue = "granted" | "denied";

const CONSENT_KEY = "pimsa-consent";
export const CONSENT_EVENT = "pimsa:consent";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setConsent(value: ConsentValue): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Subscribe to consent changes (for useSyncExternalStore). */
export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

/** Push a custom event to GTM's dataLayer (no-op when GTM is not loaded). */
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...params });
}
