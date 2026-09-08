# Implementation ledger — Precision pack (00–06), 2026-09-07

Source-of-truth findings recorded before coding:

- **Black Star agenda (live, inspected 07-09-2026 via browser):** Elementor loop
  grid of 22 entries — oversized DD/MM/YYYY date (Inter 900, right-aligned),
  venue line in grey (#8A8A8A), city smaller; future entries bright (#F6F6F6);
  past entries date line-through at ~60% alpha, venue/city faded. **No links, no
  images, no hover rules anywhere in the agenda entries** at inspection time.
  → Composition reproduced from the live reference; the mandatory photo+link
  interaction is built from brief 01 §6/§7 (fixed image-led preview + whole-row
  link), since the live site currently has no interaction to copy.
- **Contact mockup PDF:** heading, intro, 7 topic tiles + support lines, 8 role
  pills, Name/Email/Message copy, "Send to Osman Meyredi". Beige palette ignored
  per Keynote slide 2 ("Ignore colors — Look & Feel according to the website!").
- **Technical brief (Pages):** static contacts (Management Jolene / Bookings /
  General / Osman direct), backend-only routing table, role always in email body,
  honeypot-vs-captcha left open (resolved by brief 05: honeypot), info@ display
  question (resolved by brief 04 §5: display it).
- **Verified facts:** Ike Willis b. 12 Nov 1955, d. 16 May 2026 (JamBase) →
  memorial "1955–2026". ZAPPATiKA line-ups: 2016 (HCTF) "Osman Meyredi (ITA):
  keyboards & vocals", joined 2016; 2020 (HCTF) "Before The Shit Hit The Fan —
  Live in the U.K." billed **Ike Willis & Zappatika**, recorded Oct 2019
  "Music Is The Best" tour, "Osman Meyredi: Keyboards".
- **Friends/ZAPPATiKA poster claim:** timeline conflict confirmed by briefs —
  internal research note only, verificationStatus PENDING, never rendered.

| ID | Requirement | Source | Implementation | Test |
|---|---|---|---|---|
| A1 | Event fields: image+alt+credit+rights, ticketingType, new event types, isDemo, timezone, CTA override | 01 §10, 03 §4 | Prisma migration + types + repos + zod | migration on scratch PG; unit build |
| A2 | Release ownership: relationshipType, primaryArtistName, osmanCredit, label, catalogue, artworkCredit, rightsStatus, sourceUrl | 02 §13 | same | classified seeds render distinctly |
| A3 | Collaboration model incl. memorial + verification + internal notes | 02 §10/§17, 03 §9 | new table + repos + seed ZAPPATiKA | studio CRUD + public page |
| A4 | Past/future derived from datetime, Europe/Amsterdam, end-time aware | 01 §5 | lib/events tz-aware refactor | vitest cases |
| B1 | Agenda composition: oversized dates DD/MM/YYYY, venue/city, dark, asymmetric, no cards/buttons | 01 §3, live ref | new /shows/gigs page | screenshots desktop+mobile |
| B2 | Past = struck + muted, retained | 01 §4 | agenda styles | screenshot + DOM check |
| B3 | Photo interaction: hover/focus preview, clean transitions, no layout jump, preload nearby, no FPS cost | 01 §6/§14 | shared preview controller, transform-only | Playwright hover/focus + perf suite |
| B4 | Whole event = link when URL; no fake link otherwise; rel noopener; cursor TICKETS/DETAILS/OPEN/none | 01 §7/§8 | AgendaRow + eventCta rework | DOM assertions |
| B5 | Mobile: single tap target, inline image reveal, no hidden hover dependency | 01 §6 | responsive layout | 390px screenshots |
| B6 | Demo records (6 future + 3 past) with isDemo, Studio-editable, not hardcoded | 01 §9 | seed/demo content + placeholder images | Studio list shows Demo chip |
| C1 | Music layers: Own Releases / Appears On / Collaborations, unmistakable labels | 02 §1/§3 | /music restructure | rendering test 3 types |
| C2 | ZAPPATiKA feature under Collaborations, archival tone, verified facts only | 02 §4/§5 | collaboration page/section | copy audit |
| C3 | Ike Willis memorial: restrained end-title, no CTA | 02 §6 | memorial panel | screenshot |
| C4 | Friends claim unpublished; Studio holds internal note PENDING | 02 §7–10 | collaboration record fields | public page grep |
| C5 | Homepage: small COLLABORATIONS & PROJECTS teaser; correct billing on featured | 02 §2/§15 | home tweaks | screenshot |
| C6 | First solo vinyl readiness: Draft OWN_RELEASE possible, centerpiece treatment | 02 §17 | own-releases section handles empty/featured | studio draft flow |
| D1 | Studio events manager: columns, filters, image+credit fields, validation, human messages | 03 §3/§4, 01 §11/§12 | EventForm + list rework | CRUD pass |
| D2 | Relationship-first release form; per-type required fields; ownership confirmation before publish | 03 §5–8/§14 | ReleaseForm rework | publish gate tests |
| D3 | Collaborations manager with rights/verification gates | 03 §9–11 | new studio section | CRUD + gate tests |
| D4 | Credit preview + "Credit required before publication" | 03 §13 | form UI | manual check |
| D5 | No raw enums/IDs/JSON for Osman | 03 §20 | friendly labels | UI audit |
| E1 | Contact page: exact heading/intro/tiles/pills/fields/submit; static contacts; dark system | 04 §3–13, PDF | new contact page + form | line-by-line vs PDF |
| E2 | info@ displayed publicly | 04 §5 | static contacts block | rendered |
| E3 | Routing table exact; role never routes; multi-recipient single send | 05 §5/§18 | contactDelivery rework | unit tests all 7 topics |
| E4 | Honeypot (no visible CAPTCHA), server validation + limits, replyTo visitor, verified-domain From, no leakage | 05 §1/§9–§11/§17/§19 | schema + delivery | unit + manual |
| E5 | Subject "[Osman Website] Topic — Name"; body: category/role/name/email/message/timestamp(Amsterdam)/page URL | 05 §14/§15 | delivery formatting | unit snapshot |
| E6 | Error keeps typed message; disabled submit while sending | 04 §16/§17 | form states | Playwright |
| F1 | Motion/cursor/menu regression + perf (no per-event RAF) | 06 §8/§9, 01 §14 | reuse nav-qa + new checks | suites pass |
| F2 | Accessibility: keyboard through agenda/topics/roles/form; radio semantics; reduced motion | 01 §16, 04 §19 | semantics + focus styles | keyboard pass |
| F3 | A–H final report | 06 §19 | report | delivered |

## Closure (all rows tested — 2026-09-07)

Every row above is DONE and verified: 50 unit tests (events tz/CTA/agenda-link,
publish gates, routing matrix all 7 topics, subject/body format), 43-check
public QA + corrected interaction subset (preview hover/focus/crossfade/
no-photo/portal anchoring), 16-check Studio QA (login, demo chips, thumbnails,
5-kind form, credit gate blocking publish, ZAPPATiKA record with internal
PENDING Friends note, memorial fields, relationship-first release form, billing
confirmation gate), 23-check motion regression (cursor/vinyl/menu/records
unchanged), mobile sweep at 390px (no overflow; inline agenda images; preview
layer disabled on touch).

Known conflicts resolved (priority ladder file 06 §2): "Upcoming Gigs" naming
restored per pack 01 over the earlier slide-15 "Upcoming Shows" rename, on all
surfaces; the agenda page's subtitle replaced (it now spans ticketed + free +
festival events, so the free-entry-only line stays on the Shows landing
section). The live Black Star agenda carries no links/photos today, so the
interaction was built to pack 01 §6–§8 with the composition taken from the
live reference. Remind-me (.ics) links stay on the Shows landing/Concerts/
Tickets listings; the agenda keeps each event as one unified link per §7.

Deferred (reported as blockers/user steps): Neon migrate+seed re-run;
Resend domain verification + env (RESEND_API_KEY, CONTACT_FROM_EMAIL,
optional CONTACT_RECIPIENTS_OVERRIDE); production-URL email test; media
library as a separate reusable asset store (credits are stored per record
instead — attribution rules still enforced at publish time); standalone/Docker
serving quirk (turbopack chunk map: client-side nav into /contact 500s under
`node .next/standalone/server.js`; Vercel and `next start` are unaffected).
