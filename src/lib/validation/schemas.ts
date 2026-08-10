import { z } from "zod";

/** Shared Zod schemas — used server-side in every mutation. */

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .pipe(z.union([z.string().url("Must be a valid link (https://…)"), z.null()]))
  .nullable()
  .default(null);

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .default(null);

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker (YYYY-MM-DD)")
  .refine((v) => {
    const [y, m, d] = v.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }, "That date doesn't exist");

export const time24 = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour time, e.g. 20:30");

export const contentStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const eventInput = z.object({
  eventType: z.enum(["TICKETED_CONCERT", "FREE_GIG"]),
  title: z.string().trim().min(2, "Give the event a name").max(140),
  description: z.string().trim().max(2000).default(""),
  date: isoDate,
  startTime: time24,
  endTime: z.union([time24, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  venue: z.string().trim().min(1, "Where is it?").max(140),
  address: optionalText,
  city: z.string().trim().min(1, "Which city?").max(90),
  country: z.string().trim().min(1, "Which country?").max(90),
  imageUrl: optionalUrl,
  ticketUrl: optionalUrl,
  venueUrl: optionalUrl,
  priceText: optionalText,
  collaborators: optionalText,
  eventState: z.enum(["SCHEDULED", "SOLD_OUT", "CANCELLED"]).default("SCHEDULED"),
  featured: z.coerce.boolean().default(false),
  status: contentStatus.default("DRAFT"),
});
export type EventInput = z.infer<typeof eventInput>;

export const liveVideoInput = z.object({
  title: z.string().trim().min(2).max(160),
  description: optionalText,
  platform: z.enum(["youtube", "vimeo"]).default("youtube"),
  videoUrl: z.string().trim().url("Paste the full YouTube or Vimeo link"),
  thumbnailUrl: optionalUrl,
  venue: optionalText,
  performanceDate: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  year: z.coerce.number().int().min(1990).max(2100).nullable().default(null),
  tags: z.string().trim().default("").transform((v) =>
    v.split(",").map((t) => t.trim()).filter(Boolean)
  ),
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
});
export type LiveVideoInput = z.infer<typeof liveVideoInput>;

export const releaseInput = z.object({
  title: z.string().trim().min(1).max(160),
  releaseType: z.enum(["SINGLE", "EP", "ALBUM", "COLLABORATION"]),
  artworkUrl: optionalUrl,
  releaseDate: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  year: z.coerce.number().int().min(1950).max(2100).nullable().default(null),
  description: optionalText,
  credits: optionalText,
  spotifyUrl: optionalUrl,
  appleMusicUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  bandcampUrl: optionalUrl,
  otherUrl: optionalUrl,
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
});
export type ReleaseInput = z.infer<typeof releaseInput>;

export const mediaItemInput = z.object({
  publication: z.string().trim().min(1).max(140),
  headline: z.string().trim().min(2).max(220),
  mediaType: z.enum(["ARTICLE", "INTERVIEW", "PODCAST", "REVIEW", "VIDEO"]).default("ARTICLE"),
  date: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  articleUrl: z.string().trim().url("Paste the full link to the article"),
  imageUrl: optionalUrl,
  summary: optionalText,
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
});
export type MediaItemInput = z.infer<typeof mediaItemInput>;

export const serviceInput = z.object({
  title: z.string().trim().min(2).max(140),
  shortDescription: z.string().trim().min(2).max(300),
  body: z.string().trim().min(2).max(8000),
  imageUrl: optionalUrl,
  status: contentStatus.default("PUBLISHED"),
});
export type ServiceInput = z.infer<typeof serviceInput>;

export const productInput = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(2).max(2000),
  imageUrl: optionalUrl,
  category: z.string().trim().min(1).max(80),
  priceText: optionalText,
  status: z.enum(["CONCEPT", "AVAILABLE", "ARCHIVED"]).default("CONCEPT"),
  externalUrl: optionalUrl,
  featured: z.coerce.boolean().default(false),
});
export type ProductInput = z.infer<typeof productInput>;

export const siteSettingsInput = z.object({
  heroTagline: z.string().trim().min(2).max(300),
  announcement: optionalText,
  contactEmail: z.string().trim().email(),
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  facebookUrl: optionalUrl,
  shopMode: z.enum(["concept", "external", "storefront"]).default("concept"),
  shopUrl: optionalUrl,
});
export type SiteSettingsInput = z.infer<typeof siteSettingsInput>;

export const contactInput = z.object({
  name: z.string().trim().min(1, "Please add your name").max(120),
  email: z.string().trim().email("Please add a valid email"),
  organisation: optionalText,
  inquiryType: z.enum([
    "PERFORMANCE_BOOKING",
    "COACHING",
    "WORKSHOP",
    "PRESS_MEDIA",
    "COLLABORATION_SESSION",
    "GENERAL",
  ]),
  eventDate: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  location: optionalText,
  message: z.string().trim().min(10, "Tell Osman a little more — a sentence or two helps").max(4000),
  // Honeypot: real visitors never fill this.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactInput>;

export const loginInput = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Enter your password"),
});
