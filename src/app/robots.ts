import type { MetadataRoute } from "next";
import { isPreviewDeployment, siteUrl } from "@/lib/site";

/**
 * robots.txt (brief §12/§21).
 *
 * Production: public content open to all legitimate crawlers, with the
 * Google, Bing and ChatGPT-Search crawlers each named explicitly so a
 * future blanket rule can never silently exclude them. Only the private
 * Studio area is disallowed (§12: block admin/auth; the login screen
 * lives under /studio too).
 *
 * GPTBot (OpenAI model training — a separate choice from OAI-SearchBot
 * search discovery, §12) is deliberately NOT blocked: no owner decision
 * against training use has been recorded. To opt out later, add
 * `{ userAgent: "GPTBot", disallow: "/" }` to the rules below.
 *
 * Preview deployments: disallow everything — previews must never compete
 * with production in any index (§21).
 */
export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  const disallow = ["/studio", "/studio/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "Bingbot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
