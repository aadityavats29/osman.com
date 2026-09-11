/**
 * Canonical-host strategy (SEO foundation brief §16/§21/§32).
 *
 * One preferred HTTPS host, resolved in this order:
 *
 *   1. NEXT_PUBLIC_SITE_URL — explicit override (set this to
 *      https://www.osmanmeyredi.com at domain cutover, or earlier to pin).
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's *production* domain.
 *      Crucially, this is the production host even on preview deployments,
 *      so previews canonicalise to production (never the reverse, §21) and
 *      the sitemap never emits preview hosts. Once osmanmeyredi.com is
 *      attached as the Vercel production domain this flips automatically.
 *   3. localhost — dev/test fallback.
 *
 * Every canonical, sitemap entry, OG url and JSON-LD url must come from
 * here so they can never disagree (§16: "sitemap and internal links must
 * use the same canonical URLs").
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  return "http://localhost:3000";
}

/** Absolute URL for a site path ("/about") or pass-through for full URLs. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === "/" || path === "") return siteUrl();
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The one stable Osman Meyredi entity id (brief §32). An `@id` is an
 * identifier, not a link, so it is pinned to the permanent official domain
 * and never varies with the serving host — every Person reference across
 * the site must reuse it so search engines connect one entity, not many.
 */
export const PERSON_ID = "https://www.osmanmeyredi.com/#osman-meyredi";

/**
 * True on Vercel preview/development deployments (brief §21): these must
 * carry noindex,nofollow and a disallow-all robots file so they can never
 * compete with production in search results. Locally (no VERCEL_ENV) the
 * site behaves like production so robots/sitemap can be QA'd.
 */
export function isPreviewDeployment(): boolean {
  const env = process.env.VERCEL_ENV;
  return Boolean(env) && env !== "production";
}

/**
 * True where IndexNow pings may fire: real production deployments only —
 * previews and local/demo runs must never submit URLs (§19/§21).
 */
export function isIndexableProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}
