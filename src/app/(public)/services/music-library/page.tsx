import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { LibraryPlayer, type PlayableTrack } from "@/components/public/LibraryPlayer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music Library — Original tracks, ready to license",
  description:
    "Every track in Osman Meyredi's library is composed, produced and performed by him personally — cleared for licensing across film, TV, series, adverts, online content and events, with bespoke composition on request.",
  alternates: { canonical: "/services/music-library" },
};

/**
 * Music Library — Keynote 02-09-2026, slides 14/21/22. The deck asked how
 * licensing music should be displayed; instead of the stock image it
 * tentatively suggested, the catalogue itself is the visual: playable rows
 * in the pattern of the referenced libraries, adapted to this site.
 * Tracks are managed in the Studio (answering "can we change the music
 * later and add more?" — yes, at any time).
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
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Music Library
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Film · TV · Documentary · Events · Online · Series · Adverts · Radio
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Every track in Osman&rsquo;s library is composed, produced and performed by him
              personally, ready to license, with all copyright matters already sorted.
            </p>
            {/* The red line */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              All tracks are fully cleared for licensing, with no copyright complications to
              resolve afterwards. Custom compositions are available on request if the library
              doesn&rsquo;t have what you need.
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
              What makes Osman&rsquo;s work distinctive is that he can take different styles,
              instruments and influences and make them sound as though they belong together.
              That range is exactly what fills his library: high-quality tracks in every genre
              and mood, suited to films, series, TV programmes, adverts, YouTube content, event
              openings, weddings and more.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              Because everything is composed and produced in his own studio, film and TV
              licences can be arranged directly with Osman — there are no middlemen involved.
              And if nothing in the library quite fits, he can create something bespoke: more
              classical, more jazzy, longer, shorter, or stripped back to just piano. A thorough
              first conversation about what you need is the best starting point.
            </p>
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              If you can&rsquo;t find the right track in the library, get in touch! There&rsquo;s
              a good chance it can still be made.
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
