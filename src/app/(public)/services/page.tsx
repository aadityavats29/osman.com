import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Services — Live shows, piano for events, production & music library",
  description:
    "Four ways to work with Osman Meyredi: live performances for festivals and venues, solo piano for events, music production from first idea to finished track, and a library of original tracks ready to license.",
  alternates: { canonical: "/services" },
};

/**
 * Services landing — Keynote 02-09-2026, slide 8. The four offerings with the
 * client-approved titles, subtitle chips and intro copy.
 */
export default function ServicesPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Services</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            Four ways to work with Osman
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Live performances built for festivals and venues, solo piano set to the tone of your
            event, original productions shaped in the studio, or ready-to-license tracks from his
            music library.
          </p>
        </Reveal>

        <div className="mt-16">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.slug}
              variant="card"
              delay={i * 90}
              className="group grid gap-4 border-t border-line py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] md:items-baseline md:gap-10"
            >
              <div>
                <h2 className="font-display text-2xl">
                  <Link
                    href={service.href}
                    className="inline-block transition-transform duration-300 ease-(--ease-out-cubic) group-hover:translate-x-1 hover:text-accent-strong"
                  >
                    {service.title}
                  </Link>
                </h2>
                <p className="tabular mt-2 text-xs tracking-[0.14em] text-ink-faint uppercase">
                  {service.subtitle}
                </p>
              </div>
              <p className="leading-relaxed text-ink-soft">{service.intro}</p>
              <Link
                href={service.href}
                className="u-link text-sm hover:text-accent-strong"
                aria-label={`${service.cta} — ${service.title}`}
              >
                {service.cta} <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
