import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { HeaderScroll } from "./HeaderScroll";
import { FullscreenMenu } from "./FullscreenMenu";

/**
 * Minimal header: wordmark left, vinyl navigation trigger right — the record
 * is the menu (no inline nav row, no hamburger). All navigation lives in the
 * fullscreen menu. The bar keeps its scroll compaction + translucent veil,
 * and stays above the menu veil (z-70) so the vinyl remains the close control.
 */
export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="site-header sticky top-0 z-70 border-b border-line bg-canvas">
      <HeaderScroll />
      <div className="header-inner mx-auto flex h-16 w-full max-w-(--container-site) items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight transition-opacity duration-200 hover:opacity-70"
        >
          Osman Meyredi
        </Link>
        <FullscreenMenu settings={settings} />
      </div>
    </header>
  );
}
