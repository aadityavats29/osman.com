import type { EventRecord, MediaItemRecord, ReleaseRecord } from "./types";

/**
 * Schema.org JSON-LD builders. Only emit structured data for facts that are
 * visible and verified on the page (see brief §11).
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.osmanmeyredi.com";

export function personJsonLd(sameAs: string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Osman Meyredi",
    jobTitle: "Multi-instrumentalist, bassist and composer",
    url: SITE_URL,
    sameAs: sameAs.filter(Boolean),
  };
}

export function musicEventJsonLd(event: EventRecord): Record<string, unknown> {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    startDate: `${event.date}T${event.startTime}:00`,
    eventStatus:
      event.eventState === "CANCELLED"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        ...(event.address ? { streetAddress: event.address } : {}),
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    performer: { "@type": "Person", name: "Osman Meyredi" },
  };
  if (event.eventType === "FREE_GIG") {
    data.isAccessibleForFree = true;
  } else if (event.ticketUrl && event.eventState === "SCHEDULED") {
    data.offers = {
      "@type": "Offer",
      url: event.ticketUrl,
      availability: "https://schema.org/InStock",
    };
  } else if (event.eventState === "SOLD_OUT" && event.ticketUrl) {
    data.offers = {
      "@type": "Offer",
      url: event.ticketUrl,
      availability: "https://schema.org/SoldOut",
    };
  }
  return data;
}

export function musicAlbumJsonLd(release: ReleaseRecord): Record<string, unknown> {
  const sameAs = [
    release.spotifyUrl,
    release.appleMusicUrl,
    release.youtubeUrl,
    release.bandcampUrl,
    release.otherUrl,
  ].filter((u): u is string => Boolean(u));
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    ...(release.year ? { datePublished: String(release.year) } : {}),
    byArtist: { "@type": "Person", name: "Osman Meyredi" },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function articleJsonLd(item: MediaItemRecord): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.headline,
    url: item.articleUrl,
    publisher: { "@type": "Organization", name: item.publication },
    ...(item.date ? { datePublished: item.date } : {}),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
