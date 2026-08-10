import type { EventType, MediaType, ReleaseType } from "@/lib/types";

/** Human labels for enum values — the UI never shows raw enum names. */

export const eventTypeLabels: Record<EventType, string> = {
  TICKETED_CONCERT: "Ticketed concert",
  FREE_GIG: "Free gig",
};

export const releaseTypeLabels: Record<ReleaseType, string> = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
};

export const mediaTypeLabels: Record<MediaType, string> = {
  ARTICLE: "Article",
  INTERVIEW: "Interview",
  PODCAST: "Podcast",
  REVIEW: "Review",
  VIDEO: "Video",
};
