import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { CONTACT_TOPICS } from "@/lib/validation/schemas";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { SocialIconLinks, socialLinks } from "@/components/public/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Tell Osman Meyredi about it — bookings, live piano, production, licensing, collaborations and press. Direct contacts for management and bookings, or one structured form for everything else.",
  alternates: { canonical: "/contact" },
};

/**
 * Contact — precision pack 04 + Round 2 Keynote slides 18–19.
 *
 * Two complementary ways in, never merged: role-based direct addresses for
 * people who already know whom they need, and one structured form for
 * everyone else. Round 2 changes: Osman's direct address is no longer shown
 * publicly (strict email rule — topic routing still reaches him server-side),
 * the MANAGEMENT/BOOKINGS/GENERAL labels are quieter so the addresses lead,
 * each column states plainly who it is for (the Xavier Rudd clarity idea),
 * and the language line reads "Write in Italian, English or Dutch."
 */
const DIRECT_CONTACTS: Array<{ role: string; person?: string; email: string }> = [
  { role: "Management", person: "Jolene Prins", email: "jolene@osmanmeyredi.com" },
  { role: "Bookings", email: "bookings@osmanmeyredi.com" },
  { role: "General", email: "info@osmanmeyredi.com" },
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
  const socials = socialLinks(settings);

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
          {/* Direct contacts — for people who already know whom they need.
              Round 2 slide 18: role labels sit quiet under the addresses so
              the emails lead; a red rule + plain sentence marks the column's
              purpose against the form column. */}
          <Reveal variant="card" delay={90}>
            <aside aria-label="Direct contacts">
              <h2 className="border-l-2 border-accent pl-3 font-display text-lg leading-snug">
                Know who you need?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                Email them directly.
              </p>
              <ul className="mt-6">
                {DIRECT_CONTACTS.map((c) => (
                  <li key={c.email} className="border-t border-line py-4 last:border-b">
                    <p>
                      <a
                        href={`mailto:${c.email}`}
                        className="u-link text-sm text-ink hover:text-accent-strong"
                        data-cursor="MAIL"
                      >
                        {c.email}
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">
                      {c.role}
                      {c.person ? ` — ${c.person}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                Write in Italian, English or Dutch.
              </p>

              {socials.length > 0 && (
                <div className="mt-10">
                  <h2 className="eyebrow">Elsewhere</h2>
                  <SocialIconLinks links={socials} className="mt-4" />
                </div>
              )}
            </aside>
          </Reveal>

          {/* The form — for everyone else. */}
          <Reveal variant="text" delay={130}>
            <div>
              <h2 className="border-l-2 border-accent pl-3 font-display text-lg leading-snug">
                Not sure who to write to?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                Use the form — your message lands with the right person.
              </p>
              <div className="mt-6">
                <ContactForm initialTopic={initialTopic} />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
