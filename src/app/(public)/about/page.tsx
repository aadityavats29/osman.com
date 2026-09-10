import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export const metadata: Metadata = {
  title: "About",
  description:
    "Osman Meyredi is an Italian-born artist, a multi-instrumentalist, songwriter, composer, singer, music director and producer, based in the Netherlands — performing across Europe and beyond.",
  alternates: { canonical: "/about" },
};

/**
 * About — Round 2 Keynote slides 6–8. The entire page follows the client's
 * Final About Content document (Website/02.About/Text/Final About
 * Content.pages) verbatim: new introduction, "A little much of everything",
 * the two-conservatories story, the Ike Willis tour section and Languages &
 * availability (now "across Europe and beyond"). The two photographs are the
 * approved files from Website/02.About/Images. One source typo ("Oman") is
 * corrected to "Osman" — flagged in the implementation report.
 */
export default function AboutPage() {
  return (
    <article>
      {/* Identity statement — the approved opening sentence (Keynote slide 7). */}
      <section className="py-24 sm:py-32">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">About</p>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Osman Meyredi is an Italian-born artist, a multi-instrumentalist, songwriter,
              composer, singer, music director and producer, based in the Netherlands.
            </h1>
          </Reveal>
        </Container>
      </section>

      <Container wide>
        <Parallax speed={0.1}>
          <Reveal variant="mask" className="mx-auto max-w-4xl">
            {/* First approved About image — Website/02.About/Images. */}
            <div className="media-zoom border border-line">
              <Image
                src="/images/about/about-performance-italy.jpg"
                alt="Osman Meyredi performing live in Italy, black and white"
                width={1920}
                height={1071}
                sizes="(min-width: 1024px) 56rem, 92vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </Parallax>
      </Container>

      {/* A little much of everything */}
      <section className="py-24">
        <Container>
          <Reveal variant="text">
            <h2 className="font-display text-3xl">A little much of everything</h2>
            <p className="mt-6 leading-relaxed">
              Osman Meyredi moves between instruments and genres with ease, combining different
              influences into songs that feel personal, honest, and never quite predictable.
              What makes his work distinctive is that he can take different styles, instruments,
              and influences, and make them sound like they belong together.
            </p>
            <p className="mt-6 leading-relaxed">
              His story with music started before he had the language to explain it. When his
              uncle taught him the beginning of a Christmas song, but had to leave before
              finishing it, Osman completed the melody by ear, instinctively finding the missing
              notes. That moment felt as if music already belonged to him. Since then he would
              hear songs on the radio and find them back on the piano without reading a single
              note. To him, music was something he recognised, absorbed, and translated
              instinctively.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Two conservatories */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">
              Two conservatories, in Italy and in The Netherlands
            </h2>
            <p className="mt-6 leading-relaxed">
              In 2009 he finished a master&rsquo;s degree in double bass at the Trento
              Conservatory in Italy, the formal proof of years spent inside classical training
              and ensemble playing. But even then, the double bass was never the whole story. On
              the side, almost as easily as breathing, he was picking up drums, percussion,
              guitar, electric guitar, keyboards and synthesisers, absorbing instruments, the
              way some kids pick up a second language just from being around it.
            </p>
            <p className="mt-6 leading-relaxed">
              A decade later he completed a degree in Music Education at the Conservatory of
              Amsterdam, covering pedagogy, arrangement, band coaching, vocal performance, jazz
              piano and music production. Between the two degrees is basically his whole working
              life: one rooted in craft, the other in how craft gets passed on.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container wide>
        {/* Second About image — "Landscape black & white image with all
            instruments" per the Final About document. */}
        <Reveal variant="mask">
          <div className="media-zoom border border-line">
            <Image
              src="/images/about/about-multi-instrumentalist.jpg"
              alt="Osman Meyredi on stage surrounded by his instruments, black and white"
              width={1920}
              height={1071}
              sizes="(min-width: 1024px) 72rem, 96vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </Container>

      {/* On tour with Ike Willis */}
      <section className="py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">
              On tour with Ike Willis, Frank Zappa&rsquo;s band
            </h2>
            <p className="mt-6 leading-relaxed">
              He&rsquo;s most proud of his collaboration with Frank Zappa&rsquo;s band, going
              several times on tour with Ike Willis, Frank Zappa&rsquo;s longtime vocalist,
              before Willis&rsquo;s passing on May 16, 2026. Zappa&rsquo;s music punishes
              half-listening, and those nights, playing that repertoire alongside a singer
              who&rsquo;d lived inside it for decades, were as much a lesson in precision as
              they were in play.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Languages & availability */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">Languages &amp; availability</h2>
            <p className="mt-6 leading-relaxed">
              Osman Meyredi works in English, Italian and Dutch. He&rsquo;s based in Amsterdam,
              performs regularly in the Netherlands and Italy, and travels for concerts, events
              and productions across Europe and beyond.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <Link href="/shows/concerts" className="btn-pill">
                Upcoming concerts <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
              </Link>
              <Link href="/contact" className="btn-pill">
                Get in touch
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
