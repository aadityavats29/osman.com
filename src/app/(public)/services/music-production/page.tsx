import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";

export const metadata: Metadata = {
  title: "Music Production — Why Osman Meyredi is the right producer",
  description:
    "Osman Meyredi is an artist-producer, multi-instrumentalist and composer who works with artists to develop, shape and finish their music — stepping in at the point where you need him.",
  alternates: { canonical: "/services/music-production" },
};

/**
 * Music Production — Round 2 Keynote slide 16: the visitor first reads why
 * Osman Meyredi is the right producer (new content from "Music
 * Production.pages", Website/05. Services/Music Production, verbatim), and
 * only then reaches the conversion CTA at the bottom. Two images from the
 * same folder engage the page as the slide asked — the two newly supplied
 * photographs (Osman_Studio_highres + Osman ZAPPATIKA'S REHEARSALS 2018
 * (2).jpeg).
 */
export default function MusicProductionPage() {
  return (
    <article>
      <ServicesSubnav current="/services/music-production" />
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
            {/* The red line — the document's marked statement. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              Whether you have a rough idea, a demo that isn&rsquo;t quite there yet, or a
              nearly finished song that needs the final production, mixing or mastering, Osman
              Meyredi can step in at the point where you need him.
            </p>
          </Reveal>
        </Container>

        {/* First image — the supplied studio photograph. */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "1600/893" }}>
              <Image
                src="/images/services/production-studio.jpg"
                alt="Osman Meyredi at the keys in his studio"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>

        {/* Why he is the right producer — final content, before any CTA. */}
        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              Playing bass taught Osman what the drummer needs. Playing drums taught him what
              the bass should leave out. Enough time at the piano and you start hearing exactly
              how much space a singer actually has, which matters, because he sings too.
              He&rsquo;s spent time in nearly every chair on the bandstand, and these days that
              shows up as much in the studio as it does on stage.
            </p>
          </Reveal>
        </Container>

        {/* Second image — engagement break between the two paragraphs. */}
        <Container className="mt-12">
          <Reveal variant="mask">
            <div className="mx-auto max-w-md">
              <div className="media-zoom border border-line">
                <Image
                  src="/images/services/production-rehearsals.jpg"
                  alt="Osman Meyredi singing at the keyboard during rehearsals"
                  width={1200}
                  height={1797}
                  sizes="(min-width: 640px) 28rem, 88vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </Container>

        <Container className="mt-12">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              He&rsquo;s just as at home on both sides of production: programming and arranging
              on a laptop, and riding the console when it&rsquo;s time to capture a live take.
              He thinks like a musician, arranger and performer first, which means he can hear
              what a track is missing, help shape the musical direction and, when needed, play
              and record the instruments himself. It&rsquo;s also why artists like working with
              him. He&rsquo;s not just telling a singer or a guitarist what to do, he&rsquo;s
              usually sat in that chair himself, and he writes and produces parts musicians
              actually want to play.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Conversion — bottom of the page only (Keynote slide 16). */}
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
