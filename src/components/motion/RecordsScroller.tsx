"use client";

import { useEffect, useRef, useState } from "react";
import type { ReleaseRecord } from "@/lib/types";
import { TrackedLink } from "@/components/public/TrackedLink";

/**
 * ElectraJazz-inspired pinned horizontal records section.
 *
 * Desktop: the section pins for ~2.6 viewport-heights of scroll; vertical
 * progress drives the track horizontally (rAF, transform-only). Discs rotate
 * continuously, spin faster with scroll velocity, and scale up as they cross
 * the viewport centre. Outlined background typography travels at a slower
 * rate for depth. Nothing hijacks the wheel — it is plain sticky positioning,
 * so fast/reverse scrolling and mid-page refresh behave natively.
 *
 * Mobile & reduced-motion: a native swipe strip (scroll-snap) — same content,
 * no pinning, no continuous rotation for reduced motion.
 */

const LABEL_TONES = ["#a34b46", "#46586b", "#4d5c48", "#3a3d41"];

function labelTone(i: number): string {
  return LABEL_TONES[i % LABEL_TONES.length];
}

function listenHref(r: ReleaseRecord): { href: string; platform: string } | null {
  if (r.spotifyUrl) return { href: r.spotifyUrl, platform: "Spotify" };
  if (r.appleMusicUrl) return { href: r.appleMusicUrl, platform: "Apple Music" };
  if (r.bandcampUrl) return { href: r.bandcampUrl, platform: "Bandcamp" };
  if (r.youtubeUrl) return { href: r.youtubeUrl, platform: "YouTube" };
  return null;
}

function Disc({
  release,
  index,
  spin,
}: {
  release: ReleaseRecord;
  index: number;
  spin: boolean;
}) {
  const listen = listenHref(release);
  return (
    <article className="record-card" data-record-card>
      <div className="relative mx-auto aspect-square w-full" data-disc>
        {release.artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={release.artworkUrl}
            alt=""
            className={`h-full w-full rounded-full object-cover ${spin ? "vinyl-spin" : ""}`}
            style={{ ["--spin-duration" as string]: `${16 + index * 3}s` }}
          />
        ) : (
          <div
            className={`vinyl vinyl-dark h-full w-full ${spin ? "vinyl-spin" : ""}`}
            style={
              {
                "--vinyl-label": labelTone(index),
                "--spin-duration": `${16 + index * 3}s`,
              } as React.CSSProperties
            }
            role="img"
            aria-label={`Placeholder record artwork — ${release.title}`}
          />
        )}
      </div>
      <div className="mt-6 text-center">
        <p className="eyebrow">{release.year ?? ""}</p>
        <h3 className="font-display mt-1 text-2xl text-balance">{release.title}</h3>
        {release.credits && (
          <p className="mt-2 text-xs text-ink-faint">{release.credits}</p>
        )}
        {listen && (
          <p className="mt-4">
            <TrackedLink
              href={listen.href}
              external
              event="listen_click"
              eventProps={{ platform: listen.platform, release: release.slug }}
              className="u-link text-sm font-medium tracking-wide uppercase"
              data-cursor="LISTEN"
              data-cursor-style="disc"
            >
              Listen — {listen.platform}
            </TrackedLink>
          </p>
        )}
      </div>
    </article>
  );
}

export function RecordsScroller({ releases }: { releases: ReleaseRecord[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pinned" | "swipe">("swipe");

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(wide.matches && !reduced.matches ? "pinned" : "swipe");
    decide();
    wide.addEventListener("change", decide);
    reduced.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      reduced.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (mode !== "pinned") return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const bg = bgRef.current;
    if (!section || !track) return;

    let raf = 0;
    let lastProgress = 0;
    let velocityBoost = 0;
    let visible = false;

    // Measurements are cached and refreshed on resize — never read scrollWidth
    // or innerWidth inside the per-frame path.
    let travel = 0;
    let viewportH = window.innerHeight;
    let centre = window.innerWidth / 2;
    let halfSpan = window.innerWidth * 0.55;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-record-card]"));
    const discs = cards.map((c) => c.querySelector<HTMLElement>("[data-disc] > *"));

    const remeasure = () => {
      viewportH = window.innerHeight;
      centre = window.innerWidth / 2;
      halfSpan = window.innerWidth * 0.55;
      // scrollWidth is unaffected by the card scale transforms; safe to cache.
      travel = track.scrollWidth - window.innerWidth;
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - viewportH;
      if (total <= 0 || travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));

      velocityBoost = Math.min(14, velocityBoost * 0.9 + Math.abs(progress - lastProgress) * 400);
      lastProgress = progress;

      // READ phase: collect all card rects before any style writes — no
      // interleaved read/write layout thrash.
      const rects = cards.map((c) => c.getBoundingClientRect());

      // WRITE phase
      track.style.transform = `translate3d(${(-progress * travel).toFixed(1)}px, -50%, 0)`;
      if (bg) {
        bg.style.transform = `translate3d(${(-progress * travel * 0.38).toFixed(1)}px, -50%, 0)`;
      }
      const spinNudge = velocityBoost > 0.4 ? `${velocityBoost.toFixed(1)}deg` : "";
      cards.forEach((card, i) => {
        const r = rects[i];
        const d = Math.abs(r.left + r.width / 2 - centre);
        const scale = 1 + Math.max(0, 0.1 * (1 - Math.min(1, d / halfSpan)));
        card.style.transform = `scale(${scale.toFixed(3)})`;
        const disc = discs[i];
        if (disc) disc.style.rotate = spinNudge;
      });
    };

    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      remeasure();
      onScroll();
    };

    // The whole system sleeps while the section is off-screen: no scroll
    // work, and the continuous disc spins pause (data-anim-paused CSS).
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        section.dataset.animPaused = visible ? "false" : "true";
        if (visible) {
          remeasure();
          onScroll();
        }
      },
      { rootMargin: "25% 0px" }
    );
    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    remeasure();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);

  if (releases.length === 0) return null;

  if (mode === "swipe") {
    return (
      <div className="records-swipe" aria-label="Records">
        {releases.map((r, i) => (
          <Disc key={r.id} release={r} index={i} spin={false} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      style={{ height: `${Math.max(220, releases.length * 90 + 130)}svh` }}
    >
      <div className="records-viewport">
        <div ref={bgRef} className="records-bgtype display-caps" aria-hidden="true">
          Records&nbsp;·&nbsp;Records&nbsp;·&nbsp;Records&nbsp;·
        </div>
        <div
          ref={trackRef}
          className="records-track absolute top-1/2 left-0"
          style={{ transform: "translate3d(0,-50%,0)" }}
        >
          {releases.map((r, i) => (
            <Disc key={r.id} release={r} index={i} spin />
          ))}
          <div className="record-card flex flex-col items-start justify-center">
            <p className="eyebrow">All of it</p>
            <p className="font-display mt-3 text-3xl">The full discography</p>
            <a
              href="/music"
              data-cursor="VIEW"
              className="u-link mt-5 text-sm font-medium tracking-wide uppercase"
            >
              Open the music page <span className="arrow-nudge" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
