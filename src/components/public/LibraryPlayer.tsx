"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/**
 * Music Library player — Keynote 02-09-2026, slides 14/21/22.
 *
 * The deck asked how licensing tracks should actually be displayed (pointing
 * at smp.nl and Epidemic Sound). The pattern both use — scannable rows, an
 * instant play/pause per row, genre/mood metadata, a clear licensing action —
 * is translated here into the site's dark editorial language:
 *
 * - one shared <audio> element (rows swap its src; nothing preloads until
 *   the first play, and starting a row stops the previous one);
 * - a native range input as the seek bar, so scrubbing works by keyboard
 *   and screen reader as well as pointer;
 * - progress driven by `timeupdate` events — no requestAnimationFrame loop,
 *   in line with the site's performance rules;
 * - rows without audio yet render an honest "preview to come" state.
 */
export type PlayableTrack = {
  slug: string;
  title: string;
  genre: string | null;
  moods: string[];
  useCases: string[];
  durationSec: number | null;
  audioUrl: string | null;
  featured: boolean;
};

function fmt(sec: number | null | undefined): string {
  if (sec == null || !Number.isFinite(sec) || sec <= 0) return "—:—";
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="3" y="2.5" width="3.4" height="11" fill="currentColor" />
      <rect x="9.6" y="2.5" width="3.4" height="11" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M4 2.4v11.2L13.2 8 4 2.4Z" fill="currentColor" />
    </svg>
  );
}

export function LibraryPlayer({ tracks }: { tracks: PlayableTrack[] }) {
  const [genre, setGenre] = useState<string>("All");
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const t of tracks) if (t.genre) set.add(t.genre);
    return ["All", ...Array.from(set)];
  }, [tracks]);

  const visible = useMemo(
    () => (genre === "All" ? tracks : tracks.filter((t) => t.genre === genre)),
    [tracks, genre]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setPosition(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setPosition(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.pause();
    };
  }, []);

  const toggle = (track: PlayableTrack) => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;
    if (current === track.slug) {
      if (audio.paused) {
        void audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
      return;
    }
    setCurrent(track.slug);
    setPosition(0);
    setDuration(track.durationSec ?? 0);
    audio.src = track.audioUrl;
    void audio.play();
    setPlaying(true);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setPosition(value);
  };

  return (
    <div>
      {/* Single hidden element behind every row */}
      <audio ref={audioRef} preload="none" />

      {genres.length > 2 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`border px-3.5 py-1.5 text-xs tracking-[0.12em] uppercase transition-colors ${
                genre === g
                  ? "border-accent-strong text-accent-strong"
                  : "border-line-dark text-ink-soft hover:border-ink-faint hover:text-ink"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 border-b border-line">
        {visible.map((track) => {
          const active = current === track.slug;
          const isPlaying = active && playing;
          return (
            <li key={track.slug} className="border-t border-line">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-5 sm:gap-x-6">
                {track.audioUrl ? (
                  <button
                    type="button"
                    onClick={() => toggle(track)}
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title}`}
                    data-cursor={isPlaying ? "PAUSE" : "PLAY"}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                      active
                        ? "border-accent-strong text-accent-strong"
                        : "border-line-dark text-ink hover:border-accent-strong hover:text-accent-strong"
                    }`}
                  >
                    <PlayGlyph playing={isPlaying} />
                  </button>
                ) : (
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-faint"
                    title="Preview to come"
                  >
                    <PlayGlyph playing={false} />
                  </span>
                )}

                <div className="min-w-0">
                  <p className="font-display truncate text-lg leading-snug">
                    {track.title}
                    {track.featured && (
                      <span className="ml-3 align-middle text-[10px] tracking-[0.16em] text-accent-strong uppercase">
                        Featured
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs tracking-wide text-ink-faint uppercase">
                    {[track.genre, track.moods.join(" · ")].filter(Boolean).join("  ·  ")}
                    {!track.audioUrl && "  ·  preview to come"}
                  </p>
                  {track.useCases.length > 0 && (
                    <p className="mt-0.5 hidden truncate text-xs text-ink-soft sm:block">
                      Good for {track.useCases.join(", ").toLowerCase()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="tabular text-sm text-ink-soft">
                    {active && duration > 0
                      ? `${fmt(position)} / ${fmt(duration)}`
                      : fmt(track.durationSec)}
                  </span>
                  <Link
                    href={`/contact?type=ORIGINAL_TRACKS`}
                    className="u-link hidden text-sm hover:text-accent-strong sm:inline"
                    data-cursor="LICENSE"
                    aria-label={`License ${track.title}`}
                  >
                    License <span className="arrow-nudge" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              {active && duration > 0 && (
                <div className="pb-5">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, Math.floor(duration))}
                    step={1}
                    value={Math.floor(position)}
                    onChange={(e) => seek(Number(e.currentTarget.value))}
                    aria-label={`Position in ${track.title}`}
                    className="track-seek"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
