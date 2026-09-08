/**
 * The four ways to work with Osman — Keynote 02-09-2026, slides 7, 8, 12, 13, 14.
 *
 * This copy is client-approved production content; the service pages are
 * bespoke, code-authored layouts built around it (the earlier generic
 * DB-driven service pages could not express the options/statement/read-more
 * structures the deck specifies). Keep wording in sync with the fullscreen
 * menu and the footer.
 */
export type ServiceCard = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  intro: string;
  cta: string;
};

export const SERVICES: ServiceCard[] = [
  {
    slug: "concerts",
    href: "/services/concerts",
    title: "Concerts & Live Performances",
    subtitle: "Festivals · Venues · Events · Performances",
    intro:
      "BOOK OSMAN LIVE. One artist. Many instruments. A show built around the moment. Looking for a live performance for your festival, venue, corporate event or special occasion?",
    cta: "Read more",
  },
  {
    slug: "piano-for-events",
    href: "/services/piano-for-events",
    title: "Piano for Events",
    subtitle: "Corporate · Receptions · Special Events",
    intro:
      "Osman creates live music for corporate and private occasions, such as company celebrations, brand launches, conferences, receptions and other moments where the music needs to support the atmosphere while still creating something memorable.",
    cta: "Read more",
  },
  {
    slug: "music-production",
    href: "/services/music-production",
    title: "Music Production",
    subtitle: "Production · Arrangement · Instrumentation · Recording · Mixing · Mastering",
    intro:
      "Whether you have a rough idea, a demo that isn't quite there yet, or a nearly finished song that needs the final production, mixing or mastering, Osman can step in at the point where you need him.",
    cta: "Read more",
  },
  {
    slug: "music-library",
    href: "/services/music-library",
    title: "Music Library",
    subtitle: "Film · TV · Documentary · Events · Online · Series · Adverts · Radio",
    intro: "Original tracks, ready to license.",
    cta: "Go to Library",
  },
];
