import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";

export const metadata: Metadata = {
  title: "Concerts & Live Performances — Book Osman Meyredi live",
  description:
    "Book Osman Meyredi for a full live show: his own studio productions come to life through multiple instruments and a stage presence that swings from intimate to full-on spectacle.",
  alternates: { canonical: "/services/concerts" },
};

/**
 * Concerts & Live Performances — Round 2 Keynote slides 11–14. The entire
 * copy follows the final content document ("Concerts & Live performances
 * .pages" in Website/05. Services/Concert & Live Performances) verbatim:
 * one red vertical text treatment (the tickets note, as the document marks
 * it), the two new explanatory paragraphs replacing the old read-more block,
 * and the three booking options with their full approved descriptions. The
 * supplied black-and-white landscape image replaces the old crop; the colour
 * version is still with Varsha (visible pending note by client request).
 */
const OPTIONS = [
  {
    title: "Live multi-instrumental performance",
    body: "One person, an entire band's worth of sound. Osman switches between instruments in real time, sings, plays, and keeps the crowd with him the whole way, no backing musicians, no safety net, just him pulling off what usually takes five people. In a small theatre or an intimate event, watching one artist build a full, entertaining show from scratch in front of you is the whole draw.",
  },
  {
    title: "Visual production",
    body: "Same artist, same solo performance, just with the stage built up around him: lighting, visuals, smoke, fire, the works. It's not a bigger band, it's a bigger frame around the same one-man show, scaled for festivals and larger crowds who want the full spectacle to match.",
  },
  {
    title: "Expanded live show",
    body: "Additional musicians, dancers and production come in when the moment calls for a full band-sized sound and presence on stage.",
  },
];

export default function ConcertsServicePage() {
  return (
    <article>
      <ServicesSubnav current="/services/concerts" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Concerts &amp; Live Performances
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Festivals · Venues · Events · Performances
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Want Osman on your stage? Think full live show: his own studio productions come to
              life through multiple instruments and a stage presence that swings from intimate
              to full-on spectacle. Keep it stripped back and raw, or go all in with a bigger
              visual production, it scales to whatever the room calls for, festival, theatre,
              club night, headline slot.
            </p>
            <p className="mt-6 leading-relaxed text-ink-soft">
              Solo, or with a hand-picked band behind him, from a tight festival set to a full
              headline show, Osman fits the slot.
            </p>
            {/* The one red vertical text treatment (Keynote slide 11: "only 1
                red vertical line with text, not two"). */}
            <p className="mt-6 border-l-2 border-accent pl-4 text-sm text-ink-soft">
              Looking for tickets to an upcoming show?{" "}
              <Link href="/shows/tickets" className="u-link">
                See Shows
              </Link>
              . This page is about booking Osman to perform at your event.
            </p>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=CONCERTS_LIVE"
                event="service_inquiry_click"
                eventProps={{ service: "concerts", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                Book Osman live <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>

        {/* Round 2 slide 13: the supplied landscape image (black-and-white
            version, as embedded on the slide). */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "2400/1350" }}>
              <Image
                src="/images/services/concerts-live-landscape.jpg"
                alt="Osman Meyredi mid-performance at the keys, black and white, head tilted back"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <p className="mt-3">
            <span className="pending-note">Waiting for Varsha — colour version to follow</span>
          </p>
        </Container>

        {/* Final-content paragraphs (slide 14: old copy removed). */}
        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              He&rsquo;s a proper multi-instrumentalist: singing, piano, synths, bass, guitar,
              double bass, percussion, whatever the song needs. And the music doesn&rsquo;t sit
              still either, it slides between rock, funk, electronic, cinematic and rhythmic
              influences depending on where he takes it.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              There&rsquo;s no standard band line-up on stage. Instead he moves between
              instruments himself, layering them live with custom tracks and electronic
              elements he&rsquo;s built in his own studio. One moment it&rsquo;s stripped back
              and intimate, the next it fills the whole room.
            </p>
          </Reveal>
        </Container>

        {/* Three ways to book a show — full approved option copy. */}
        <Container className="mt-20">
          <Reveal variant="text">
            <h2 className="eyebrow">Three ways to book a show</h2>
          </Reveal>
          <div className="mt-8">
            {OPTIONS.map((option, i) => (
              <Reveal
                key={option.title}
                variant="card"
                delay={i * 90}
                className="grid gap-3 border-t border-line py-8 last:border-b sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <span className="service-index text-4xl sm:text-5xl" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl tracking-wide uppercase">{option.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{option.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>

        {/* Statement break — final line carries the emphasis. */}
        <Container className="mt-20">
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug text-ink-soft sm:text-3xl">
              Not every performance needs the same set-up.
              <br />
              The starting point is always the same:
            </p>
            <p className="display-caps mt-6 max-w-3xl text-3xl leading-tight text-accent-strong sm:text-5xl">
              What would make this particular audience feel something?
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=CONCERTS_LIVE"
              event="service_inquiry_click"
              eventProps={{ service: "concerts", position: "footer" }}
              className="btn-pill"
              data-cursor="BOOK"
            >
              Book Osman live <span className="arrow-nudge" aria-hidden="true">→</span>
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
