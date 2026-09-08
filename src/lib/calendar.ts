import type { EventRecord } from "./types";

/**
 * Builds a data-URL .ics calendar file for an event row — the practical
 * translation of the Xavier Rudd tour page's RSVP idea (Keynote slide 17):
 * one tap saves the show into the visitor's own calendar, no third-party
 * service or account required. Times are written as floating local times,
 * matching how event times are stored (venue-local date + "20:30").
 */
function icsEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function icsStamp(date: string, time: string): string {
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h + hours) % 24;
  return `${String(total).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function eventIcsDataUrl(event: EventRecord): string {
  const location = [event.venue, event.address, event.city, event.country]
    .filter(Boolean)
    .join(", ");
  const url = event.ticketUrl ?? event.venueUrl ?? "";
  const description = [event.description, url].filter(Boolean).join("\\n");
  const end = event.endTime ?? addHours(event.startTime, 2);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Osman Meyredi//Shows//EN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@osmanmeyredi.com`,
    `DTSTART:${icsStamp(event.date, event.startTime)}`,
    `DTEND:${icsStamp(event.date, end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    location ? `LOCATION:${icsEscape(location)}` : null,
    description ? `DESCRIPTION:${icsEscape(description)}` : null,
    url ? `URL:${icsEscape(url)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((l): l is string => Boolean(l));
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
