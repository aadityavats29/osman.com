# AI-Ready Foundation + SEO / AI Search Foundation — implementation ledger

Date: 11 September 2026 · Brief: `OSMAN_AI_READY_AND_SEO_FOUNDATION.md` (Parts A–N, §1–§55)

This pass adds **zero AI runtime**: no chatbot UI, no AI SDK, no API keys, no
model calls, no embeddings, no vector DB (§1/§10 — grep for `openai`,
`anthropic`, `gemini` returns nothing). It is a crawl/index, metadata,
structured-data and approved-knowledge foundation only.

---

## Part A — AI assistant foundation (no assistant)

| § | Delivered |
|---|---|
| 1–2 | Nothing AI-shaped ships. The "Ask About Osman" scope is documented in the policy file only. |
| 3 | `src/lib/knowledge/types.ts` — `ApprovedKnowledgeItem` exactly as specified, adapted to the existing repos (no second CMS). |
| 4 | `aiApproved` mechanism: a real Studio-managed boolean on the new Faq model (checkbox in the form), and a derived rule for existing types centralised in `normalise-content.ts` — releases require PUBLISHED **and** rights VERIFIED; demo/fixture events are never approved; drafts/archived never approved. A per-record column can be added to other models later without restructuring. |
| 5 | `priceGuidanceStatus` / `approvedPriceText` / `availabilityPolicy` fields on knowledge items. All services carry `CONTACT_FOR_QUOTE` + `CONTACT_TEAM`; no price text exists anywhere. |
| 6 | `src/lib/knowledge/get-approved-knowledge.ts` — `getApprovedKnowledge()`, `getKnowledgeItem(id)`, `getKnowledgeByType(type)` (+ `getAllKnowledgeItems()` for review/tests). Reads the same `getRepos()` the site renders from. Not connected to any model. |
| 7 | Every knowledge item carries a real `publicUrl` (`/services/...`, `/music#appears-on`, `/shows/gigs`, `/contact`, …). Unit-tested. |
| 8 | `src/lib/ai-ready/assistant-policy.ts` — non-runtime policy config: information-assistant identity, approved-corpus-only answers, never invent price/availability/credits, route uncertainty to `/contact`, cite source pages, no open-web search. |
| 9 | Performance architecture for the future assistant recorded in the policy file (`performance` block). The site has no dependency on it. |
| 10 | No vector DB. |

## Part B/C — crawl & index (Phase 1)

- **robots.txt** (`src/app/robots.ts`): production allows `*` plus explicit
  `Googlebot`, `Bingbot`, `OAI-SearchBot` groups; only `/studio` is
  disallowed. Preview deployments serve disallow-all. **GPTBot is not
  blocked** — no owner decision against training use was recorded; the
  file comments show the one-line opt-out if Osman/Jolene want it.
- **Canonical strategy** (`src/lib/site.ts`): one preferred host from
  `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → localhost.
  Today production canonicals resolve to `https://osman-com.vercel.app`
  (previously they pointed at `www.osmanmeyredi.com`, which still serves
  the old Wix site — that mis-canonicalisation is fixed). At domain
  cutover the Vercel production domain flips everything automatically;
  optionally pin `NEXT_PUBLIC_SITE_URL=https://www.osmanmeyredi.com`.
  Previews canonicalise **to production**, never the reverse (§21).
- **Sitemap** (`src/app/sitemap.ts`): force-dynamic, served from the live
  repositories; `lastmod` = newest `updatedAt` of the PUBLISHED records
  actually feeding each route (events → shows pages, releases+collabs →
  /music, videos → live-videos, media, products, faqs → /contact).
  Code-authored approved-copy pages (About, service pages) carry **no**
  lastmod rather than a fake per-deploy date (§18).
- **Wix → new-site redirects** (`next.config.ts`): the live Wix
  `pages-sitemap.xml` was pulled on 11-09 and contains exactly five URLs —
  `/`, `/about-eng`, `/about-3`, `/music-eng`, `/contact-eng`. All four
  non-home routes 308-redirect page-by-page (`/about-eng`→`/about`,
  `/about-3`→`/about`, `/music-eng`→`/music`, `/contact-eng`→`/contact`).
  308 is Next's permanent redirect — the same permanent signal as 301.
  **The redirect map covers the complete indexed old site.**
- **Preview de-indexing** (§21), three layers: `X-Robots-Tag: noindex,
  nofollow` header on every response (next.config, VERCEL_ENV≠production),
  `robots` metadata noindex per page (root layout), disallow-all robots.txt.
- **Search Console / Bing readiness** (§20): set `GOOGLE_SITE_VERIFICATION`
  and/or `BING_SITE_VERIFICATION` on Vercel and the meta verification tags
  render — no code change needed at verification time.
- **IndexNow** (§19): `src/lib/indexnow.ts` + key file route
  `/indexnow-key.txt` (serves `INDEXNOW_KEY`, 404 until set). Every Studio
  mutation now calls `publicContentChanged(kind)` (shared.ts), which
  revalidates the cache **and** submits only the affected canonical URLs —
  production-only, fire-and-forget via `after()`, failures swallowed.
  No key configured ⇒ silently off.

## Part D/E — metadata (Phase 2)

Every public route now has a unique title, description, self-canonical and
a **complete** per-page Open Graph object (`pageOpenGraph()` helper —
Next's metadata merge replaces `openGraph` wholesale, so each page carries
siteName/type/url/image). §23 recommended titles applied with one
verified correction: approved copy says **"Italian-born"**, so titles use
*Italian-Born*, not the brief's "Italian" (§23: verify descriptors).

- Home — `Osman Meyredi | Italian-Born Multi-Instrumentalist, Composer & Producer`
- About — `About Osman Meyredi | Italian-Born Multi-Instrumentalist in the Netherlands`
- Live Piano — `Live Pianist for Events in Amsterdam & the Netherlands | Osman Meyredi`
- Concerts — `Live Musician & Concert Performances | Osman Meyredi`
- Production — `Music Producer & Multi-Instrumentalist in the Netherlands | Osman Meyredi`
- Music — `Music by Osman Meyredi | Releases & Collaborations`
- Shows — `Osman Meyredi | Concerts & Upcoming Gigs`
- Live Videos — `Osman Meyredi Live | Performance Videos`
- Contact — `Book Osman Meyredi | Live Music, Piano & Music Production`
- Gigs / Shows-Concerts / Tickets / Media / Library / Services / Shop keep
  their existing unique titles (template-suffixed).

OG images are real site photographs per page (hero, About B&W, service
images, own-release artwork, video poster). Keyword intents map per §25
(identity → Home/About, piano → piano page, live booking → concerts page,
production → production page); the licensing page stays un-optimised (§25).
Descriptions extended only with verified geography ("Based in Amsterdam,
performing across the Netherlands, Italy and Europe").

## Part F — semantic content (Phase 3)

- Heading audit: every page keeps one H1 with logical H2/H3 (verified).
- Explicit identity copy already present (approved About sentence on Home
  + About); nothing rewritten (§51).
- Internal links added (§31, markup-only, approved wording untouched):
  About → `/music#collaborations` (the Ike Willis sentence), Live Videos →
  `/services/concerts` ("How a live booking works"), Media → `/about`
  (press-bio line). All other §31 links already existed.
- **Practical Q&A** (§30): new Studio content type end-to-end — Prisma
  `Faq` model + migration `20260911000000_faqs`, `FaqRecord`, zod
  `faqInput`, demo+Postgres repos, server actions, Studio CRUD at
  `/studio/faqs` ("Practical Q&A" in the nav), seed (create-only: Studio
  owns answers after first seed). Rendered on `/contact` as "The questions
  bookers ask first" with FAQPage JSON-LD. **Eight Q&As seeded, every
  answer composed strictly from approved live copy** (About, Concerts,
  Live Piano finals, contact page, approved instrument list) — sources
  annotated per item in `src/data/demo/content.ts`. ⚠️ *For Jolene/Osman
  review all the same; edit or unpublish any of them in Studio → Practical
  Q&A.* The unknown full-show technical rider is answered only by routing
  to Contact — no invented specifics.

## Part G/H — structured data (Phase 4)

- **Stable entity** (§32): `PERSON_ID = https://www.osmanmeyredi.com/#osman-meyredi`
  (pinned to the permanent domain; an @id is an identifier, not a link).
  Reused by every Person reference: Person on Home **and** About,
  `performer` on every MusicEvent, `byArtist`/`contributor` on albums,
  `about` on Articles.
- **Person** (§33): approved identity sentence as description, roles as
  jobTitle, birthPlace Italy ("Italian-born" — nationality deliberately
  NOT claimed), homeLocation Amsterdam, knowsLanguage EN/IT/NL, knowsAbout
  = approved instrument list + stated disciplines, alternateName "Ozzy
  Meyredi" (visible on the Falling for You billing), image = hero,
  sameAs = only the Studio-configured official profiles.
- **Music** (§34): albums keep real billing — non-own releases are billed
  to their primary artist with Osman as `contributor` only (unit-tested).
  Collaboration-attached releases (Highway Maintenance, Falling for You)
  now also emit MusicAlbum JSON-LD on /music. Artwork included; no ISRC/
  duration invented.
- **Events** (§35): MusicEvent upgraded — startDate/endDate as exact UTC
  instants via the site's venue-timezone helpers, performer @id ref,
  description/image where present, attendance mode, offers with InStock/
  SoldOut, EventCancelled state. Emitted for **upcoming** events only —
  past nights stay visible on the wall but are never marked up (§35).
- **Videos** (§36): VideoObject per published live video — name, approved
  description, real thumbnail (stored poster for the self-hosted file,
  i.ytimg still for YouTube), embedUrl/contentUrl. `uploadDate`/`duration`
  are unknown and therefore **never emitted** (no fabrication).
- **Breadcrumbs** (§37): BreadcrumbList on the four service pages and the
  three shows subpages — exactly the hierarchy their visible
  ServicesSubnav/ShowsSubnav already expresses; no invisible-only trails.
- **Validation** (§38): all 39+ emitted blocks parse as valid JSON and
  restate only visible page content (QA script + unit tests). Run Google's
  Rich Results Test on the deployed URLs post-deploy (manual, below).

## Part I — performance

No new scripts, no tag managers, no autoplaying media, no blocking
resources — the only additions to pages are `<script type="application/
ld+json">` blocks and metadata. Build output unchanged in character;
motion design untouched.

## Parts J/K/L — off-site, analytics, languages

Code-side: nothing to do — no analytics is installed (the Plausible hook
is dormant), so nothing discards `utm_source=chatgpt.com` (§46); when
analytics is added, keep that source visible and segment ChatGPT / Bing /
organic. No hreflang (no translated pages exist, §48). Off-site actions
(§42–§44: profile consistency, venue/festival backlinks) are for
Osman/Jolene — never change external profiles without approval.

## QA (Phase 6, sandbox)

- `tsc` clean · `eslint` clean · `vitest` **69/69** (50 existing + 19 new
  in `tests/seo-foundation.test.ts` + `tests/knowledge.test.ts`).
- `VERCEL=1 npm run build` clean; `next start` runtime checks: robots.txt
  serves all four bot groups + studio disallow; sitemap.xml serves live
  lastmod; `/about-eng` → 308 `/about`; `/indexnow-key.txt` 404s until a
  key exists; **all 16 public routes**: unique titles, unique
  descriptions, canonical, og:title + og:image, `robots: index, follow`,
  every JSON-LD block JSON-valid; billing spot-checked on all five
  published releases.
- Playwright: desktop shots of home/about/music/contact/live-videos/media
  + mobile contact — new FAQ section renders in the site's design
  language; no layout regressions.

## Acceptance criteria (Part N) — all pass

No chatbot · no AI dependency/key · no vector DB · one content system ·
no animation-only content · unique titles/descriptions everywhere ·
sitemap present · canonicals consistent (one env-driven host) · complete
Wix redirect map · previews noindex (3 layers) · OAI-SearchBot allowed ·
Studio noindex + disallowed · no fabricated event/video data · collab
releases never billed as Osman solo (tested) · no keyword stuffing (titles/
alt text factual) · no city doorway pages · no performance regression.

---

## Launch runbook — manual steps (Phase 7 + deploy)

1. **Push** `staging` (from Aditya's machine — sandbox/device cannot push).
2. **Migrate Neon**: `npx prisma migrate deploy` (adds the `Faq` table),
   then re-seed: `npx tsx prisma/seed.ts` (`SEED_DEMO_EVENTS=false` for
   launch). Seed adds the 8 Q&As create-only.
3. **Review the 8 Q&As** with Jolene/Osman in Studio → Practical Q&A;
   edit/unpublish freely. Tick off the AI-approved checkbox on anything
   the future assistant shouldn't quote.
4. **Env vars on Vercel** (all optional, each activates a feature):
   - `INDEXNOW_KEY` — any 32+ char hex string → IndexNow goes live.
   - `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` — meta-tag
     site verification.
   - `NEXT_PUBLIC_SITE_URL` — set to `https://www.osmanmeyredi.com` at
     domain cutover (or rely on the Vercel production-domain fallback).
5. **After the domain points at Vercel**: verify Google Search Console +
   Bing Webmaster Tools, submit `https://www.osmanmeyredi.com/sitemap.xml`
   in both, URL-inspect Home/About/Live Piano/Concerts, run Rich Results
   Test on Home (Person), /shows/gigs (Event), /shows/live-videos (Video),
   /contact (FAQ), then monitor indexing + CWV (§20/§55).
6. **GPTBot decision**: currently allowed. To block model-training crawls
   while keeping ChatGPT Search, add `{ userAgent: "GPTBot",
   disallow: "/" }` in `src/app/robots.ts`.
7. Delete `[DEMO]` events before launch (existing checklist) — they emit
   Event JSON-LD while published.

## Deviations / judgement calls (flagged for Aditya)

- §23 titles say "Italian-Born" (approved wording), not "Italian".
- §17 asks for 301s; Next `permanent: true` issues 308 (equivalent
  permanent signal; noted in next.config comments).
- GPTBot left allowed pending an owner decision (§12 makes it optional).
- Person `nationality` omitted — "Italian-born" is a birthplace fact.
- The FAQ answers are compositions of approved copy, not client-typed
  text — flagged above for review even though no new facts were added.
