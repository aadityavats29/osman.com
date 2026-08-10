import Link from "next/link";
import { NAV_ITEMS } from "./nav";
import { MobileMenu } from "./MobileMenu";

/**
 * Minimal sticky header: wordmark left, navigation right.
 * Desktop dropdowns open on hover and on keyboard focus (focus-within),
 * so every sub-page is reachable by keyboard alone.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <div className="mx-auto flex h-16 w-full max-w-(--container-site) items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-lg tracking-tight">
          Osman Meyredi
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="inline-block py-5 text-sm tracking-wide text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="w-44 border border-line bg-canvas py-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-canvas-soft hover:text-ink"
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
                    className="inline-block py-5 text-sm tracking-wide text-ink-soft transition-colors hover:text-ink"
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
