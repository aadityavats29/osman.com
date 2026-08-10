import Link from "next/link";
import { NAV_ITEMS } from "./nav";
import { MobileMenu } from "./MobileMenu";
import { HeaderScroll } from "./HeaderScroll";

/**
 * Minimal sticky header: wordmark left, navigation right.
 * Desktop dropdowns open on hover and on keyboard focus (focus-within).
 * Motion: nav underlines draw left→right; after leaving the top of the page
 * the bar compacts slightly and gains a translucent veil (see .site-header CSS).
 */
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-canvas">
      <HeaderScroll />
      <div className="header-inner mx-auto flex h-16 w-full max-w-(--container-site) items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight transition-opacity duration-200 hover:opacity-70"
        >
          Osman Meyredi
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="nav-link inline-block py-5 text-sm tracking-wide text-ink-soft hover:text-ink"
                  >
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 ease-(--ease-out-cubic) group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="w-44 border border-line bg-canvas py-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-sm text-ink-soft transition-all duration-200 hover:bg-canvas-soft hover:pl-5 hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link inline-block py-5 text-sm tracking-wide text-ink-soft hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
