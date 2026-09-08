import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import type { LiveVideoRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Videos",
  description:
    "Watch Osman Meyredi live — from U.K. tours with Ike Willis & Zappatika to trio nights in Amsterdam, plus piano performances for event bookers.",
  alternates: { canonical: "/shows/live-videos" },
};

function VideoCard({ video, delay }: { video: LiveVideoRecord; delay: number }) {
  return (
    <Reveal variant="card" delay={delay}>
      <VideoEmbed
        title={video.title}
        platform={video.platform}
        videoUrl={video.videoUrl}
        thumbnailUrl={video.thumbnailUrl}
      />
      <h3 className="font-display mt-4 text-xl leading-snug">{video.title}</h3>
      {(video.venue || video.year) && (
        <p className="tabular mt-1 text-sm text-ink-faint">
          {[video.venue, video.year ? String(video.year) : null].filter(Boolean).join(" · ")}
        </p>
      )}
      {video.description && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{video.description}</p>
      )}
    </Reveal>
  );
}

/**
 * Live videos — Keynote slide 18: revised heading copy, Zappatika ahead of
 * the showreel (ordering is data, see the seed/demo sortOrder), and a
 * dedicated piano rail (#piano) so visitors interested in Live Piano for
 * Events land directly on the right material. Videos are tagged "piano" in
 * the Studio to appear there.
 */
export default async function LiveVideosPage() {
  const videos = (await getRepos().videos.list())
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const pianoVideos = videos.filter((v) =>
    v.tags.some((t) => t.trim().toLowerCase() === "piano")
  );

  return (
    <>
      <ShowsSubnav current="/shows/live-videos" />
      <section className="py-20 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Live videos</h1>
            {/* Keynote slide 18 copy */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              For the nights you couldn&rsquo;t make it — or the ones you don&rsquo;t want to
              forget. Nothing plays until you press play.
            </p>
          </Reveal>

          {videos.length > 0 ? (
            <ul className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
              {videos.map((video, i) => (
                <li key={video.id}>
                  <VideoCard video={video} delay={i * 80} />
                </li>
              ))}
            </ul>
          ) : (
            <Reveal variant="text" delay={100}>
              <p className="mt-14 border-t border-line pt-8 text-ink-soft">
                Live videos are on their way — check back soon.
              </p>
            </Reveal>
          )}

          {/* Piano rail — the direct path for event bookers (Keynote slides
              12 + 18). scroll-mt keeps the anchor clear of the sticky header. */}
          <div id="piano" className="mt-24 scroll-mt-24 border-t border-line pt-10">
            <Reveal variant="text">
              <h2 className="font-display text-3xl">Piano, live</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
                Osman at the piano — for corporate events, receptions and special occasions.
              </p>
            </Reveal>
            {pianoVideos.length > 0 ? (
              <ul className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2">
                {pianoVideos.map((video, i) => (
                  <li key={`piano-${video.id}`}>
                    <VideoCard video={video} delay={i * 80} />
                  </li>
                ))}
              </ul>
            ) : (
              <Reveal variant="text" delay={100}>
                <p className="mt-8 max-w-xl leading-relaxed text-ink-soft">
                  The piano performance video is being filmed. Until it lands here, read about
                  the performance itself —{" "}
                  <Link href="/services/piano-for-events" className="u-link">
                    Live Piano for Events
                  </Link>
                  .
                </p>
              </Reveal>
            )}
            <p className="mt-10">
              <Link href="/services/piano-for-events" className="btn-pill" data-cursor="BOOK">
                Book piano for your event <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
