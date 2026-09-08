import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";

export const metadata: Metadata = {
  title: "Concerts & Live Performances — Book Osman live",
  description:
    "Book Osman Meyredi for a full live show: a hybrid performance built from his own studio productions, multiple instruments and a stage presence that scales from intimate sets to headline shows.",
  alternates: { canonical: "/services/concerts" },
};

/**
 * Concerts & Live Performances — Keynote 02-09-2026, slides 9–11.
 * Client-approved copy, the red-line callout kept by request, a read-more
 * fold to keep the page airy, the three booking options as an intentional
 * section, and the closing statement with its final line emphasised.
 */
const OPTIONS = [
  {
    title: "Live multi-instrumental performance",
    body: "Osman performs his music across several instruments, supported by his own produced tracks.",
  },
  {
    title: "Visual production",
    body: "Visuals, lighting and stage elements can be developed around the music.",
  },
  {
    title: "Expanded live show",
    body: "Additional musicians, dancers and production can be added when the stage or event calls for something bigger.",
  },
];

export default function ConcertsServicePage() {
  return (
    <article>
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
              Book Osman for a full live show, a hybrid performance built from his own studio
              productions, multiple instruments and a stage presence that moves between intimate
              and large-scale. The result can be kept simple, or developed into a much larger
              visual production, completely scaled to fit festivals, theatres, venues and
              headline shows alike.
            </p>
            {/* The red line — kept by explicit request (Keynote slide 9). */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              Available solo or with a hand-picked group of musicians, from shorter festival
              sets to complete headline performances.
            </p>
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

        {/* Strong live-performance imagery (Keynote slide 10) — the supplied
            live photograph in a wide stage crop. */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "3/1" }}>
              <Image
                src="/images/home-hero.jpg"
                alt="Osman Meyredi mid-performance, singing at the keys in blue stage light"
                fill
                sizes="100vw"
                className="object-cover object-[50%_22%]"
              />
            </div>
          </Reveal>
        </Container>

        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="text-lg leading-relaxed text-ink">
              Looking for a live performance for your festival, venue, corporate event or
              special occasion?
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              What makes Osman&rsquo;s work distinctive is that he can take different styles,
              instruments and influences and make them sound like they belong together.
            </p>
            {/* "To avoid a lot of text, maybe use a read more?" — yes: the
                deeper story folds behind an accessible disclosure. */}
            <details className="read-more mt-6 group">
              <summary className="u-link cursor-pointer list-none text-sm text-ink-soft hover:text-accent-strong">
                <span className="read-more-closed">Read more <span aria-hidden="true">↓</span></span>
                <span className="read-more-open">Read less <span aria-hidden="true">↑</span></span>
              </summary>
              <div className="mt-6 space-y-6">
                <p className="leading-relaxed text-ink">
                  He&rsquo;s a skilled multi-instrumentalist, he sings, plays piano, synths,
                  bass, guitar, double bass, percussion and more, and his music moves between
                  genres rather than staying neatly inside one of them, drawing on rock, funk,
                  electronic, cinematic and rhythmic influences.
                </p>
                <p className="leading-relaxed text-ink">
                  Rather than relying on a conventional band line-up, he moves between
                  instruments live, combining them with custom-produced tracks and electronic
                  elements from his own studio. The result is a hybrid performance that can feel
                  intimate one moment and fill a large stage the next.
                </p>
                <p className="leading-relaxed text-ink">
                  That flexibility makes the show especially suitable for festivals, theatres,
                  music venues, clubs and cultural programmes looking for an artist who brings
                  something different to the stage. Performances can range from shorter festival
                  sets to complete headline shows, and productions can be kept simple or
                  developed into a much larger visual experience — scaled to fit almost any
                  venue, production or budget without losing musical impact.
                </p>
              </div>
            </details>
          </Reveal>
        </Container>

        {/* Three ways to book the show — an intentional section, not a
            paragraph dump (Keynote slide 10). */}
        <Container className="mt-20">
          <Reveal variant="text">
            <h2 className="eyebrow">Three ways to book the show</h2>
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

        {/* Statement break — final line carries the emphasis (Keynote slide 10). */}
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
