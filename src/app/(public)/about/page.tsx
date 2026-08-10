import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export const metadata: Metadata = {
  title: "About",
  description:
    "Osman Meyredi — Italian multi-instrumentalist based in Amsterdam. Piano, keyboards, bass guitar, guitar, double bass, drums and vocals; performing, coaching and teaching across Europe.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article>
      {/* Identity statement — the page's signature moment */}
      <section className="py-24 sm:py-32">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">About</p>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Osman Meyredi is a multi-instrumentalist who treats every instrument as a different
              way of listening.
            </h1>
          </Reveal>
          <Reveal variant="text" delay={140}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Piano, keyboards, bass guitar, guitar, double bass, drums, vocals. Born in Italy in
              1984, based in Amsterdam, at home on stages across Europe.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container wide>
        <Parallax speed={0.1}>
          <Reveal variant="mask" className="mx-auto max-w-xl">
            <PlaceholderImage label="Portrait — Osman with double bass" ratio="3/4" />
          </Reveal>
        </Parallax>
      </Container>

      {/* Origin */}
      <section className="py-24">
        <Container>
          <Reveal variant="text">
            <h2 className="font-display text-3xl">It started with a Christmas song</h2>
            <p className="mt-6 leading-relaxed">
              Osman was six when his uncle sat him at the piano and taught him a Christmas song.
              The lesson stopped partway through; the tune didn&rsquo;t. He finished it himself,
              by ear — finding the rest of the melody one note at a time. That instinct, working
              out what the music wants next by listening rather than reading, has stayed at the
              centre of everything since.
            </p>
            <p className="mt-6 leading-relaxed">
              One instrument became several. Over the years the piano was joined by keyboards,
              bass guitar, guitar, double bass and drums — and by his voice. Not out of
              restlessness, but out of curiosity: each instrument sits somewhere different in the
              music, and each one teaches you to hear the others differently.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Education */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">Two conservatories, two questions</h2>
            <p className="mt-6 leading-relaxed">
              In 2009 he completed a master&rsquo;s degree in double bass at the Trento
              Conservatory in Italy — years spent deep inside one instrument, its repertoire and
              its role in an ensemble.
            </p>
            <p className="mt-6 leading-relaxed">
              A decade later came a different question: not how to play, but how people learn to
              play together. In 2020 he finished a degree in Music Education at the Conservatory
              of Amsterdam, studying pedagogy, arrangement, band coaching, vocal performance, jazz
              piano and music production. The two degrees frame his working life: one rooted in
              craft, the other in how craft is shared.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Multi-instrumentalist perspective */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">The view from every chair</h2>
            <p className="mt-6 leading-relaxed">
              Playing bass teaches you what the drummer needs. Playing drums teaches you what the
              bass should leave out. Sitting at the piano, you hear how much space a singer
              actually has. Having occupied nearly every chair on the bandstand, Osman arranges,
              transcribes and composes with a working knowledge of how each part feels under the
              hands — and writes parts musicians are glad to play.
            </p>
            <p className="mt-6 leading-relaxed">
              His work spans live performance, studio sessions, composition, transcription and
              arrangement, in the Netherlands, Italy and across Europe.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container wide>
        <Reveal variant="mask">
          <PlaceholderImage label="Performance — live on stage" ratio="3/2" />
        </Reveal>
      </Container>

      {/* Touring & collaboration */}
      <section className="py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">On the road</h2>
            <p className="mt-6 leading-relaxed">
              Among the collaborations he values most: touring the U.K. multiple times with Ike
              Willis — Frank Zappa&rsquo;s longtime vocalist — and the band Zappatika. Zappa&rsquo;s
              music is unforgiving of half-listening; nights on that repertoire, with a singer who
              lived inside it for decades, are a masterclass in precision and play at the same
              time.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Philosophy — drifts a touch slower than the page around it */}
      <section className="border-t border-line py-24">
        <Container>
          <Parallax speed={0.06}>
            <Reveal variant="text">
              <h2 className="font-display text-3xl">Listening between the notes</h2>
              <p className="mt-6 leading-relaxed">
                Ask Osman what he actually does on stage and the answer is simple: he listens. To
                the room — every space carries sound its own way, and a set that works in a theatre
                can smother a dinner. To the other musicians — who is stepping forward, who is
                making space, where the groove wants to settle. And to what is not being heard yet:
                the note nobody has played, the pause the song is asking for.
              </p>
              <p className="mt-6 leading-relaxed">
                It is why his coaching starts from how a band listens rather than how it plays, and
                why his workshops use music to let teams experience — not discuss — what attention
                to each other actually feels like.
              </p>
            </Reveal>
          </Parallax>
        </Container>
      </section>

      {/* Languages & availability */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">Languages &amp; availability</h2>
            <p className="mt-6 leading-relaxed">
              Osman works in English, Italian and Dutch. He is based in Amsterdam, performs
              regularly in the Netherlands and Italy, and travels for concerts, coaching and
              workshops across Europe.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                href="/shows/concerts"
                className="btn-motion inline-block bg-ink px-6 py-3 text-sm font-medium tracking-wide text-canvas uppercase"
              >
                Upcoming concerts <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-block border border-ink px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-ink hover:text-canvas"
              >
                Get in touch
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
