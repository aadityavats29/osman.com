import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { upcomingPublished, pastPublished } from "@/lib/events";
import { JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { Reveal } from "@/components/motion/Reveal";

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

        <Reveal variant="text">
          <p className="eyebrow">Shows</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Upcoming gigs</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Free entry — informal nights in cafés, bars and small rooms. No tickets needed; just
            come along.
          </p>
        </Reveal>

        <div className="mt-14">
          {upcoming.length > 0 ? (
            <Reveal variant="card" delay={120}>
              <EventList events={upcoming} />
            </Reveal>
          ) : (
            <Reveal variant="text" delay={120}>
              <div className="border-t border-line pt-8">
                <p className="max-w-xl leading-relaxed text-ink-soft">
                  No free gigs are announced at the moment. New dates appear here first — and in
                  the meantime, there are{" "}
                  <Link href="/shows/live-videos" className="u-link">
                    live videos
                  </Link>{" "}
                  to watch and{" "}
                  <Link href="/music" className="u-link">
                    releases
                  </Link>{" "}
                  to listen to. Social links are in the footer.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-24">
            <Reveal variant="text">
              <h2 className="eyebrow">Past gigs</h2>
              <div className="mt-6">
                <EventList events={past} variant="archive" />
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  );
}
