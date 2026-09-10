import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import type { ReleaseRecord } from "@/lib/types";
import { JsonLd, musicAlbumJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Discography } from "@/components/public/Discography";
import { CollaborationFeature } from "@/components/public/CollaborationFeature";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music — Own releases, appearances & collaborations",
  description:
    "Osman Meyredi's music in three clear layers: his own releases, records he appears on, and collaborations & band projects — including ZAPPATiKA with Frank Zappa's longtime vocalist Ike Willis.",
  alternates: { canonical: "/music" },
};

/**
 * Music — precision pack 02 §1/§21. Three explicit ownership layers so a
 * visitor can never mistake a record Osman contributed to for a solo release:
 * Own Releases → Appears On → Collaborations & Band Projects (with the
 * ZAPPATiKA feature and the Ike Willis dedication), closing on the licensing
 * library. Rendering guard: DO_NOT_PUBLISH rights never reach the page.
 */
export default async function MusicPage() {
  const repos = getRepos();
  const [allReleases, allCollaborations] = await Promise.all([
    repos.releases.list(),
    repos.collaborations.list(),
  ]);

  const published = allReleases
    .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const own = published.filter((r) => r.relationshipType === "OWN_RELEASE");
  const appearsOn = published.filter((r) => r.relationshipType === "CONTRIBUTING_ARTIST");
  const collabReleases = published.filter(
    (r) => r.relationshipType === "COLLABORATION_RELEASE"
  );

  const collaborations = allCollaborations
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const releasesFor = (slug: string): ReleaseRecord[] =>
    collabReleases.filter((r) => r.collaborationSlug === slug);
  const unattached = collabReleases.filter(
    (r) => !r.collaborationSlug || !collaborations.some((c) => c.slug === r.collaborationSlug)
  );

  return (
    <>
      <section className="py-24 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Music</p>
            {/* Round 2 slide 21: new heading + intro, verbatim. */}
            <h1 className="display-caps mt-4 text-5xl sm:text-7xl">Every Record, Marked</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Osman Meyredi&rsquo;s own releases, the records he appears on, and the band
              projects he&rsquo;s been part of, each one clearly marked, because who played
              what, and who made a record, matters.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 1 — Own releases */}
      <section id="own-releases" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
        <Container wide>
          <Reveal variant="text">
            <p className="tabular inline-block border border-accent-strong px-2.5 py-1 text-[11px] tracking-[0.16em] text-accent-strong uppercase">
              Own releases
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl">Osman Meyredi</h2>
          </Reveal>
          <div className="mt-8">
            {own.length > 0 ? (
              <>
                {own.map((r) => (
                  <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
                ))}
                <Discography releases={own} />
              </>
            ) : (
              <Reveal variant="text" delay={100}>
                <p className="max-w-xl border-t border-line pt-6 leading-relaxed text-ink-soft">
                  Osman&rsquo;s first release under his own name — a solo vinyl — is in the
                  works. When it lands, this is where it will live. Until then, hear him on the
                  collaborations below.
                </p>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* 2 — Appears on */}
      {appearsOn.length > 0 && (
        <section id="appears-on" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
          <Container wide>
            <Reveal variant="text">
              <p className="tabular inline-block border border-line-dark px-2.5 py-1 text-[11px] tracking-[0.16em] text-ink-soft uppercase">
                Appears on
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                Records by other artists with Osman in a credited role — always billed to the
                artists who made them.
              </p>
            </Reveal>
            <div className="mt-8">
              {appearsOn.map((r) => (
                <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
              ))}
              <Discography releases={appearsOn} />
            </div>
            {appearsOn.some((r) => r.slug === "keep-your-eye-on-the-sparrow-special-45") && (
              <p className="mt-4">
                {/* Client-requested visible production note (10-09-2026). */}
                <span className="pending-note">
                  Special 45 cover — waiting for Varsha&rsquo;s high-res version
                </span>
              </p>
            )}
          </Container>
        </section>
      )}

      {/* 3 — Collaborations & band projects */}
      <section id="collaborations" className="scroll-mt-24 border-t border-line">
        <Container wide>
          <Reveal variant="text">
            <div className="py-16 sm:py-20">
              <p className="eyebrow">Collaborations &amp; projects</p>
              <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
                Band projects and recurring collaborations
              </h2>
            </div>
          </Reveal>
        </Container>
        {collaborations.map((collaboration) => (
          <CollaborationFeature
            key={collaboration.id}
            collaboration={collaboration}
            releases={releasesFor(collaboration.slug)}
          />
        ))}
        {unattached.length > 0 && (
          <Container className="pb-16">
            <div className="mt-4">
              {unattached.map((r) => (
                <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
              ))}
              <Discography releases={unattached} />
            </div>
          </Container>
        )}
      </section>

      {/* 4 — Licensing library — Round 2 slide 24 "Change into", verbatim. */}
      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <p className="max-w-2xl leading-relaxed text-ink-soft">
              Looking for original tracks to license for film, TV or events? Osman&rsquo;s{" "}
              <Link href="/services/music-library" className="u-link">
                Music Library
              </Link>{" "}
              is composed, produced and performed entirely by him, cleared and ready to use.
              Got something more specific in mind? Osman also writes and produces custom tracks
              on request, for documentaries, films, radio programmes, you name it. Give him the
              brief and the genre, and he&rsquo;ll build the track around it.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
