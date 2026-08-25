import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { upcomingPublished } from "@/lib/events";
import { JsonLd, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { TrackedLink } from "@/components/public/TrackedLink";
import { HeroArt } from "@/components/public/HeroArt";
import { AboutArt } from "@/components/public/AboutArt";
import { RecordSleeve } from "@/components/public/RecordSleeve";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { RecordsScroller } from "@/components/motion/RecordsScroller";

const INSTRUMENTS = [
  "Bass guitar",
  "Double bass",
  "Keyboards",
  "Piano",
  "Guitar",
  "Drums",
  "Voice",
  "Composition",
  "Arrangement",
];

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

      {/* Hero V2 (Headztones direction): image and type as one composition.
          Sequence: image opens through a mask & settles from a tight crop →
          OSMAN / MEYREDI enter as separate masked lines → metadata + CTAs →
          ambient image drift remains after the intro. */}
      <section className="border-b border-line">
        <Container wide className="relative">
          <div className="grid items-end gap-x-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-0">
            <div className="relative z-10 lg:py-24">
              <p className="hero-meta-in eyebrow">
                Amsterdam — Netherlands · Italy · Europe
              </p>
              <h1
                className="display-caps mt-6 text-[19vw] sm:text-8xl lg:text-[9.5rem] xl:text-[11rem]"
                aria-label="Osman Meyredi"
              >
                <span className="hero-line" aria-hidden="true">
                  <span>Osman</span>
                </span>
                <span className="hero-line lg:ml-[0.8em]" aria-hidden="true">
                  <span>Meyredi</span>
                </span>
              </h1>
              <div className="hero-meta-in mt-8 grid max-w-xl gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="text-base leading-relaxed text-ink-soft">
                  {settings.heroTagline}
                </p>
              </div>
              <div className="hero-meta-in mt-9 flex flex-wrap items-center gap-6">
                <Link
                  href="/shows"
                  data-cursor="DATES"
                  className="btn-motion inline-block bg-ink px-6 py-3 text-sm font-medium tracking-wide text-canvas uppercase"
                >
                  See dates <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
                </Link>
                <Link href="/contact" data-cursor="BOOK" className="u-link text-sm">
                  Booking &amp; inquiries
                </Link>
              </div>
            </div>
            {/* Image column: bleeds to the top edge, overlapped by the name */}
            <div className="relative -order-1 lg:order-none">
              <div className="hero-image-mask lg:-ml-16">
                <div className="hero-image-inner">
                  <div className="hero-ambient">
                    <HeroArt />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Instruments strip — one quiet marquee, part of the composition */}
      <div className="border-b border-line py-5">
        <Marquee duration={56} label="Instruments and disciplines">
          {INSTRUMENTS.map((label) => (
            <span key={label} className="flex items-center text-sm tracking-[0.18em] text-ink-faint uppercase">
              <span className="px-6">{label}</span>
              <span aria-hidden="true" className="text-line-dark">·</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Next dates */}
      <section className="border-t border-line py-24">
        <Container wide>
          <Reveal variant="text">
            <div className="flex items-baseline justify-between gap-6">
              <div>
                <p className="eyebrow">Next dates</p>
                <h2 className="font-display mt-3 text-3xl sm:text-4xl">On stage soon</h2>
              </div>
              <Link href="/shows" className="u-link shrink-0 text-sm hover:text-accent-strong">
                All dates
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            {nextDates.length > 0 ? (
              <Reveal variant="card" delay={120}>
                <EventList events={nextDates} />
              </Reveal>
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                No public dates are in the diary right now. In the meantime, there is plenty to{" "}
                <Link href="/shows/live-videos" className="u-link">
                  watch
                </Link>{" "}
                and{" "}
                <Link href="/music" className="u-link">
                  listen to
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Featured music (Headztones direction): one release dominates —
          sticky oversized sleeve, condensed display title, vinyl slides out
          on hover, listen platforms as drawn-border actions. */}
      {featuredRelease && (
        <section className="feat-hover group/feat border-t border-line bg-canvas-soft py-24">
          <Container wide>
            <Reveal variant="text">
              <p className="eyebrow">Featured release</p>
            </Reveal>
            <div className="mt-12 grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="lg:sticky lg:top-24">
                <RecordSleeve
                  title={featuredRelease.title}
                  year={featuredRelease.year}
                  tone="#a34a45"
                  artworkUrl={featuredRelease.artworkUrl}
                  withVinyl
                  vinylClassName="transition-transform duration-500 ease-(--ease-out-cubic) group-hover/feat:translate-x-[16%]"
                  className="pr-[14%]"
                />
              </div>
              <div>
                <h2 className="display-caps text-5xl sm:text-6xl xl:text-7xl">
                  {featuredRelease.title}
                </h2>
                <p className="tabular mt-4 text-sm tracking-wide text-ink-faint uppercase">
                  {RELEASE_TYPE_LABELS[featuredRelease.releaseType]}
                  {featuredRelease.year ? ` · ${featuredRelease.year}` : ""}
                </p>
                {featuredRelease.description && (
                  <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
                    {featuredRelease.description}
                  </p>
                )}
                {featuredRelease.credits && (
                  <p className="mt-3 text-sm text-ink-faint">{featuredRelease.credits}</p>
                )}
                {listenLinks.length > 0 && (
                  <ul className="mt-9 flex flex-wrap gap-3">
                    {listenLinks.map((l) => (
                      <li key={l.label}>
                        <TrackedLink
                          href={l.href}
                          external
                          event="listen_click"
                          eventProps={{ platform: l.label, release: featuredRelease.slug }}
                          data-cursor="LISTEN"
                          data-cursor-style="disc"
                          className="border-draw inline-block px-5 py-2.5 text-sm font-medium tracking-wide uppercase hover:bg-ink hover:text-canvas"
                        >
                          {l.label}
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-8">
                  <Link href="/music" data-cursor="VIEW" className="u-link text-sm hover:text-accent-strong">
                    The full discography <span className="arrow-nudge" aria-hidden="true">→</span>
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
            <Reveal variant="text">
              <p className="eyebrow">Working with Osman</p>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">
                Concerts, coaching, workshops
              </h2>
            </Reveal>
            {/* Distinct identities per service: outlined index numerals fill
                with the accent on hover, names widen (variable wdth axis). */}
            <div className="mt-12">
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className="morph-trigger group border-t border-line py-8 transition-colors duration-300 last:border-b hover:border-ink"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    data-cursor="VIEW"
                    className="grid items-baseline gap-x-8 gap-y-3 sm:grid-cols-[5rem_1fr_auto]"
                  >
                    <span className="service-index text-5xl sm:text-6xl" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span>
                      <span
                        className="font-display morph-wide block text-3xl sm:text-4xl"
                        style={{ fontVariationSettings: '"wdth" 80' }}
                      >
                        {service.title}
                      </span>
                      <span className="mt-2 block max-w-xl text-sm leading-relaxed text-ink-soft">
                        {service.shortDescription}
                      </span>
                    </span>
                    <span className="u-link hidden text-sm sm:inline">
                      Read more <span className="arrow-nudge" aria-hidden="true">→</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* About moment — copy beside a dark instrument study (image change #2:
          integrated into the composition, not a card bolted underneath) */}
      <section className="border-t border-line py-24">
        <Container wide>
          <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            <Reveal variant="text">
              <p className="eyebrow">About</p>
              <p className="font-display mt-6 text-2xl leading-snug sm:text-3xl">
                It began at six, picking out a Christmas song on the piano with his uncle — and
                finishing the tune by ear. Today Osman plays piano, keyboards, bass guitar,
                guitar, double bass and drums, sings, and has toured the U.K. with Frank
                Zappa&rsquo;s longtime vocalist Ike Willis.
              </p>
              <p className="mt-8">
                <Link href="/about" className="u-link text-sm hover:text-accent-strong">
                  More about Osman <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </p>
            </Reveal>
            <Reveal variant="mask" delay={120} className="mx-auto w-full max-w-[300px] md:mx-0 md:justify-self-end">
              <div className="media-zoom border border-line">
                <AboutArt />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* RECORDS — ElectraJazz-inspired pinned horizontal section. Vertical
          scroll drives the discs across the viewport; outlined typography
          drifts behind at a slower rate; discs spin continuously and react to
          scroll velocity. Mobile & reduced-motion get a native swipe strip. */}
      {releases.length > 0 && (
        /* NOTE: no overflow-hidden here — it would re-parent position:sticky
           and break the pinned viewport. Horizontal overflow is contained by
           .records-viewport itself. */
        <section className="border-t border-line bg-stage">
          <Container wide className="pt-20 pb-4">
            <p className="eyebrow" style={{ color: "var(--color-ink-faint)" }}>
              The records
            </p>
            <h2 className="display-caps mt-3 text-4xl sm:text-5xl">
              Spin through the shelf
            </h2>
          </Container>
          <RecordsScroller releases={releases} />
        </section>
      )}

      {/* Featured live video — dark band */}
      {featuredVideo && (
        <section className="bg-stage py-24">
          <Container wide>
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <div>
                  <p className="eyebrow">Live</p>
                  <h2 className="font-display mt-3 text-3xl sm:text-4xl">{featuredVideo.title}</h2>
                </div>
                <Link href="/shows/live-videos" className="u-link shrink-0 text-sm">
                  All live videos
                </Link>
              </div>
            </Reveal>
            <Reveal variant="media" delay={120} className="mt-10">
              <VideoEmbed
                title={featuredVideo.title}
                platform={featuredVideo.platform}
                videoUrl={featuredVideo.videoUrl}
                thumbnailUrl={featuredVideo.thumbnailUrl}
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* Media signal */}
      {featuredMedia && (
        <section className="border-t border-line py-24">
          <Container>
            <Reveal variant="text">
              <p className="eyebrow">{featuredMedia.publication}</p>
              <h2 className="font-display mt-4 text-2xl leading-snug sm:text-3xl">
                {featuredMedia.headline}
              </h2>
              <p className="mt-6">
                <a
                  href={featuredMedia.articleUrl}
                  target="_blank"
                  rel="noopener"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  Read the article <span className="arrow-nudge" aria-hidden="true">→</span>
                </a>
                <Link href="/media" className="u-link ml-6 text-sm text-ink-soft">
                  All press
                </Link>
              </p>
            </Reveal>
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
              className="u-link hover:text-accent-strong"
            >
              Visit the shop
            </TrackedLink>
          </p>
        </Container>
      </section>

      {/* Contact CTA band */}
      <section className="border-t border-line bg-stage py-24 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <h2 className="font-display max-w-2xl text-4xl leading-tight sm:text-5xl">
              Book Osman for a concert, coaching or a workshop.
            </h2>
          </Reveal>
          <Reveal variant="text" delay={130}>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
              Tell him about the occasion, the room and the people in it — he&rsquo;ll come back
              with a concrete proposal.
            </p>
            <Link
              href="/contact"
              className="btn-motion mt-9 inline-block bg-accent px-7 py-3 text-sm font-medium tracking-wide text-white uppercase"
            >
              Get in touch <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
