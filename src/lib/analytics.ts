/**
 * Tiny, dependency-free analytics abstraction.
 *
 * Server-side this is a no-op. In the browser it forwards to Plausible when the
 * script is present (`window.plausible`), and logs to the console in development
 * so events are visible before any provider is wired up. Swapping providers means
 * changing this one function.
 */

declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(name: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible === "function") {
    window.plausible(name, props ? { props } : undefined);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${name}`, props ?? {});
  }
}
