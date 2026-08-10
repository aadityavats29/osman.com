import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { VideoEmbed } from "@/components/public/VideoEmbed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Videos",
  description:
    "Watch Osman Meyredi live — bass guitar, keyboards, double bass and guitar, from U.K. tours with Ike Willis & Zappatika to trio nights in Amsterdam.",
  alternates: { canonical: "/shows/live-videos" },
};

export default async function LiveVideosPage() {
  const videos = (await getRepos().videos.list())
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <p className="eyebrow">Shows</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Live videos</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          For the nights you couldn&rsquo;t make it. Nothing plays until you press play.
        </p>

        {videos.length > 0 ? (
          <ul className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
            {videos.map((video) => (
              <li key={video.id}>
                <VideoEmbed
                  title={video.title}
                  platform={video.platform}
                  videoUrl={video.videoUrl}
                  thumbnailUrl={video.thumbnailUrl}
                />
                <h2 className="font-display mt-4 text-xl leading-snug">{video.title}</h2>
                {(video.venue || video.year) && (
                  <p className="tabular mt-1 text-sm text-ink-faint">
                    {[video.venue, video.year ? String(video.year) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {video.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {video.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-14 border-t border-line pt-8 text-ink-soft">
            Live videos are on their way — check back soon.
          </p>
        )}
      </Container>
    </section>
  );
}
