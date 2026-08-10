import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { upcomingPublished, pastPublished } from "@/lib/events";
import { JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming Gigs — Free entry",
  description:
    "Free gigs with Osman Meyredi — informal nights in cafés, bars and small rooms. No tickets, just come along.",
  alternates: { canonical: "/shows/gigs" },
};

export default async function ShowsGigsPage() {
  const allEvents = await getRepos().events.list();
  const upcoming = upcomingPublished(allEvents).filter((e) => e.eventType === "FREE_GIG");
  const past = pastPublished(allEvents)
    .filter((e) => e.eventType === "FREE_GIG")
    .slice(0, 10);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        {upcoming.map((event) => (
          <JsonLd key={event.id} data={musicEventJsonLd(event)} />
        ))}

        <p className="eyebrow">Shows</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Upcoming gigs</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Free entry — informal nights in cafés, bars and small rooms. No tickets needed; just
          come along.
        </p>

        <div className="mt-14">
          {upcoming.length > 0 ? (
            <EventList events={upcoming} />
          ) : (
            <div className="border-t border-line pt-8">
              <p className="max-w-xl leading-relaxed text-ink-soft">
                No free gigs are announced at the moment. New dates appear here first — and in
                the meantime, there are{" "}
                <Link href="/shows/live-videos" className="underline underline-offset-4">
                  live videos
                </Link>{" "}
                to watch and{" "}
                <Link href="/music" className="underline underline-offset-4">
                  releases
                </Link>{" "}
                to listen to. Social links are in the footer.
              </p>
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-24">
            <h2 className="eyebrow">Past gigs</h2>
            <div className="mt-6">
              <EventList events={past} variant="archive" />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
