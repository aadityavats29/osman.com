import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { LibraryPlayer, type PlayableTrack } from "@/components/public/LibraryPlayer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Original Tracks & Music Library — Ready to license, or made just for you",
  description:
    "Every track in Osman Meyredi's library is composed, produced and performed by him personally, ready to license, with all copyright matters already sorted — and custom tracks on request.",
  alternates: { canonical: "/services/music-library" },
};

/**
 * Original Tracks & Music Library — Round 2 Keynote slides 10/17/31: the
 * service's final name, with all content replaced by "Original Tracks &
 * Music Library.pages" (Website/05. Services/Original Tracks & Music
 * Library) verbatim. The route keeps its existing URL so nothing breaks;
 * only the public naming changes. One source typo ("good change") is
 * corrected to "chance" — flagged in the report.
 */
export default async function MusicLibraryPage() {
  const tracks = (await getRepos().libraryTracks.list())
    .filter((t) => t.status === "PUBLISHED")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);

  const playable: PlayableTrack[] = tracks.map((t) => ({
    slug: t.slug,
    title: t.title,
    genre: t.genre,
    moods: t.moods,
    useCases: t.useCases,
    durationSec: t.durationSec,
    audioUrl: t.audioUrl,
    featured: t.featured,
  }));

  return (
    <article>
      <ServicesSubnav current="/services/music-library" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Original Tracks &amp; Music Library
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Film · TV · Documentary · Events · Online · Series · Adverts · Radio
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Every track in Osman&rsquo;s library is composed, produced and performed by him
              personally, ready to license, with all copyright matters already sorted.
            </p>
            {/* The red line — the document's marked text. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              Know exactly what you need? Get in touch and there&rsquo;s a good chance it can
              be made. The library itself is still being stocked, the first tracks land here
              shortly.
            </p>
          </Reveal>
        </Container>

        {/* The catalogue */}
        <Container wide className="mt-14">
          <Reveal variant="card" delay={80}>
            {playable.length > 0 ? (
              <LibraryPlayer tracks={playable} />
            ) : (
              <p className="border-t border-line pt-8 text-ink-soft">
                The library is being stocked — the first tracks land here shortly. If you
                already know what you need,{" "}
                <TrackedLink
                  href="/contact?type=ORIGINAL_TRACKS"
                  event="service_inquiry_click"
                  eventProps={{ service: "music-library", position: "empty" }}
                  className="u-link"
                >
                  get in touch
                </TrackedLink>{" "}
                and there&rsquo;s a good chance it can be made.
              </p>
            )}
          </Reveal>
        </Container>

        <Container className="mt-16">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              What makes Osman Meyredi&rsquo;s work distinctive is that he can take different
              styles, instruments and influences and make them sound as though they belong
              together. That&rsquo;s exactly why writing something new is where the real work
              happens, especially for films, series and TV, where music isn&rsquo;t decoration,
              it&rsquo;s part of how a story is told. It needs to carry a feeling the pictures
              alone can&rsquo;t, land in exactly the right moment, and come from a proper
              briefing rather than a search filter. More classical, more jazzy, cinematic,
              stripped back to just piano, whatever the scene calls for, that&rsquo;s where a
              first conversation about the vision starts, and from there, the track takes shape
              around it.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              Prefer something ready to go right now? His library is filled with high-quality
              tracks across every genre and mood, suited to adverts, YouTube content, event
              openings, weddings and more. And because everything is composed and produced in
              his own studio, licences can be arranged directly with him, no middlemen
              involved.
            </p>
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              If you can&rsquo;t find the right track in the library, get in touch!
              There&rsquo;s a good chance it can still be made.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=ORIGINAL_TRACKS"
              event="service_inquiry_click"
              eventProps={{ service: "music-library", position: "footer" }}
              className="btn-pill"
              data-cursor="WORK"
            >
              Work with Osman <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
            <p className="mt-4 text-sm text-ink-soft">
              No forms required if you prefer email — details are on the contact page.
            </p>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
