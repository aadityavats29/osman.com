import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { CONTACT_TOPICS } from "@/lib/validation/schemas";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Tell Osman Meyredi about it — bookings, live piano, production, licensing, collaborations and press. Direct contacts for management and bookings, or one structured form for everything else.",
  alternates: { canonical: "/contact" },
};

/**
 * Contact — precision pack 04 + technical brief + mockup.
 *
 * Two complementary ways in, never merged: role-based direct addresses for
 * people who already know whom they need (management / bookings / general /
 * Osman direct — the Xavier Rudd reference translated into this dark
 * system), and one structured form for everyone else. info@ is displayed
 * publicly (04 §5). Routing happens server-side from the selected topic.
 */
const DIRECT_CONTACTS: Array<{ role: string; person?: string; email: string }> = [
  { role: "Management", person: "Jolene Prins", email: "jolene@osmanmeyredi.com" },
  { role: "Bookings", email: "bookings@osmanmeyredi.com" },
  { role: "General", email: "info@osmanmeyredi.com" },
  { role: "Osman (direct)", email: "osman@osmanmeyredi.com" },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
  const initialTopic = (CONTACT_TOPICS as readonly string[]).includes(typeParam ?? "")
    ? typeParam
    : undefined;

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
        <Reveal variant="text">
          <p className="eyebrow">Contact</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Tell Osman Meyredi about it
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            A concert to book, a festival to organise, an event to dress, an article to write,
            a radio programme to fill? A few honest sentences beat a perfect brief.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-16 lg:grid-cols-[1fr_2.2fr]">
          {/* Direct contacts — for people who already know whom they need. */}
          <Reveal variant="card" delay={90}>
            <aside aria-label="Direct contacts">
              <h2 className="eyebrow">Straight to the right person</h2>
              <ul className="mt-5">
                {DIRECT_CONTACTS.map((c) => (
                  <li key={c.email} className="border-t border-line py-4 last:border-b">
                    <p className="tabular text-xs tracking-[0.16em] text-ink-faint uppercase">
                      {c.role}
                    </p>
                    {c.person && <p className="mt-1 text-sm text-ink">{c.person}</p>}
                    <p className="mt-0.5">
                      <a
                        href={`mailto:${c.email}`}
                        className="u-link text-sm text-ink-soft hover:text-accent-strong"
                        data-cursor="MAIL"
                      >
                        {c.email}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                Write in English, Italian or Dutch.
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
                          className="u-link text-sm text-ink-soft hover:text-ink"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </Reveal>

          {/* The form — for everyone else. */}
          <Reveal variant="text" delay={130}>
            <ContactForm initialTopic={initialTopic} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
