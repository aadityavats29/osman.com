"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pauses the continuous CSS animations of its subtree (.vinyl-spin,
 * .marquee-track — see the [data-anim-paused] rules in globals.css) while the
 * wrapper is outside the viewport. Content renders normally; only
 * animation-play-state is toggled — zero cost while visible, zero animation
 * while not.
 */
export function PauseWhenHidden({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.animPaused = entry.isIntersecting ? "false" : "true";
      },
      { rootMargin: "15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
