import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { effectiveTicketing, upcomingPublished } from "@/lib/events";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shows",
  description:
    "Where to hear Osman Meyredi live: concerts, upcoming shows with free entry, tickets on sale and a gallery of live videos.",
  alternates: { canonical: "/shows" },
};

/**
 * Shows overview — Keynote slides 15–17: Concerts · Upcoming Shows · Tickets ·
 * Live Videos, with the local Shows sub-nav so nobody has to route back
 * through the fullscreen menu.
 */
export default async function ShowsPage() {
  const events = upcomingPublished(await getRepos().events.list());
  const concerts = events.filter((e) => effectiveTicketing(e) === "TICKETED").slice(0, 3);
  const gigs = events.filter((e) => effectiveTicketing(e) !== "TICKETED").slice(0, 3);
  const onSale = events.filter(
    (e) => effectiveTicketing(e) === "TICKETED" && e.ticketUrl && e.eventState === "SCHEDULED"
  );

  return (
    <>
      <ShowsSubnav current="/shows" />
      <section className="py-20 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Hear it live
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Concerts, upcoming shows with free entry, tickets on sale, and live videos for
              the nights you can&rsquo;t make it.
            </p>
          </Reveal>

          {/* Concerts */}
          <div className="mt-20">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Concerts</h2>
                <Link
                  href="/shows/concerts"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  All concerts
                </Link>
              </div>
            </Reveal>
            <div className="mt-8">
              {concerts.length > 0 ? (
                <Reveal variant="card" delay={120}>
                  <EventList events={concerts} />
                </Reveal>
              ) : (
                <Reveal variant="text" delay={120}>
                  <p className="border-t border-line pt-6 text-ink-soft">
                    New dates appear here as soon as they are confirmed.
                  </p>
                </Reveal>
              )}
            </div>
          </div>

          {/* Upcoming shows (free entry) */}
          <div className="mt-20">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Upcoming gigs</h2>
                <Link
                  href="/shows/gigs"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  All gigs
                </Link>
              </div>
              {/* Keynote slide 17 wording */}
              <p className="mt-3 text-sm text-ink-soft">
                No concert ticket required · Venue conditions may apply
              </p>
            </Reveal>
            <div className="mt-8">
              {gigs.length > 0 ? (
                <Reveal variant="card" delay={120}>
                  <EventList events={gigs} />
                </Reveal>
              ) : (
                <Reveal variant="text" delay={120}>
                  <p className="border-t border-line pt-6 text-ink-soft">
                    No shows are announced at the moment — new dates land here first.
                  </p>
                </Reveal>
              )}
            </div>
          </div>

          {/* Tickets */}
          <div className="mt-20">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Tickets</h2>
                <Link
                  href="/shows/tickets"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  All tickets
                </Link>
              </div>
            </Reveal>
            <div className="mt-8">
              {onSale.length > 0 ? (
                <Reveal variant="card" delay={120}>
                  <EventList events={onSale} />
                </Reveal>
              ) : (
                <Reveal variant="text" delay={120}>
                  <p className="border-t border-line pt-6 text-ink-soft">
                    Nothing is on sale right now. The moment a ticketed date is confirmed, the
                    link appears here and on{" "}
                    <Link href="/shows/tickets" className="u-link">
                      the tickets page
                    </Link>
                    .
                  </p>
                </Reveal>
              )}
            </div>
          </div>

          {/* Live videos */}
          <div className="mt-20 border-t border-line pt-10">
            <Reveal variant="text">
              <h2 className="font-display text-3xl">Live videos</h2>
              {/* Keynote slide 17: "Remove — bass…and more", "sessions" → "more" */}
              <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
                Recordings from tours, theatres and more.
              </p>
              <p className="mt-5">
                <Link href="/shows/live-videos" className="btn-pill">
                  Watch live videos
                </Link>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
