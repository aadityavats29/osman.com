"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * A link that reports a click to analytics before navigating.
 * `external` renders a plain <a> with target="_blank" rel="noopener";
 * otherwise a Next <Link> is used for client-side navigation.
 * Extra props (data-cursor, aria-*) pass straight through to the element.
 */
export function TrackedLink({
  href,
  event,
  eventProps,
  external = false,
  className,
  children,
  ...rest
}: {
  href: string;
  event: string;
  eventProps?: Record<string, string>;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = () => trackEvent(event, eventProps);

  if (external) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target="_blank"
        rel="noopener"
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
