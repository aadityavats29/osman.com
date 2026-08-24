"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "./nav";

/**
 * Full-screen mobile navigation with a real opening sequence: the panel fades
 * in, items stagger upward, socials/utility follow; closing reverses cleanly.
 * The panel stays mounted (CSS transitions, not mount/unmount), so rapidly
 * tapping open/close simply reverses the animation — it can never get stuck.
 * Closed state is `inert` and invisible to the tab order. Escape closes.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  let itemIndex = 0;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-mr-2 flex h-11 w-11 items-center justify-center text-ink transition-transform duration-150 active:scale-90"
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <div
        id="mobile-menu"
        data-open={open}
        inert={!open}
        className="mobile-menu fixed inset-0 z-50 flex flex-col overflow-y-auto bg-canvas"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 sm:px-8">
          <Link href="/" onClick={close} className="font-display text-lg tracking-tight">
            Osman Meyredi
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-ink transition-transform duration-200 hover:rotate-90"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <nav className="px-5 py-8 sm:px-8" aria-label="Mobile">
          <ul>
            {NAV_ITEMS.map((item) => {
              const i = itemIndex++;
              return (
                <li
                  key={item.href}
                  className="menu-item border-b border-line"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <Link
                    href={item.href}
                    onClick={close}
                    className="font-display block py-4 text-2xl leading-tight"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="pb-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={close}
                            className="block py-2.5 pl-5 text-base text-ink-soft"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div
            className="menu-item mt-8 text-sm text-ink-soft"
            style={{ "--i": itemIndex } as React.CSSProperties}
          >
            <p className="eyebrow mb-3">Booking & inquiries</p>
            <Link href="/contact" onClick={close} className="u-link">
              Get in touch
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
