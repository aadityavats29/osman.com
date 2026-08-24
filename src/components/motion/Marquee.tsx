"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * CSS marquee — pauses on hover/focus, static under prefers-reduced-motion,
 * and (via IntersectionObserver) stops animating entirely while off-screen so
 * it never costs compositor time the visitor can't see. Renders content
 * immediately (SSR-safe); the observer only toggles animation-play-state.
 */
export function Marquee({
  children,
  duration = 48,
  className = "",
  label,
}: {
  children: ReactNode;
  /** seconds for one full loop — slower reads calmer */
  duration?: number;
  className?: string;
  /** accessible name for the strip, e.g. "Instruments Osman plays" */
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.animPaused = entry.isIntersecting ? "false" : "true";
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`marquee ${className}`}
      role="marquee"
      aria-label={label}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
