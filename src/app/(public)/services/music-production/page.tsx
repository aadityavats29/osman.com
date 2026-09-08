import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";

export const metadata: Metadata = {
  title: "Music Production — From first idea to finished track",
  description:
    "Work with Osman Meyredi as an artist-producer: developing, arranging, recording, mixing and mastering — a producer who thinks like a musician, arranger and performer, and can play the instruments himself.",
  alternates: { canonical: "/services/music-production" },
};

/**
 * Music Production — Keynote 02-09-2026, slide 13. Same design template as
 * the other service pages; the studio image is specified black-and-white and
 * arrives later, so the placeholder holds its slot at the intended ratio.
 */
export default function MusicProductionPage() {
  return (
    <article>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Music Production
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Production · Arrangement · Instrumentation · Recording · Mixing · Mastering
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Osman Meyredi is an artist-producer, multi-instrumentalist and composer who works
              with artists to develop, shape and finish their music.
            </p>
            {/* The red line — the deck's short statement. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              From first idea to finished track.
            </p>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=MUSIC_PRODUCTION"
                event="service_inquiry_click"
                eventProps={{ service: "music-production", position: "hero" }}
                className="btn-pill"
                data-cursor="WORK"
              >
                Work with Osman <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>

        {/* Studio image — requested in black and white; placeholder until the
            final photograph is supplied (grayscale applied on arrival via the
            same slot). */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="grayscale">
              <PlaceholderImage
                label="Osman in the studio — black & white photo to come"
                ratio="3/1"
              />
            </div>
          </Reveal>
        </Container>

        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              Osman Meyredi doesn&rsquo;t approach production as someone working only behind a
              computer. He thinks like a musician, arranger and performer, too. That means he
              can hear what a track is missing, help develop the musical direction and, when
              needed, play and record the instruments himself.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              Whether you have a rough idea, a demo that isn&rsquo;t quite there yet, or a
              nearly finished song that needs the final production, mixing or mastering, Osman
              Meyredi can step in at the point where you need him.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=MUSIC_PRODUCTION"
              event="service_inquiry_click"
              eventProps={{ service: "music-production", position: "footer" }}
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
