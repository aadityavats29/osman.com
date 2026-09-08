import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";

export const metadata: Metadata = {
  title: "Live Piano for Events — Corporate, receptions & special occasions",
  description:
    "Book Osman Meyredi for live piano at corporate events, receptions, conferences and special occasions — elegant solo piano, repertoire adapted to the room, with an optional vocalist on request.",
  alternates: { canonical: "/services/piano-for-events" },
};

/**
 * Live Piano for Events — Keynote 02-09-2026, slide 12 (design template per
 * the concerts page, client-approved copy). The direct path to this service
 * exists from the menu, the services landing, the footer and the piano rail
 * on Live Videos — the deck's discoverability requirement.
 */
export default function PianoForEventsPage() {
  return (
    <article>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Live Piano for Events
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Corporate · Receptions · Conferences · Special Events
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Book Osman for corporate events, receptions or special events where the music
              needs to support the atmosphere while still creating something memorable.
            </p>
            {/* The red line — same treatment the client asked to keep. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              Available solo or with one hand-picked musician (percussion or guitar), from
              smaller event sets to larger corporate or private events.
            </p>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=LIVE_PIANO"
                event="service_inquiry_click"
                eventProps={{ service: "piano-for-events", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                Book piano for your event <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>

        {/* Keynote: "add an image of Osman behind the piano (template image as
            long as I can provide one)" — held by an honest placeholder at the
            intended ratio until the photograph arrives. */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <PlaceholderImage label="Osman at the piano — photo to come" ratio="3/1" />
          </Reveal>
        </Container>

        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              Osman creates live piano music for corporate and private occasions, such as
              company celebrations, brand launches, conferences, (wedding) receptions and other
              moments where the music needs to support the atmosphere while still creating
              something memorable. The performance, repertoire and production can all be adapted
              to the setting.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              For these occasions, Osman prefers to keep things understated: solo piano, played
              live, as elegant background music rather than a full stage production. His
              repertoire can combine his own piano compositions with carefully selected covers,
              moving easily between light classical, jazz, pop and film music. With his broad
              musical background and ability to play by ear, Osman can adapt the repertoire to
              the atmosphere, audience and occasion.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              For events that call for something more, a male or female vocalist can also be
              added on request.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              If the venue has its own grand piano, that&rsquo;s Osman&rsquo;s first choice. It
              keeps the set-up simple and gives the performance an extra touch of class. If not,
              Osman can bring his own electronic piano, discreetly built into a
              grand-piano-style shell, so the elegance of a real piano is never lost.
            </p>
          </Reveal>
        </Container>

        {/* Hear it first — the piano rail on Live Videos answers "want to hear
            what that sounds like?" (Keynote slides 12 + 18). */}
        <Container className="mt-16">
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              Want to hear what that sounds like?
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              Watch Osman at the piano, from intimate performances to jazz, pop and his own
              compositions.
            </p>
            <p className="mt-7">
              <Link href="/shows/live-videos#piano" className="btn-pill" data-cursor="WATCH">
                Watch piano performances <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=LIVE_PIANO"
              event="service_inquiry_click"
              eventProps={{ service: "piano-for-events", position: "footer" }}
              className="btn-pill"
              data-cursor="BOOK"
            >
              Book piano for your event <span className="arrow-nudge" aria-hidden="true">→</span>
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
