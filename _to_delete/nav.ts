/** Shared navigation structure for header, mobile menu and footer. */

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Concerts", href: "/services/concerts" },
      { label: "Coaching", href: "/services/coaching" },
      { label: "Workshops", href: "/services/workshops" },
    ],
  },
  {
    label: "Shows",
    href: "/shows",
    children: [
      { label: "Concerts", href: "/shows/concerts" },
      { label: "Upcoming Gigs", href: "/shows/gigs" },
      { label: "Live Videos", href: "/shows/live-videos" },
    ],
  },
  { label: "Music", href: "/music" },
  { label: "Media", href: "/media" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];
