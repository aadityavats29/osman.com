import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { formatEventDate } from "@/lib/events";
import { JsonLd, articleJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media — As Seen & Heard",
  description:
    "Press coverage, reviews and interviews featuring Osman Meyredi — and how to reach him for press inquiries.",
  alternates: { canonical: "/media" },
};

export default async function MediaPage() {
  const repos = getRepos();
  const [items, settings] = await Promise.all([repos.media.list(), repos.settings.get()]);
  const published = items
    .filter((m) => m.status === "PUBLISHED")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const featured = published.find((m) => m.featured) ?? published[0] ?? null;
  const rest = published.filter((m) => m !== featured);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Media</p>
          {/* Round 2 slide 25: the client's new heading for this page. */}
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            As Seen &amp; Heard
          </h1>
        </Reveal>

        {featured ? (
          <article className="mt-16 border-t border-line pt-10">
            <JsonLd data={articleJsonLd(featured)} />
            <Reveal variant="text">
              <p className="eyebrow">{featured.publication}</p>
              <h2 className="font-display mt-4 max-w-3xl text-3xl leading-tight sm:text-4xl">
                {featured.headline}
              </h2>
            </Reveal>
            <Reveal variant="text" delay={120}>
              {featured.date && (
                <p className="tabular mt-3 text-sm text-ink-faint">
                  {formatEventDate(featured.date).full}
                </p>
              )}
              {featured.summary && (
                <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">{featured.summary}</p>
              )}
              <p className="mt-7">
                <a
                  href={featured.articleUrl}
                  target="_blank"
                  rel="noopener"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  {featured.articleUrl.startsWith("/") ? "View the article scan" : "Read the article"}{" "}
                  <span className="arrow-nudge" aria-hidden="true">→</span>
                </a>
              </p>
            </Reveal>
          </article>
        ) : (
          <p className="mt-16 border-t border-line pt-8 text-ink-soft">
            Press coverage will be collected here.
          </p>
        )}

        {rest.length > 0 && (
          <ul className="mt-20">
            {rest.map((item, i) => (
              <li key={item.id} className="border-t border-line py-8">
                <Reveal variant="card" delay={Math.min(i * 80, 160)}>
                  <JsonLd data={articleJsonLd(item)} />
                  <p className="eyebrow">{item.publication}</p>
                  <h2 className="font-display mt-2 text-2xl leading-snug">{item.headline}</h2>
                  {item.date && (
                    <p className="tabular mt-2 text-sm text-ink-faint">
                      {formatEventDate(item.date).full}
                    </p>
                  )}
                  {item.summary && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                      {item.summary}
                    </p>
                  )}
                  <p className="mt-4">
                    <a
                      href={item.articleUrl}
                      target="_blank"
                      rel="noopener"
                      className="u-link text-sm hover:text-accent-strong"
                    >
                      {item.articleUrl.startsWith("/") ? "View the article scan" : "Read the article"}{" "}
                      <span className="arrow-nudge" aria-hidden="true">→</span>
                    </a>
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        {/* On screen — Round 2 slide 32 / brief §45: film appearances live on
            the Media page, kept separate from music. Exact client-supplied
            titles, years, directors and casts; no timestamps or scene claims
            (unknown), and no film stills until approved imagery exists. */}
        <section className="mt-20 border-t border-line pt-10" aria-labelledby="on-screen">
          <Reveal variant="text">
            <h2 id="on-screen" className="eyebrow">
              On screen
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              Osman Meyredi appeared as an extra in three films.
            </p>
          </Reveal>
          <ul className="mt-6">
            {[
              {
                title: "La Foresta di Ghiaccio",
                year: "2014",
                detail:
                  "Directed by Claudio Noce, with Emir Kusturica, Ksenia Rappoport, Domenico Diele, Adriano Giannini",
              },
              {
                title: "Lezione Ventuno",
                year: "2008",
                detail:
                  "Directed by Alessandro Baricco, with Noah Taylor, Leonor Watling, Clive Russell, John Hurt",
              },
              {
                title: "Vincere",
                year: "2009",
                detail: "Directed by Marco Bellocchio, with Giovanna Mezzogiorno, Filippo Timi",
              },
            ].map((film, i) => (
              <li key={film.title} className="border-t border-line py-5">
                <Reveal variant="card" delay={Math.min(i * 80, 160)}>
                  <p className="font-display text-xl leading-snug">
                    {film.title} <span className="text-ink-faint">({film.year})</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{film.detail}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-20 border-t border-line pt-8 text-sm text-ink-soft">
          Press inquiries:{" "}
          <a href={`mailto:${settings.contactEmail}`} className="u-link">
            {settings.contactEmail}
          </a>
        </p>
      </Container>
    </section>
  );
}
