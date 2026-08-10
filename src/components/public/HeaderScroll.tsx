"use client";

import { useEffect } from "react";

/** Toggles data-scrolled on the site header once the visitor leaves the top. */
export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
