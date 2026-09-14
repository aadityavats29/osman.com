# Feedback Round 2 — implementation ledger (10-09-2026)

Sources: `OSMAN_FEEDBACK_ROUND_2_STRICT_EXECUTION.md` (59 sections, split pack 00–09) +
`Feedback OsmanMeyredi_2.key` (33 slides, read via the .pptx export and the original .key).
Master folder: `/Users/adityavats/Library/Mobile Documents/com~apple~CloudDocs/Osmanmeyredi.com`
(referred to below as `MASTER`; the numbered site folders live under `MASTER/Website/Website `).

## Asset & content manifest (§5)

| Item | Page | Source used | Verified |
|---|---|---|---|
| Landing hero (landscape) | Home | `MASTER/Website/Website /09. Images Osman/Landingpage image.png` (1672×941) | Yes |
| Horizontal logo | header/menu | `MASTER/Osman Meyredi _Horizontal White.png` → traced to `public/images/logo-horizontal.svg` | Yes |
| Role list | Home | Slide 2 verbatim: ARTIST · MULTI-INSTRUMENTALIST · PRODUCER · MUSIC DIRECTOR · COMPOSER · SONGWRITER · SINGER (Singer kept — it fits in two rows) | Yes |
| About content | About + Home teaser | `MASTER/…/02.About/Text/Final About Content.pages` (verbatim; "Oman"→"Osman" typo corrected, flagged) | Yes |
| About image 1 | About | `MASTER/…/02.About/Images/Osman_PerformanceIItaly_HighRes.jpg` | Yes |
| About image 2 (landscape, all instruments) | About | `MASTER/…/02.About/Images/Osman Multi-instrumentalist HighRes.jpg` | Yes |
| Contact language line | Contact | Slide 19: "Write in Italian, English or Dutch." | Yes |
| Contact email rules | site-wide | Slide 31/§14: `osman@` block removed from Contact; `settings.contactEmail` → info@osmanmeyredi.com (footer, menu, Media) | Yes |
| Own release | Music | Slide 21 Spotify link → "Dance With This Mess", Osman Meyredi, 2021-11-14; official single artwork from the release's Spotify listing (no local original exists) | Yes |
| Vinyl 1 — Keep Your Eye on the Sparrow | Music (Appears On) + Home shelf | Cover `MASTER/…/04. Music/Collaboration/DISCO SPARKS….jpg`; album link from the Collaboration pages doc; credit "bass" read off the 45's label | Yes |
| Vinyl 2 — Highway Maintenance | Music (ZAPPATiKA) + Home | Cover `…/IKE WILLIS & ZAPPATIKA - Highway Maintenance .png`; album link from pages doc | Yes |
| Vinyl 3 — Falling for You | Music (new collaboration) + Home | Cover `…/KASSKO, OZZY MEYREDI, STEPHANIE LAURENCE - Falling For You.png` (the Good Things Take Time white label); track link from pages doc; metadata verbatim from slide 23 | Yes |
| Vinyl 4 — Sparrow Special 45 | Music (Appears On) | Label photo inside `…/OverviewALBUM (COLLABORATIONS).pages/Data/PHOTO-2026-09-09-19-52-24-32.jpg` (square-crop, label intact); track link from pages doc; visible "waiting for Varsha — high-res" note | Yes (interim art) |
| Band image | Music (ZAPPATiKA feature) | `MASTER/…/09. Images Osman/Osman Zappatika Band_UK.jpg` (identified by the Finder screenshot on slide 22) | Yes |
| Memorial | Music (under ZAPPATiKA, not Kassko) | Slide 24 dates "12 November 1955 – 16 May 2026" | Yes |
| Concerts copy | /services/concerts | `MASTER/…/05. Services/Concert & Live Performances/Concerts & Live performances  .pages` (verbatim; one red line = the tickets note) | Yes |
| Concerts image | /services/concerts | `…/Live concert_landscapeHR.jpeg` (B&W, the version embedded on slide 13) + visible "waiting for Varsha — colour version" note (Aditya 10-09) | Yes |
| Live Piano copy + image | /services/piano-for-events | `…/05. Services/Live Piano Concerts/Live Piano for Events .pages` + `Rome Airport Performance 2025.jpg` (approved temporary image) | Yes |
| Music Production copy + 2 images | /services/music-production | `…/05. Services/Music Production/Music Production.pages` + `Osman_Studio_highres.jpg` + `Osman ZAPPATIKA'S REHEARSALS 2018 (2).jpeg`; CTA moved below the content | Yes |
| Original Tracks & Music Library | /services/music-library | `…/05. Services/Original Tracks & Music Library/Original Tracks & Music Library.pages` (verbatim; "good change"→"chance" corrected, flagged); final name from slides 10/17/31 | Yes |
| Amsterdam Wine Festival | Shows | Slide 20: title, Sunday 6 Sep 2026 18:00–19:00, Main Stage, festival URL — stays on the wall struck-through as past | Yes |
| Live-video descriptions | /shows/live-videos | Slides 26–28 verbatim (showreel incl. Ponte Caffaro/Blue Lou Marini; Andrew Laureth; DonCameleon at Belushi's; Turbo Trouble "on double bass"; Santo Stefano residency) | Yes |
| Shows-folder video | /shows/live-videos | `MASTER/…/03. Shows/Website Landscape.mp4` (Aditya confirmed 10-09) — transcoded 4K→1080p H.264 (19 MB), self-hosted `public/videos/website-landscape.mp4` | Yes |
| Old-site video | — | Retrieved the exact current old-site homepage video from Wix (10 s abstract vinyl-wave loop, media id `11062b_c18db2b1461b46f2ad31bae61009fee1`). It does NOT match the Keynote screenshot; the pictured crowd footage is inside Website Landscape.mp4. Aditya (10-09): drop the separate card — covered. | Yes (resolved) |
| Reserved video slot | /shows/live-videos | §37 — dashed slot, visible "Reserved · next video coming soon" label (visible labels approved by Aditya 10-09) | Yes |
| Closing conversion | /shows/live-videos | Slide 30 verbatim: "You just watched it, now book it." + copy + Book Osman Meyredi | Yes |
| Media addition | /media | `MASTER/…/06. Media/Newspaper Scan.jpeg` — Corriere del Trentino, 5 March 2017, "Da Tione fino ad Amsterdam — «Suono e seguo il mio istinto»", Veronica Pederzolli; scan vendored + linked | Yes |
| Media heading | /media | Slide 25 "As Seen & Heard" | Yes |
| Media email | /media | info@osmanmeyredi.com (Aditya 10-09; press@ not created) | Yes |
| Film appearances | /media "On screen" | Slide 32 verbatim (3 films, directors, casts; no stills, no timestamps) | Yes |
| Footer naming | site-wide | Slide 31: "Music Library becomes Original Tracks & Music Library" (footer, menu, services index) | Yes |
| Route-loading cue | global | Slide 1/§42: RouteLoadingCue — header vinyl spins + accent hairline sweep while a route loads; CSS-only, no artificial delay | Yes |
| Back to Services + discoverability | services pages | §43–44: ServicesSubnav on all four service pages (All services + siblings incl. Original Tracks & Music Library) | Yes |

## Round 2 decisions (design/UX — §56 questions answered by implementation)

- Landing: adele.com-style image-led hero — roles + CTAs above a full-bleed landscape image; the h1 stays for accessibility but is visually hidden (slide 2: logo carries the identity).
- Services return path: a Shows-style subnav row on every service page (works on mobile, one-click back to All services, makes Original Tracks & Music Library permanently visible — §44).
- Route feedback: the site's own vinyl motif answers the click (header record spins up) plus a hairline sweep; removed the moment the new route renders.
- Film appearances: Media page section "On screen", exactly as §45 recommends.
- Media contact: info@ (per strict rule + Aditya), press@ not invented.
- Falling for You is both a Collaboration feature (client metadata verbatim) and a release row with the white-label artwork, billed "Kassko, Ozzy Meyredi, Stephanie Laurence" exactly as the artwork credits it (§33: original billing preserved).
- "Before the Shit Hit the Fan" set to DRAFT: not among the four enumerated vinyls and has no proper cover; Round 2 bans generated sleeves. Restore in the Studio when real artwork exists.
- Sparrow Special 45 artwork: the label photo from the pages doc (the only original in the folder), square-cropped without touching the label; visible pending note until Varsha's high-res arrives.
- Santo Stefano: the fuller "three-month residency" wording of the two variants on slide 28.
- Old two-line logo trace (public/images/logo.svg) and the previous hero/about photos remain on disk but are unused.

## Corrections / divergences flagged (not silently changed)

- "Oman Meyredi" → "Osman Meyredi" (Final About doc typo).
- "there's a good change it can still be made" → "chance" (Original Tracks doc typo).
- "Want to hear what that sound like?" → "sounds" (Live Piano doc typo).
- Keynote types "Ponte Caffero"; the brief §35 (and the real town) spell "Ponte Caffaro" — Caffaro used.
- Keynote description says "DonCameleon"; the band's own videos say "Don Camaleon". §36 forbids changing collaborator spellings from the source, so the description keeps the Keynote's "DonCameleon" — confirm which is wanted.
- Keynote writes "Keep Your Eyes On The Sparrow"; the cover, the label and Spotify all say "Keep Your Eye on the Sparrow" (singular) — the release's own title used.
- Sparrow credit "bass" comes from the 45's printed label (Bass: Osman Meyredi), the only credit source supplied.

## §57 verification pass (slide → implementation)

1 loading cue ✓ (RouteLoadingCue) · 2 hero/logo/roles ✓ · 3 four vinyls + covers + pages-doc links ✓ ·
4 "Four ways to work with Osman Meyredi" ✓ · 5 shelf uses the same real covers ✓ · 6 "and beyond" ✓ (About + Home teaser) ·
7 intro sentence replaced ✓ · 8 Final About doc + 2nd image + Home copy ✓ · 9/25 "Osman Meyredi performs live piano…" ✓ ·
10 service names/taglines ✓ · 11 concerts copy + single red line ✓ · 12 folder content implemented ✓ ·
13 B&W landscape + pending colour note ✓ · 14 old concerts copy removed ✓ · 15 Live Piano rewritten + Rome image ✓ ·
16 production content first, CTA last, 2 images ✓ · 17 Original Tracks & Music Library content ✓ ·
18 contact hierarchy + labels quieter + osman@ removed ✓ · 19 "Write in Italian, English or Dutch." ✓ ·
20 Wine Festival exact details, past on the wall ✓ · 21 "Every Record, Marked" + intro + own-release link ✓ ·
22 band image on the ZAPPATiKA feature ✓ · 23 Falling for You metadata verbatim ✓ ·
24 memorial dates + placement under ZAPPATiKA; library teaser replaced ✓ · 25 As Seen & Heard + newspaper scan + info@ ✓ ·
26–28 descriptions verbatim ✓ · 29 Website Landscape.mp4 added; old-site video resolved with Aditya (dropped — footage covered) ✓ ·
30 closing conversion ✓ · 31 footer email + naming ✓ · 32 On screen section ✓ · 33 images used only where requested ✓.

## QA (§52–53)

tsc clean · eslint clean · vitest 50/50 · production build clean · all 16 public routes 200 ·
full-page screenshots reviewed for every affected page (desktop + mobile spot-checks) ·
no new per-frame React state; loading cue and pending notes are CSS-only; both new videos are
click-to-play (preload="none", no autoplay); all new images are optimized (≤600 KB, most ≤400 KB).

## Items waiting for Aditya / follow-ups

- Colour version of the Concerts landscape image (Varsha) — swap when supplied; visible note in place.
- ~~High-res Sparrow Special-45 cover~~ — DONE 11-09: Varsha's clean label render supplied in chat replaced the interim photo crop; pending note removed.
- The reserved Live Videos slot — drop the next video in via the Studio when ready.
- press@osmanmeyredi.com — revisit if that mailbox is ever created (info@ used for now).
- The music credit for the montage footage ("written, composed and all played by Osman") stays
  unpublished until Osman confirms the song (§40).
- "DonCameleon" vs "Don Camaleon" spelling — say the word and I'll align it.
- Production deploy: commit + push, then re-run the seed (`npx prisma generate` first if the client
  is stale; `SEED_DEMO_EVENTS=false` for launch) so existing Neon rows pick up the Round 2 content —
  the seed now refreshes descriptions, covers, links, the Wine Festival details, the band image,
  the memorial dates and contactEmail on re-seed.

## Addendum — brand files applied (11-09-2026)

Client-supplied brand package (chat, 11 Sept): OM_BLACK/OM_WHITE.pdf (monogram),
Osman Meyredi Black/White_11 Sept.pdf (wordmark), Osman_Meyredi_8/11_Sept.pdf
(brand sheets), one new performance photograph.

- Official vectors replace the traced logo: `public/images/logo-horizontal.svg` is now the
  exact wordmark from "Osman Meyredi Black_11 Sept.pdf"; `public/images/logo-om.svg` (new)
  is the exact OM monogram from OM_BLACK.pdf. The monogram replaces the typed "OM" on the
  vinyl menu button and anchors a regenerated favicon (vinyl disc + monogram, brand colors).
- Brand palette (#090809 · #2A2A2A · #CBC5B9 · #E9EBE6 · #A34B46 · #C15F58) applied as the
  site's design tokens, so every page picks it up: stage=#090809, line=#2A2A2A,
  ink=#E9EBE6, ink-soft=#CBC5B9, accents #A34B46/#C15F58 exact (faint/line-dark/canvas
  values are interpolations of the brand blacks/greys). Hardcoded sleeve tones updated.
- New hero: the supplied performance photograph is now the homepage hero
  (Aditya, 11-09: "It is the homepage hero image"), superseding Landingpage image.png.
- Typography on the brand sheet (Megante/Gilroy) NOT applied — the standing instruction
  keeps Archivo/Inter until Aditya says otherwise.
