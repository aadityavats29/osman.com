/**
 * Domain types shared by both persistence backends (Prisma/PostgreSQL and demo mode).
 * These are plain serializable types — the UI never touches Prisma models directly.
 */

export type Role = "OWNER" | "EDITOR" | "READONLY";
export type EventType =
  | "TICKETED_CONCERT"
  | "FREE_GIG"
  | "FESTIVAL"
  | "PRIVATE_EVENT"
  | "OTHER";
export type TicketingType = "TICKETED" | "FREE" | "INFO_ONLY" | "NONE";
export type RelationshipType =
  | "OWN_RELEASE"
  | "CONTRIBUTING_ARTIST"
  | "COLLABORATION_RELEASE";
export type RightsStatus = "VERIFIED" | "PENDING" | "DO_NOT_PUBLISH";
export type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EventState = "SCHEDULED" | "SOLD_OUT" | "CANCELLED";
export type ReleaseType = "SINGLE" | "EP" | "ALBUM" | "COLLABORATION";
export type MediaType = "ARTICLE" | "INTERVIEW" | "PODCAST" | "REVIEW" | "VIDEO";
export type ServiceType = "CONCERTS" | "COACHING" | "WORKSHOPS";
export type ProductStatus = "CONCEPT" | "AVAILABLE" | "ARCHIVED";
export type ShopMode = "concept" | "external" | "storefront";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface EventRecord {
  id: string;
  slug: string;
  eventType: EventType;
  title: string;
  description: string;
  /** ISO date, venue-local: "2026-09-18" */
  date: string;
  /** 24h venue-local time: "20:30" */
  startTime: string;
  endTime: string | null;
  venue: string;
  address: string | null;
  city: string;
  country: string;
  imageUrl: string | null;
  imageAlt: string | null;
  imageCredit: string | null;
  ticketUrl: string | null;
  venueUrl: string | null;
  priceText: string | null;
  collaborators: string | null;
  /** Explicit link semantics; null = derived from eventType. */
  ticketingType: TicketingType | null;
  ctaLabel: string | null;
  /** IANA zone of the venue; stored date/time values are local to it. */
  timezone: string;
  isDemo: boolean;
  status: ContentStatus;
  eventState: EventState;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiveVideoRecord {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  platform: "youtube" | "vimeo" | "file";
  videoUrl: string;
  thumbnailUrl: string | null;
  venue: string | null;
  performanceDate: string | null;
  year: number | null;
  tags: string[];
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationRecord {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  startYear: number | null;
  endYear: number | null;
  ongoing: boolean;
  shortDescription: string | null;
  longDescription: string | null;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  heroImageCredit: string | null;
  heroImageRights: RightsStatus;
  collaborators: string | null;
  externalUrl: string | null;
  memorialTitle: string | null;
  memorialName: string | null;
  memorialYears: string | null;
  memorialText: string | null;
  showMemorial: boolean;
  publicCulturalNote: string | null;
  culturalNoteStatus: VerificationStatus;
  internalNotes: string | null;
  status: ContentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryTrackRecord {
  id: string;
  slug: string;
  title: string;
  genre: string | null;
  moods: string[];
  useCases: string[];
  durationSec: number | null;
  audioUrl: string | null;
  description: string | null;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseRecord {
  id: string;
  slug: string;
  title: string;
  releaseType: ReleaseType;
  relationshipType: RelationshipType;
  primaryArtistName: string | null;
  osmanCredit: string | null;
  labelName: string | null;
  catalogNumber: string | null;
  artworkCredit: string | null;
  rightsStatus: RightsStatus;
  sourceUrl: string | null;
  collaborationSlug: string | null;
  artworkUrl: string | null;
  releaseDate: string | null;
  year: number | null;
  description: string | null;
  credits: string | null;
  spotifyUrl: string | null;
  appleMusicUrl: string | null;
  youtubeUrl: string | null;
  bandcampUrl: string | null;
  otherUrl: string | null;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItemRecord {
  id: string;
  slug: string;
  publication: string;
  headline: string;
  mediaType: MediaType;
  date: string | null;
  articleUrl: string;
  imageUrl: string | null;
  summary: string | null;
  status: ContentStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  serviceType: ServiceType;
  title: string;
  shortDescription: string;
  body: string;
  imageUrl: string | null;
  status: ContentStatus;
  sortOrder: number;
  updatedAt: string;
}

export interface ProductRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  priceText: string | null;
  status: ProductStatus;
  externalCommerceId: string | null;
  externalUrl: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  heroTagline: string;
  announcement: string | null;
  contactEmail: string;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  shopMode: ShopMode;
  shopUrl: string | null;
}
