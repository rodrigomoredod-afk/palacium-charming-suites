type EventPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;
  if (import.meta.env.DEV) {
    console.debug('[analytics]', eventName, payload);
  }
  window.dispatchEvent(new CustomEvent('palacium:analytics', { detail: { eventName, payload } }));
}
