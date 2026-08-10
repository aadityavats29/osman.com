"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * A link that reports a click to analytics before navigating.
 * `external` renders a plain <a> with target="_blank" rel="noopener";
 * otherwise a Next <Link> is used for client-side navigation.
 */
export function TrackedLink({
  href,
  event,
  eventProps,
  external = false,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  event: string;
  eventProps?: Record<string, string>;
  external?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const handleClick = () => trackEvent(event, eventProps);

  if (external) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target="_blank"
        rel="noopener"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
