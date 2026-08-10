import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { upcomingPublished } from "@/lib/events";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shows",
  description:
    "Where to hear Osman Meyredi live: upcoming ticketed concerts, free gigs and a gallery of live videos.",
  alternates: { canonical: "/shows" },
};

export default async function ShowsPage() {
  const events = upcomingPublished(await getRepos().events.list());
  const concerts = events.filter((e) => e.eventType === "TICKETED_CONCERT").slice(0, 3);
  const gigs = events.filter((e) => e.eventType === "FREE_GIG").slice(0, 3);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <p className="eyebrow">Shows</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
          Hear it live
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Ticketed concerts, free gigs around town, and live videos for the nights you
          can&rsquo;t make it.
        </p>

        {/* Concerts */}
        <div className="mt-20">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-display text-3xl">Concerts</h2>
            <Link
              href="/shows/concerts"
              className="text-sm underline underline-offset-4 hover:text-accent-strong"
            >
              All concerts
            </Link>
          </div>
          <div className="mt-8">
            {concerts.length > 0 ? (
              <EventList events={concerts} />
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                No ticketed concerts are on the calendar right now.
              </p>
            )}
          </div>
        </div>

        {/* Gigs */}
        <div className="mt-20">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-display text-3xl">Upcoming gigs</h2>
            <Link
              href="/shows/gigs"
              className="text-sm underline underline-offset-4 hover:text-accent-strong"
            >
              All gigs
            </Link>
          </div>
          <p className="mt-3 text-sm text-ink-soft">Free entry — just come along.</p>
          <div className="mt-8">
            {gigs.length > 0 ? (
              <EventList events={gigs} />
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                No free gigs are announced at the moment.
              </p>
            )}
          </div>
        </div>

        {/* Live videos */}
        <div className="mt-20 border-t border-line pt-10">
          <h2 className="font-display text-3xl">Live videos</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
            Recordings from tours, theatres and sessions — bass, keys, double bass and more.
          </p>
          <p className="mt-5">
            <Link
              href="/shows/live-videos"
              className="inline-block border border-ink px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-ink hover:text-canvas"
            >
              Watch live videos
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
