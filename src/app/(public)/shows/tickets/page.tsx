import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { effectiveTicketing, upcomingPublished } from "@/lib/events";
import { JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tickets — Shows on sale",
  description:
    "Every Osman Meyredi show with tickets on sale right now, with direct links to the box office.",
  alternates: { canonical: "/shows/tickets" },
};

/**
 * Tickets — Keynote slide 15 adds a dedicated Tickets destination to the
 * Shows area: the one page that lists exactly what is on sale, with direct
 * box-office links. Free-entry nights live under Upcoming shows instead.
 */
export default async function TicketsPage() {
  const upcoming = upcomingPublished(await getRepos().events.list());
  const onSale = upcoming.filter(
    (e) => effectiveTicketing(e) === "TICKETED" && e.ticketUrl && e.eventState === "SCHEDULED"
  );

  return (
    <>
      <ShowsSubnav current="/shows/tickets" />
      <section className="py-20 sm:py-28">
        <Container wide>
          {onSale.map((event) => (
            <JsonLd key={event.id} data={musicEventJsonLd(event)} />
          ))}

          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Tickets</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Everything on sale right now, with direct links to the box office.
            </p>
          </Reveal>

          <div className="mt-14">
            {onSale.length > 0 ? (
              <Reveal variant="card" delay={120}>
                <EventList events={onSale} />
              </Reveal>
            ) : (
              <Reveal variant="text" delay={120}>
                <div className="border-t border-line pt-8">
                  <p className="max-w-xl leading-relaxed text-ink-soft">
                    Nothing is on sale at this moment — tickets appear here the day a show is
                    confirmed. In the meantime, there are{" "}
                    <Link href="/shows/gigs" className="u-link">
                      shows with free entry
                    </Link>
                    ,{" "}
                    <Link href="/shows/live-videos" className="u-link">
                      live videos
                    </Link>{" "}
                    to watch, and announcements on Osman&rsquo;s social channels — links are in
                    the footer.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
