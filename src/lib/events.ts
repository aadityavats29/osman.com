import type { EventRecord } from "./types";

/**
 * Event date/classification logic. Deliberately dependency-free and pure so it
 * can be unit-tested and shared by public pages, the studio portal and repositories.
 *
 * Event dates are venue-local calendar dates ("2026-09-18") with a 24h start
 * time ("20:30"). An event counts as "upcoming" through the end of its own day —
 * we never flip a tonight-gig to "past" mid-afternoon because of timezone math.
 */

/** Returns the venue-local end-of-day timestamp for an event as a comparable Date (UTC-based). */
export function eventDayEnd(event: Pick<EventRecord, "date">): Date {
  // Treat the calendar date as inclusive: the event is "upcoming" until the day is over.
  // A ±14h window covers all real venue timezones relative to UTC.
  const d = new Date(`${event.date}T23:59:59Z`);
  d.setUTCHours(d.getUTCHours() + 14);
  return d;
}

export function isUpcoming(event: Pick<EventRecord, "date">, now: Date = new Date()): boolean {
  return eventDayEnd(event).getTime() >= now.getTime();
}

export function isPast(event: Pick<EventRecord, "date">, now: Date = new Date()): boolean {
  return !isUpcoming(event, now);
}

/** Published events, upcoming only, soonest first. Cancelled events stay listed (clearly labelled) so attendees see the change. */
export function upcomingPublished(events: EventRecord[], now: Date = new Date()): EventRecord[] {
  return events
    .filter((e) => e.status === "PUBLISHED" && isUpcoming(e, now))
    .sort(byDateAsc);
}

/** Published past events, most recent first (for archives). */
export function pastPublished(events: EventRecord[], now: Date = new Date()): EventRecord[] {
  return events
    .filter((e) => e.status === "PUBLISHED" && isPast(e, now))
    .sort((a, b) => byDateAsc(b, a));
}

export function byDateAsc(a: EventRecord, b: EventRecord): number {
  const d = a.date.localeCompare(b.date);
  if (d !== 0) return d;
  return a.startTime.localeCompare(b.startTime);
}

export type EventCta =
  | { kind: "tickets"; href: string }
  | { kind: "free"; detailsHref: string | null }
  | { kind: "sold_out" }
  | { kind: "cancelled" }
  | { kind: "none" };

/**
 * The single source of truth for which call-to-action an event row shows.
 * Guarantees the brief's rules: free gigs never show a ticket CTA; sold-out and
 * cancelled events never show a misleading ticket link.
 */
export function eventCta(event: EventRecord): EventCta {
  if (event.eventState === "CANCELLED") return { kind: "cancelled" };
  if (event.eventState === "SOLD_OUT") return { kind: "sold_out" };
  if (event.eventType === "FREE_GIG") {
    return { kind: "free", detailsHref: event.venueUrl };
  }
  if (event.ticketUrl) return { kind: "tickets", href: event.ticketUrl };
  return { kind: "none" };
}

/** Publishing guard: warn when a ticketed concert is about to go live without a ticket link. */
export function publishWarnings(event: Pick<EventRecord, "eventType" | "ticketUrl" | "eventState">): string[] {
  const warnings: string[] = [];
  if (
    event.eventType === "TICKETED_CONCERT" &&
    !event.ticketUrl &&
    event.eventState === "SCHEDULED"
  ) {
    warnings.push(
      "This ticketed concert has no ticket link yet. Visitors will see the date but no way to buy tickets."
    );
  }
  return warnings;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** "2026-09-18" → { day: "18", month: "Sep", year: "2026", weekday: "Fri" } */
export function formatEventDate(isoDate: string): {
  day: string;
  month: string;
  monthFull: string;
  year: string;
  weekday: string;
  full: string;
} {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const month = MONTHS[m - 1] ?? "";
  const monthFull = MONTHS_FULL[m - 1] ?? "";
  return {
    day: String(d).padStart(2, "0"),
    month,
    monthFull,
    year: String(y),
    weekday: weekdays[dt.getUTCDay()],
    full: `${String(d).padStart(2, "0")} ${monthFull} ${y}`,
  };
}
