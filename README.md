# osmanmeyredi.com

Website and artist portal for **Osman Meyredi** — multi-instrumentalist, bassist and
composer (Netherlands / Italy / Europe).

Two experiences in one Next.js app:

- **Public site** — editorial artist website: About, Services (booking concerts,
  band coaching, listening & collaboration workshops), Shows (ticketed concerts,
  free gigs, live videos), Music, Media, Shop, Contact.
- **Osman Studio** (`/studio`) — private portal where Osman adds and publishes
  events, videos, releases, media and shop items without touching code.

Design concept: *Listen Between the Notes* — warm editorial canvas, Fraunces +
Inter, typographic date lists, restrained motion. See `docs/architecture.md`.

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · Prisma 7 +
PostgreSQL (with a zero-setup demo mode) · Zod · vitest.

## Quick start (no database needed)

```bash
npm install
cp .env.example .env
# in .env, set:
#   AUTH_SECRET        → openssl rand -base64 48
#   STUDIO_EMAIL       → your login email
#   STUDIO_PASSWORD_HASH → npm run auth:hash -- "choose-a-password"
npm run dev
```

- Public site: http://localhost:3000
- Studio: http://localhost:3000/studio (log in with the email/password above)

Without `DATABASE_URL` the app runs in **demo mode**: seeded, verified content from
`src/data/demo/content.ts`; Studio edits persist to `.demo-data/store.json`.
Example events are clearly labelled `[DEMO]` — delete them in the Studio before launch.

## Going live on PostgreSQL

```bash
# 1. Set DATABASE_URL in .env, then create the schema
npx prisma migrate dev          # (production: npx prisma migrate deploy)

# 2. Create the owner account + seed verified content
STUDIO_EMAIL=osman@… STUDIO_PASSWORD=… npx prisma db seed
# add SEED_DEMO_EVENTS=false to skip the [DEMO] fixture events

# 3. Restart. The Studio dashboard footer shows "Connected to database".
```

## Contact form delivery

Set `RESEND_API_KEY` + `CONTACT_TO_EMAIL` to receive inquiries by email (Resend).
Unset, inquiries append to `.demo-data/inquiries.json` and the server log.

## Shop modes

Studio → Site settings: **Concepts only** (default; brand directions, no checkout) ·
**External shop** (link out to Shopify, e.g. `shop.osmanmeyredi.com`) ·
**Integrated storefront** (reserved for Shopify Storefront API). No card processing
is ever implemented in this repo. Merch strategy: `docs/merch-directions.md`.

## Commands

```bash
npm run dev          # develop
npm run build        # production build
npm start            # serve production build
npm run typecheck    # strict TypeScript
npm run lint         # eslint
npm test             # vitest (event date/CTA logic, validation, protected mutations)
npm run auth:hash -- "pw"   # bcrypt hash for demo-mode login
```

## Deploy

- **Vercel-like**: set env vars, build. (Demo-mode edit persistence needs a writable
  disk or a database — for production always use PostgreSQL.)
- **Docker**: `docker build -t osman-site .` then
  `docker run -p 3000:3000 --env-file .env osman-site`.

## Content integrity

Seed content contains only verified facts (site, Bandcamp, Discogs, press).
No invented releases, press or tour history. Missing assets render as labelled
placeholders — search the code for `PlaceholderImage` to find every replacement
point. No Spotify/Apple Music artist profile could be verified as of Aug 2026;
add those links in Studio → Releases when profiles exist.
