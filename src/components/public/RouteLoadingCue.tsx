"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Route-transition feedback — Round 2 Keynote slide 1 / brief §42.
 *
 * The client reported that choosing a menu page can take long enough that
 * visitors think their click did not register. This cue makes the site's own
 * vinyl motif answer immediately: while a navigation is in flight the header
 * record spins up and a hairline sweep runs under the header (both pure CSS,
 * gated by html[data-nav-loading] — no per-frame React state, nothing added
 * to the scroll path, removed the moment the new route renders).
 *
 * Detection is deliberately dumb and cheap: a capture-phase click listener
 * marks internal link navigations; the pathname change (or popstate, or an
 * 8s failsafe) clears the flag. No artificial delay is ever introduced.
 */
export function RouteLoadingCue() {
  const pathname = usePathname();

  // A navigation completed — clear the flag.
  useEffect(() => {
    document.documentElement.removeAttribute("data-nav-loading");
  }, [pathname]);

  useEffect(() => {
    let failsafe: number | undefined;

    const clear = () => {
      window.clearTimeout(failsafe);
      document.documentElement.removeAttribute("data-nav-loading");
    };

    const onClick = (e: MouseEvent) => {
      // Only plain left-clicks navigate in-app.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const [path] = href.split(/[?#]/);
      // Same-path clicks (hash jumps, re-clicks) resolve instantly — no cue.
      if (path === window.location.pathname) return;
      document.documentElement.setAttribute("data-nav-loading", "true");
      window.clearTimeout(failsafe);
      failsafe = window.setTimeout(clear, 8000);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", clear);
    window.addEventListener("pagehide", clear);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", clear);
      window.removeEventListener("pagehide", clear);
      clear();
    };
  }, []);

  return null;
}
