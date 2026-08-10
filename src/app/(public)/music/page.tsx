import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { JsonLd, musicAlbumJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { TrackedLink } from "@/components/public/TrackedLink";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music — All Releases",
  description:
    "Recordings featuring Osman Meyredi, including live albums with Ike Willis & Zappatika from their U.K. tours.",
  alternates: { canonical: "/music" },
};

const RELEASE_TYPE_LABELS = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
} as const;

export default async function MusicPage() {
  const releases = (await getRepos().releases.list())
    .filter((r) => r.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const hasStreaming = releases.some((r) => r.spotifyUrl || r.appleMusicUrl);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <p className="eyebrow">Music</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">All releases</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Recordings Osman played on — from tours, sessions and collaborations.
        </p>
        {!hasStreaming && releases.length > 0 && (
          <p className="mt-4 text-sm text-ink-faint">
            Streaming links are being added — for now, listen on Bandcamp.
          </p>
        )}

        <div className="mt-16">
          {releases.length > 0 ? (
            releases.map((release) => {
              const listenLinks: { label: string; href: string | null }[] = [
                { label: "Spotify", href: release.spotifyUrl },
                { label: "Apple Music", href: release.appleMusicUrl },
                { label: "Bandcamp", href: release.bandcampUrl },
                { label: "YouTube", href: release.youtubeUrl },
              ];
              const availableLinks = listenLinks.filter(
                (l): l is { label: string; href: string } => Boolean(l.href)
              );

              return (
                <article
                  key={release.id}
                  className="grid gap-8 border-t border-line py-14 md:grid-cols-[minmax(0,260px)_1fr] md:gap-12"
                >
                  <JsonLd data={musicAlbumJsonLd(release)} />
                  <PlaceholderImage label={`Album artwork — ${release.title}`} ratio="1/1" />
                  <div>
                    <h2 className="font-display text-3xl leading-tight">{release.title}</h2>
                    <p className="tabular mt-2 text-sm text-ink-faint">
                      {RELEASE_TYPE_LABELS[release.releaseType]}
                      {release.year ? ` · ${release.year}` : ""}
                    </p>
                    {release.description && (
                      <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
                        {release.description}
                      </p>
                    )}
                    {release.credits && (
                      <p className="mt-3 text-sm text-ink-faint">{release.credits}</p>
                    )}
                    {availableLinks.length > 0 && (
                      <ul className="mt-7 flex flex-wrap gap-3">
                        {availableLinks.map((l) => (
                          <li key={l.label}>
                            <TrackedLink
                              href={l.href}
                              external
                              event="listen_click"
                              eventProps={{ platform: l.label, release: release.slug }}
                              className="inline-block border border-ink px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-ink hover:text-canvas"
                            >
                              {l.label}
                            </TrackedLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })
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
