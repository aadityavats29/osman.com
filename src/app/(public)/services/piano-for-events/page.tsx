import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";

export const metadata: Metadata = {
  title: "Live Piano for Events — Corporate, receptions & special occasions",
  description:
    "Osman Meyredi performs live piano for company celebrations, brand launches, conferences, (wedding) receptions and other private and corporate occasions — repertoire and production adapted to the setting.",
  alternates: { canonical: "/services/piano-for-events" },
};

/**
 * Live Piano for Events — Round 2 Keynote slide 15: the entire content was
 * rewritten; this page follows "Live Piano for Events .pages" (Website/05.
 * Services/Live Piano Concerts) verbatim, with the approved temporary image
 * from the same folder ("Rome Airport Performance 2025.jpg" — to be swapped
 * only when the client supplies a nicer one). One source typo ("what that
 * sound like") is corrected to "sounds" — flagged in the report.
 */
export default function PianoForEventsPage() {
  return (
    <article>
      <ServicesSubnav current="/services/piano-for-events" />
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
              Osman Meyredi performs live piano for company celebrations, brand launches,
              conferences, (wedding) receptions and other private and corporate occasions. The
              performance, repertoire and production can all be adapted to the setting.
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

        {/* The approved image from the Live Piano folder (temporary until the
            client supplies a nicer one — their instruction). */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "1920/1081" }}>
              <Image
                src="/images/services/live-piano-rome-2025.jpg"
                alt="Osman Meyredi performing at a grand piano in front of an audience, Rome, 2025"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>

        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              For these occasions, he keeps things understated: solo piano, played live, present
              in the room without ever taking it over. His repertoire blends his own
              compositions with carefully chosen covers, drifting easily between light
              classical, jazz, pop and film music depending on the mood he&rsquo;s reading in
              the room. With his broad musical background and his ear for a room, he shapes the
              set as he goes, rather than sticking to a fixed programme.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              Want something with a bit more presence? A vocalist, male or female, can be added
              on request.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              If the venue has its own grand piano, that&rsquo;s always Osman&rsquo;s first
              choice, it keeps the set-up simple and adds a natural touch of class. If not, he
              brings his own electronic piano, built discreetly into a grand-piano-style shell,
              so the elegance of a real piano is never lost, even without one in the room.
            </p>
          </Reveal>
        </Container>

        {/* Closing listen prompt from the final content document. */}
        <Container className="mt-16">
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              Want to hear what that sounds like?
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              Watch Osman Meyredi at the piano, from intimate performance to jazz, pop and his
              own compositions.
            </p>
            <p className="mt-7">
              <Link href="/shows/live-videos" className="btn-pill" data-cursor="WATCH">
                Watch the live videos <span className="arrow-nudge" aria-hidden="true">→</span>
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
