import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/public/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Book Osman Meyredi for a concert, coaching or a workshop — or get in touch about press, collaborations and sessions. Replies come from Osman himself.",
  alternates: { canonical: "/contact" },
};

const VALID_TYPES = new Set([
  "PERFORMANCE_BOOKING",
  "COACHING",
  "WORKSHOP",
  "PRESS_MEDIA",
  "COLLABORATION_SESSION",
  "GENERAL",
]);

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
  const initialType = typeParam && VALID_TYPES.has(typeParam) ? typeParam : undefined;

  const settings = await getRepos().settings.get();
  const socials = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "YouTube", href: settings.youtubeUrl },
    { label: "TikTok", href: settings.tiktokUrl },
    { label: "Facebook", href: settings.facebookUrl },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Tell Osman about it
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              A concert to book, a band to coach, a team to bring together, an article to write
              — start here. A few honest sentences beat a perfect brief.
            </p>
            <div className="mt-12">
              <ContactForm initialType={initialType} contactEmail={settings.contactEmail} />
            </div>
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-10">
            <h2 className="eyebrow">Prefer email?</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Write directly, in English, Italian or Dutch:
            </p>
            <p className="mt-2">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-sm underline underline-offset-4"
              >
                {settings.contactEmail}
              </a>
            </p>

            {socials.length > 0 && (
              <div className="mt-10">
                <h2 className="eyebrow">Elsewhere</h2>
                <ul className="mt-4 space-y-2.5">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener"
                        className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}
