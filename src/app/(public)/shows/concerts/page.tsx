import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { upcomingPublished, pastPublished } from "@/lib/events";
import { JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Concerts — Upcoming ticketed shows",
  description:
    "Upcoming ticketed concerts with Osman Meyredi — dates, venues and tickets for shows in the Netherlands, Italy and across Europe.",
  alternates: { canonical: "/shows/concerts" },
};

export default async function ShowsConcertsPage() {
  const allEvents = await getRepos().events.list();
  const upcoming = upcomingPublished(allEvents).filter(
    (e) => e.eventType === "TICKETED_CONCERT"
  );
  const past = pastPublished(allEvents)
    .filter((e) => e.eventType === "TICKETED_CONCERT")
    .slice(0, 10);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        {upcoming.map((event) => (
          <JsonLd key={event.id} data={musicEventJsonLd(event)} />
        ))}

        <p className="eyebrow">Shows</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Concerts</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Ticketed shows — get your seat in advance.
        </p>

        <div className="mt-14">
          {upcoming.length > 0 ? (
            <EventList events={upcoming} />
          ) : (
            <div className="border-t border-line pt-8">
              <p className="max-w-xl leading-relaxed text-ink-soft">
                No ticketed concerts are on the calendar right now. New dates appear here as
                soon as they are confirmed — in the meantime, there are{" "}
                <Link href="/shows/live-videos" className="underline underline-offset-4">
                  live videos
                </Link>{" "}
                to watch,{" "}
                <Link href="/music" className="underline underline-offset-4">
                  releases
                </Link>{" "}
                to hear, and announcements land on Osman&rsquo;s social channels first — links
                are in the footer.
              </p>
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-24">
            <h2 className="eyebrow">Past concerts</h2>
            <div className="mt-6">
              <EventList events={past} variant="archive" />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
