import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { JsonLd, musicAlbumJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Discography } from "@/components/public/Discography";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music — All Releases",
  description:
    "Recordings featuring Osman Meyredi, including live albums with Ike Willis & Zappatika from their U.K. tours.",
  alternates: { canonical: "/music" },
};

export default async function MusicPage() {
  const releases = (await getRepos().releases.list())
    .filter((r) => r.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const hasStreaming = releases.some((r) => r.spotifyUrl || r.appleMusicUrl);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Music</p>
          <h1 className="display-caps mt-4 text-5xl sm:text-7xl">All releases</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Recordings Osman played on — from tours, sessions and collaborations.
          </p>
          {!hasStreaming && releases.length > 0 && (
            <p className="mt-4 text-sm text-ink-faint">
              Streaming links are being added — for now, listen on Bandcamp.
            </p>
          )}
        </Reveal>

        <div className="mt-16">
          {releases.length > 0 ? (
            <>
              {releases.map((release) => (
                <JsonLd key={release.id} data={musicAlbumJsonLd(release)} />
              ))}
              <Discography releases={releases} />
            </>
          ) : (
            <p className="border-t border-line pt-8 text-ink-soft">
              Releases are being added — check back soon.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
