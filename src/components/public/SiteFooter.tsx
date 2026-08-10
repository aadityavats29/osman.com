import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

const FOOTER_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Music", href: "/music" },
      { label: "Media", href: "/media" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Concerts", href: "/services/concerts" },
      { label: "Coaching", href: "/services/coaching" },
      { label: "Workshops", href: "/services/workshops" },
    ],
  },
  {
    heading: "Shows",
    links: [
      { label: "Concerts", href: "/shows/concerts" },
      { label: "Upcoming Gigs", href: "/shows/gigs" },
      { label: "Live Videos", href: "/shows/live-videos" },
    ],
  },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "YouTube", href: settings.youtubeUrl },
    { label: "TikTok", href: settings.tiktokUrl },
    { label: "Facebook", href: settings.facebookUrl },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-(--container-site) px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={`Footer — ${group.heading}`}>
              <h2 className="eyebrow">{group.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="eyebrow">Contact</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  Booking &amp; inquiries
                </Link>
              </li>
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Social profiles">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6">
          <p className="text-xs text-ink-faint">© Osman Meyredi</p>
        </div>
      </div>
    </footer>
  );
}
