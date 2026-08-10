import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { formatEventDate } from "@/lib/events";
import { JsonLd, articleJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media & Press",
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
        <p className="eyebrow">Media</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Press</h1>

        {featured ? (
          <article className="mt-16 border-t border-line pt-10">
            <JsonLd data={articleJsonLd(featured)} />
            <p className="eyebrow">{featured.publication}</p>
            <h2 className="font-display mt-4 max-w-3xl text-3xl leading-tight sm:text-4xl">
              {featured.headline}
            </h2>
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
                className="inline-block border border-ink px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-ink hover:text-canvas"
              >
                Read the article
              </a>
            </p>
          </article>
        ) : (
          <p className="mt-16 border-t border-line pt-8 text-ink-soft">
            Press coverage will be collected here.
          </p>
        )}

        {rest.length > 0 && (
          <ul className="mt-20">
            {rest.map((item) => (
              <li key={item.id} className="border-t border-line py-8">
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
                    className="text-sm underline underline-offset-4 hover:text-accent-strong"
                  >
                    Read the article
                  </a>
                </p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-20 border-t border-line pt-8 text-sm text-ink-soft">
          Press inquiries:{" "}
          <a
            href={`mailto:${settings.contactEmail}`}
            className="underline underline-offset-4"
          >
            {settings.contactEmail}
          </a>
        </p>
      </Container>
    </section>
  );
}
