# Architecture

Osman Meyredi's website is a single Next.js (App Router) application with two faces:

- the **public website** (`src/app/(public)`) — editorial artist site;
- **Osman Studio** (`src/app/studio`) — the private portal where Osman manages content without touching code.

The design concept is **"Listen Between the Notes"**: warm editorial canvas, selective deep-ink sections, Fraunces display type over Inter body type, typographic event lists instead of card grids, restrained motion that respects `prefers-reduced-motion`.

## Layers

```
UI (React server components + small client islands)
  └── server actions (src/server/actions) — auth-guarded, Zod-validated mutations
        └── repositories (src/server/repositories) — persistence boundary
              ├── demo backend  (no DATABASE_URL: seeded content, in-memory + JSON snapshot)
              └── prisma backend (DATABASE_URL set: PostgreSQL via Prisma 7 + pg driver adapter)
```

Rules that keep the boundaries clean:

- The UI only ever sees the plain serializable domain types in `src/lib/types.ts` — never Prisma models.
- All reads go through `getRepos()`; all writes go through server actions that call `requireEditor()` first and validate input with the shared Zod schemas in `src/lib/validation/schemas.ts`.
- Event date/CTA logic lives in one pure module, `src/lib/events.ts`, unit-tested in `tests/`. The public site and the Studio both derive behaviour from it (e.g. free gigs can never render a ticket CTA because `eventCta()` is the only CTA source).
- Public pages render dynamically (`force-dynamic`), so a Studio edit is visible on the next request — no rebuild, no deploy.

## Demo mode vs production database

`DATABASE_URL` unset → the demo backend serves seeded content from `src/data/demo/content.ts` and persists Studio edits to `.demo-data/store.json` (best-effort; read-only filesystems degrade gracefully to in-memory). This is how the repo runs out of the box.

`DATABASE_URL` set → Prisma against PostgreSQL. Migration path:

1. `npx prisma migrate dev` (first run creates the schema; requires network for Prisma's schema engine).
2. `STUDIO_EMAIL=… STUDIO_PASSWORD=… npx prisma db seed` — creates the owner account (bcrypt-hashed) and the same verified seed content. `SEED_DEMO_EVENTS=false` skips the clearly-labelled `[DEMO]` fixture events.
3. Restart the app. The footer of the Studio dashboard shows which backend is live.

Prisma 7 is configured engine-less at runtime (`prisma-client` generator + `@prisma/adapter-pg`), so the production container needs no Rust engine binaries.

## Authentication

- Email + password (bcrypt) → signed JWT (HS256, `AUTH_SECRET`) in an HTTP-only, `SameSite=Lax`, `Secure` cookie for 7 days.
- Demo mode: a single owner account from `STUDIO_EMAIL` + `STUDIO_PASSWORD_HASH` (generate with `npm run auth:hash -- "password"`). Database mode: users table (roles OWNER / EDITOR / READONLY are already modelled; v1 creates only the owner).
- Every Studio page group is guarded in the layout; every mutation independently calls `requireEditor()` server-side (defence in depth — actions never trust the page guard).
- CSRF: mutations are POST-only server actions (Next.js enforces origin checks) + `SameSite=Lax` cookies.
- Rate limiting: in-memory sliding window on login and the contact form (`src/lib/rateLimit.ts`); swap for a Redis-backed implementation behind the same signature when scaling to multiple instances.

## Content model

Collections: `Event` (with `eventType` TICKETED_CONCERT | FREE_GIG, `status` DRAFT/PUBLISHED/ARCHIVED, and a separate `eventState` SCHEDULED/SOLD_OUT/CANCELLED so a sold-out show stays published), `LiveVideo`, `Release`, `MediaItem`, `Service` (fixed set of three), `Product` (shop concepts now, commerce-linkable later), `SiteSetting` (typed key/value: hero tagline, announcement, contact email, socials, shop mode/URL), `User`.

Slugs are generated (`src/lib/slug.ts`), never typed by Osman. Past events drop out of "upcoming" automatically at the end of their own venue-local day (`src/lib/events.ts` — tested against the tonight's-gig-disappears-at-3pm bug).

## Commerce (Shopify-ready, not Shopify-locked)

The shop has three modes, editable in Studio → Site settings (no deploy needed):

- `concept` (default): brand-direction page with clearly-labelled concepts, no checkout;
- `external`: the shop page and CTAs link out to `shopUrl` (e.g. a Shopify store on `shop.osmanmeyredi.com` — point a CNAME at Shopify and set the URL in Studio);
- `storefront`: reserved for rendering Shopify products via the Storefront API while Shopify remains checkout; the `Product` model already carries `externalCommerceId`/`externalUrl` for the mapping.

No card processing is ever implemented in this codebase. (The brief suggested `SHOP_MODE` as an env var; it lives in site settings instead so Osman can switch modes himself — same abstraction, less friction.)

## Contact delivery

`src/server/services/contactDelivery.ts`: with `RESEND_API_KEY` + `CONTACT_TO_EMAIL` set, inquiries are emailed via Resend; otherwise they are appended to `.demo-data/inquiries.json` and logged. Spam strategy: hidden honeypot field (schema-level reject, pretends success to bots) + per-IP rate limit + server-side validation.

## SEO, accessibility, performance

- Per-page titles/descriptions/canonicals, `sitemap.ts`, `robots.ts` (disallows `/studio`), Open Graph metadata.
- JSON-LD emitted only for verified on-page facts: `Person`, `MusicEvent` (with `isAccessibleForFree` for gigs, offer availability for tickets/sold-out), `MusicAlbum`, `Article`.
- WCAG 2.2 AA fundamentals: skip link, semantic landmarks, one h1 per page, visible focus styles, labelled inputs with `aria-describedby` errors, keyboard-operable menus, reduced-motion support, no colour-only state (event states are always worded).
- Video embeds are click-to-load (no iframe until interaction, never autoplay); fonts are two families with `display: swap`; images are placeholder-SVG or sized `<img>` to prevent layout shift.

## Asset replacement points (TODO for Osman)

Every missing asset renders as a labelled `<PlaceholderImage>` (`src/components/shared/PlaceholderImage.tsx`) that preserves final aspect ratios. Search the codebase for `PlaceholderImage` to list them: hero image/film, portrait + performance photos (About), service images, release artwork, event posters. Swapping in a real image = pasting a URL in the Studio (for content) or replacing the component usage (for fixed page imagery). When real uploads are needed, add an S3-compatible driver behind a small upload action — the models already store URLs, not blobs.

## Scaling path

More editors → create users with EDITOR role (auth + roles already modelled). Multiple instances → move rate limiting and the demo snapshot to shared storage (or simply run on PostgreSQL, which is already multi-instance-safe). Search/newsletter/analytics → `src/lib/analytics.ts` is provider-agnostic (Plausible-compatible out of the box); newsletter and ticket-provider integrations slot in as new repositories/services without touching the UI. Avoided on purpose: microservices, Kubernetes, custom payments.
