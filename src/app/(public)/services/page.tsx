import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services — Concerts, Coaching & Workshops",
  description:
    "Work with Osman Meyredi: book a concert or live performance, band coaching built on listening, or a music-based listening and collaboration workshop for your team.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = (await getRepos().services.list())
    .filter((s) => s.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Services</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            Three ways to work with Osman
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            A concert shaped around your occasion, coaching that makes a band listen to itself,
            or a workshop that lets a team experience collaboration through music.
          </p>
        </Reveal>

        <div className="mt-16">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              variant="card"
              delay={i * 90}
              className="group grid gap-4 border-t border-line py-10 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-10"
            >
              <h2 className="font-display text-2xl">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-block transition-transform duration-300 ease-(--ease-out-cubic) group-hover:translate-x-1 hover:text-accent-strong"
                >
                  {service.title}
                </Link>
              </h2>
              <p className="leading-relaxed text-ink-soft">{service.shortDescription}</p>
              <Link
                href={`/services/${service.slug}`}
                className="u-link text-sm hover:text-accent-strong"
                aria-label={`Read more about ${service.title}`}
              >
                Read more <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-4 border-t border-line pt-8 text-sm text-ink-soft">
          Looking for tickets to an upcoming show instead?{" "}
          <Link href="/shows" className="u-link">
            See Shows
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
