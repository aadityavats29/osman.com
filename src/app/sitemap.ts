import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const ROUTES: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/concerts", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/coaching", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/workshops", changeFrequency: "monthly", priority: 0.8 },
  { path: "/shows", changeFrequency: "weekly", priority: 0.9 },
  { path: "/shows/concerts", changeFrequency: "weekly", priority: 0.9 },
  { path: "/shows/gigs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/shows/live-videos", changeFrequency: "monthly", priority: 0.7 },
  { path: "/music", changeFrequency: "monthly", priority: 0.8 },
  { path: "/media", changeFrequency: "monthly", priority: 0.6 },
  { path: "/shop", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
