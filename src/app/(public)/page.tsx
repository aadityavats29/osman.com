import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { upcomingPublished } from "@/lib/events";
import { JsonLd, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { EventList } from "@/components/public/EventList";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { TrackedLink } from "@/components/public/TrackedLink";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Osman Meyredi — Multi-instrumentalist, bassist & composer" },
  description:
    "Osman Meyredi is an Amsterdam-based multi-instrumentalist, bassist and composer. Concerts, band coaching and listening workshops across the Netherlands, Italy and Europe.",
  alternates: { canonical: "/" },
};

const RELEASE_TYPE_LABELS = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
} as const;

export default async function HomePage() {
  const repos = getRepos();
  const [settings, allEvents, allReleases, allServices, allVideos, allMedia] = await Promise.all([
    repos.settings.get(),
    repos.events.list(),
    repos.releases.list(),
    repos.services.list(),
    repos.videos.list(),
    repos.media.list(),
  ]);

  const nextDates = upcomingPublished(allEvents).slice(0, 5);
  const releases = allReleases
    .filter((r) => r.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredRelease = releases.find((r) => r.featured) ?? releases[0] ?? null;
  const services = allServices
    .filter((s) => s.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const videos = allVideos
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredVideo = videos.find((v) => v.featured) ?? videos[0] ?? null;
  const mediaItems = allMedia.filter((m) => m.status === "PUBLISHED");
  const featuredMedia = mediaItems.find((m) => m.featured) ?? mediaItems[0] ?? null;

  const socialUrls = [
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
    settings.facebookUrl,
  ].filter((u): u is string => Boolean(u));

  const rawListenLinks: { label: string; href: string | null }[] = featuredRelease
    ? [
        { label: "Spotify", href: featuredRelease.spotifyUrl },
        { label: "Apple Music", href: featuredRelease.appleMusicUrl },
        { label: "Bandcamp", href: featuredRelease.bandcampUrl },
        { label: "YouTube", href: featuredRelease.youtubeUrl },
      ]
    : [];
  const listenLinks = rawListenLinks.filter(
    (l): l is { label: string; href: string } => Boolean(l.href)
  );

  const shopTeaser =
    settings.shopMode === "concept"
      ? "A small shop is taking shape — objects built around listening, still in development."
      : settings.shopMode === "external"
        ? "The shop is open — records and objects from Osman's world."
        : "The shop is open.";

  return (
    <>
      <JsonLd data={personJsonLd(socialUrls)} />

      {/* Announcement */}
      {settings.announcement && (
        <div className="border-b border-line bg-canvas-soft">
          <Container wide>
            <p className="py-3 text-center text-sm text-ink-soft">{settings.announcement}</p>
          </Container>
        </div>
      )}

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <Container wide>
          <div className="reveal max-w-3xl">
            <p className="eyebrow">Amsterdam — Netherlands · Italy · Europe</p>
            <h1 className="font-display mt-5 text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Osman Meyredi
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
              {settings.heroTagline}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href="/shows"
                className="inline-block bg-ink px-6 py-3 text-sm font-medium tracking-wide text-canvas uppercase transition-colors hover:bg-accent-strong"
              >
                See dates
              </Link>
              <Link href="/contact" className="text-sm underline underline-offset-4">
                Booking &amp; inquiries
              </Link>
            </div>
          </div>
          <div className="mt-16">
            <PlaceholderImage label="Hero — performance photo or film still" ratio="16/9" />
          </div>
        </Container>
      </section>

      {/* Next dates */}
      <section className="border-t border-line py-24">
        <Container wide>
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <p className="eyebrow">Next dates</p>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">On stage soon</h2>
            </div>
            <Link
              href="/shows"
              className="shrink-0 text-sm underline underline-offset-4 hover:text-accent-strong"
            >
              All dates
            </Link>
          </div>
          <div className="mt-10">
            {nextDates.length > 0 ? (
              <EventList events={nextDates} />
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                No public dates are in the diary right now. In the meantime, there is plenty to{" "}
                <Link href="/shows/live-videos" className="underline underline-offset-4">
                  watch
                </Link>{" "}
                and{" "}
                <Link href="/music" className="underline underline-offset-4">
                  listen to
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Featured release */}
      {featuredRelease && (
        <section className="border-t border-line py-24">
          <Container wide>
            <p className="eyebrow">Latest release</p>
            <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
              <PlaceholderImage
                label={`Album artwork — ${featuredRelease.title}`}
                ratio="1/1"
              />
              <div>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                  {featuredRelease.title}
                </h2>
                <p className="tabular mt-2 text-sm text-ink-faint">
                  {RELEASE_TYPE_LABELS[featuredRelease.releaseType]}
                  {featuredRelease.year ? ` · ${featuredRelease.year}` : ""}
                </p>
                {featuredRelease.description && (
                  <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
                    {featuredRelease.description}
                  </p>
                )}
                {featuredRelease.credits && (
                  <p className="mt-3 text-sm text-ink-faint">{featuredRelease.credits}</p>
                )}
                {listenLinks.length > 0 && (
                  <ul className="mt-7 flex flex-wrap gap-3">
                    {listenLinks.map((l) => (
                      <li key={l.label}>
                        <TrackedLink
                          href={l.href}
                          external
                          event="listen_click"
                          eventProps={{ platform: l.label, release: featuredRelease.slug }}
                          className="inline-block border border-ink px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-ink hover:text-canvas"
                        >
                          {l.label}
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-6">
                  <Link
                    href="/music"
                    className="text-sm underline underline-offset-4 hover:text-accent-strong"
                  >
                    All releases
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Services overview */}
      {services.length > 0 && (
        <section className="border-t border-line py-24">
          <Container wide>
            <p className="eyebrow">Working with Osman</p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl">
              Concerts, coaching, workshops
            </h2>
            <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
              {services.map((service) => (
                <div key={service.id} className="border-t border-line pt-6">
                  <h3 className="font-display text-2xl">
                    <Link href={`/services/${service.slug}`} className="hover:text-accent-strong">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {service.shortDescription}
                  </p>
                  <p className="mt-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm underline underline-offset-4 hover:text-accent-strong"
                    >
                      Read more
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* About moment */}
      <section className="border-t border-line py-24">
        <Container>
          <p className="eyebrow">About</p>
          <p className="font-display mt-6 text-2xl leading-snug sm:text-3xl">
            It began at six, picking out a Christmas song on the piano with his uncle — and
            finishing the tune by ear. Today Osman plays piano, keyboards, bass guitar, guitar,
            double bass and drums, sings, and has toured the U.K. with Frank Zappa&rsquo;s
            longtime vocalist Ike Willis.
          </p>
          <p className="mt-8">
            <Link
              href="/about"
              className="text-sm underline underline-offset-4 hover:text-accent-strong"
            >
              More about Osman
            </Link>
          </p>
        </Container>
      </section>

      {/* Featured live video — dark band */}
      {featuredVideo && (
        <section className="bg-ink py-24 text-canvas">
          <Container wide>
            <div className="flex items-baseline justify-between gap-6">
              <div>
                <p className="eyebrow">Live</p>
                <h2 className="font-display mt-3 text-3xl sm:text-4xl">{featuredVideo.title}</h2>
              </div>
              <Link
                href="/shows/live-videos"
                className="shrink-0 text-sm text-canvas underline underline-offset-4"
              >
                All live videos
              </Link>
            </div>
            <div className="mt-10">
              <VideoEmbed
                title={featuredVideo.title}
                platform={featuredVideo.platform}
                videoUrl={featuredVideo.videoUrl}
                thumbnailUrl={featuredVideo.thumbnailUrl}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Media signal */}
      {featuredMedia && (
        <section className="border-t border-line py-24">
          <Container>
            <p className="eyebrow">{featuredMedia.publication}</p>
            <h2 className="font-display mt-4 text-2xl leading-snug sm:text-3xl">
              {featuredMedia.headline}
            </h2>
            <p className="mt-6">
              <a
                href={featuredMedia.articleUrl}
                target="_blank"
                rel="noopener"
                className="text-sm underline underline-offset-4 hover:text-accent-strong"
              >
                Read the article
              </a>
              <Link
                href="/media"
                className="ml-6 text-sm text-ink-soft underline underline-offset-4"
              >
                All press
              </Link>
            </p>
          </Container>
        </section>
      )}

      {/* Shop teaser */}
      <section className="border-t border-line py-16">
        <Container wide>
          <p className="text-ink-soft">
            {shopTeaser}{" "}
            <TrackedLink
              href="/shop"
              event="shop_click"
              eventProps={{ source: "home_teaser" }}
              className="underline underline-offset-4 hover:text-accent-strong"
            >
              Visit the shop
            </TrackedLink>
          </p>
        </Container>
      </section>

      {/* Contact CTA band */}
      <section className="bg-ink py-24 text-canvas sm:py-28">
        <Container wide>
          <h2 className="font-display max-w-2xl text-4xl leading-tight sm:text-5xl">
            Book Osman for a concert, coaching or a workshop.
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-canvas/75">
            Tell him about the occasion, the room and the people in it — he&rsquo;ll come back
            with a concrete proposal.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-block bg-accent px-7 py-3 text-sm font-medium tracking-wide text-canvas uppercase transition-colors hover:bg-accent-strong"
          >
            Get in touch
          </Link>
        </Container>
      </section>
    </>
  );
}
