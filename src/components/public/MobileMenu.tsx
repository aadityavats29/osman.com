"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "./nav";

/**
 * Full-screen mobile navigation. Large tap targets, grouped sub-navigation,
 * Escape closes, aria-expanded reflects state. Body scroll is locked while open.
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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-canvas"
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
              className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <nav className="px-5 py-8 sm:px-8" aria-label="Mobile">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="border-b border-line">
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
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
