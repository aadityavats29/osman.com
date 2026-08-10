import type { ReactNode } from "react";

/**
 * CSS-only marquee — no JS, pauses on hover/focus, static under
 * prefers-reduced-motion (first copy remains readable; duplicates are
 * aria-hidden). Use sparingly: it should feel like part of the composition.
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
  return (
    <div
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
