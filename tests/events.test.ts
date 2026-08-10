import { describe, expect, it } from "vitest";
import {
  eventCta,
  formatEventDate,
  isPast,
  isUpcoming,
  pastPublished,
  publishWarnings,
  upcomingPublished,
} from "@/lib/events";
import type { EventRecord } from "@/lib/types";

function makeEvent(overrides: Partial<EventRecord> = {}): EventRecord {
  return {
    id: "e1",
    slug: "test-event",
    eventType: "TICKETED_CONCERT",
    title: "Test event",
    description: "",
    date: "2026-09-18",
    startTime: "20:30",
    endTime: null,
    venue: "Venue",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    ticketUrl: "https://example.com/tickets",
    venueUrl: null,
    priceText: null,
    collaborators: null,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: "2026-08-01T00:00:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("upcoming/past classification", () => {
  it("counts a future event as upcoming", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    expect(isUpcoming(makeEvent({ date: "2026-09-18" }), now)).toBe(true);
  });

  it("keeps a same-day event upcoming for the whole day (no mid-afternoon flip)", () => {
    const now = new Date("2026-09-18T22:00:00Z");
    expect(isUpcoming(makeEvent({ date: "2026-09-18" }), now)).toBe(true);
  });

  it("moves an event to past after its day has fully ended everywhere", () => {
    const now = new Date("2026-09-20T15:00:00Z");
    expect(isPast(makeEvent({ date: "2026-09-18" }), now)).toBe(true);
  });

  it("excludes drafts and archived events from the public upcoming list", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    const events = [
      makeEvent({ id: "a", status: "DRAFT" }),
      makeEvent({ id: "b", status: "ARCHIVED" }),
      makeEvent({ id: "c", status: "PUBLISHED" }),
    ];
    expect(upcomingPublished(events, now).map((e) => e.id)).toEqual(["c"]);
  });

  it("keeps cancelled events listed (clearly labelled) rather than hiding them", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    const events = [makeEvent({ eventState: "CANCELLED" })];
    expect(upcomingPublished(events, now)).toHaveLength(1);
  });

  it("sorts upcoming soonest-first and past most-recent-first", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    const events = [
      makeEvent({ id: "far", date: "2026-12-01" }),
      makeEvent({ id: "near", date: "2026-08-15" }),
      makeEvent({ id: "old", date: "2026-01-10" }),
      makeEvent({ id: "older", date: "2025-06-01" }),
    ];
    expect(upcomingPublished(events, now).map((e) => e.id)).toEqual(["near", "far"]);
    expect(pastPublished(events, now).map((e) => e.id)).toEqual(["old", "older"]);
  });
});

describe("event CTA rules", () => {
  it("shows Tickets for a scheduled ticketed concert with a link", () => {
    expect(eventCta(makeEvent())).toEqual({
      kind: "tickets",
      href: "https://example.com/tickets",
    });
  });

  it("NEVER shows a ticket CTA for a free gig, even if a ticketUrl sneaks in", () => {
    const cta = eventCta(
      makeEvent({ eventType: "FREE_GIG", ticketUrl: "https://example.com/wrong" })
    );
    expect(cta.kind).toBe("free");
  });

  it("free gig exposes the venue/details link", () => {
    const cta = eventCta(
      makeEvent({ eventType: "FREE_GIG", ticketUrl: null, venueUrl: "https://venue.example" })
    );
    expect(cta).toEqual({ kind: "free", detailsHref: "https://venue.example" });
  });

  it("sold out replaces the ticket CTA", () => {
    expect(eventCta(makeEvent({ eventState: "SOLD_OUT" })).kind).toBe("sold_out");
  });

  it("cancelled replaces the ticket CTA even when a ticket link exists", () => {
    expect(eventCta(makeEvent({ eventState: "CANCELLED" })).kind).toBe("cancelled");
  });

  it("ticketed concert without a link shows no CTA rather than a broken one", () => {
    expect(eventCta(makeEvent({ ticketUrl: null })).kind).toBe("none");
  });
});

describe("publish warnings", () => {
  it("warns when publishing a ticketed concert without a ticket link", () => {
    const w = publishWarnings({
      eventType: "TICKETED_CONCERT",
      ticketUrl: null,
      eventState: "SCHEDULED",
    });
    expect(w).toHaveLength(1);
  });

  it("does not warn for free gigs or linked concerts", () => {
    expect(
      publishWarnings({ eventType: "FREE_GIG", ticketUrl: null, eventState: "SCHEDULED" })
    ).toHaveLength(0);
    expect(
      publishWarnings({
        eventType: "TICKETED_CONCERT",
        ticketUrl: "https://example.com",
        eventState: "SCHEDULED",
      })
    ).toHaveLength(0);
  });
});

describe("date formatting", () => {
  it("formats a date without timezone drift", () => {
    const f = formatEventDate("2026-09-18");
    expect(f.day).toBe("18");
    expect(f.month).toBe("Sep");
    expect(f.year).toBe("2026");
    expect(f.weekday).toBe("Fri");
    expect(f.full).toBe("18 September 2026");
  });
});
