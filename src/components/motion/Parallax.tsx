"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Restrained scroll parallax. Translates its child a few dozen pixels as the
 * element crosses the viewport — transform-only, rAF-throttled, passive
 * listeners. Automatically inert for reduced-motion users, touch-first
 * viewports (<768px), and whenever JS is unavailable (renders static markup).
 */
export function Parallax({
  speed = 0.12,
  className = "",
  children,
}: {
  /** 0.05–0.2: fraction of scroll delta applied. Positive drifts up-slower. */
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const target = inner.current;
    if (!el || !target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    if (reduced.matches || small.matches) return;

    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - elementCenter) * speed;
      // Clamp so layout never visibly breaks
      const clamped = Math.max(-64, Math.min(64, offset));
      target.style.transform = `translate3d(0, ${clamped.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!visible || raf) return;
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "20% 0px" }
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      target.style.transform = "";
    };
  }, [speed]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
