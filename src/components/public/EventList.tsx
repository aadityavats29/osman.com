import type { EventRecord } from "@/lib/types";
import { eventCta, formatEventDate } from "@/lib/events";
import { TrackedLink } from "./TrackedLink";

/**
 * Typographic event listing — hairline rows, no cards.
 * The CTA is decided exclusively by eventCta() in @/lib/events, which guarantees:
 * free gigs never show a ticket button; sold-out and cancelled events never link
 * to a ticket page; cancelled rows stay visible, clearly struck through.
 *
 * variant="archive" renders muted rows with no CTA at all (past events).
 */
export function EventList({
  events,
  variant = "upcoming",
}: {
  events: EventRecord[];
  variant?: "upcoming" | "archive";
}) {
  return (
    <ul className="border-b border-line">
      {events.map((event) => (
        <EventRow key={event.id} event={event} variant={variant} />
      ))}
    </ul>
  );
}

export function EventRow({
  event,
  variant = "upcoming",
}: {
  event: EventRecord;
  variant?: "upcoming" | "archive";
}) {
  const cta = eventCta(event);
  const d = formatEventDate(event.date);
  const cancelled = cta.kind === "cancelled";
  const archive = variant === "archive";
  const struck = cancelled ? "line-through decoration-1 text-ink-faint" : "";

  return (
    <li className={`border-t border-line ${archive ? "opacity-60" : ""}`}>
      <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Date block */}
        <div className="flex items-baseline gap-2 sm:w-24 sm:shrink-0 sm:flex-col sm:gap-0">
          <span
            className={`font-display tabular text-3xl leading-none ${
              cancelled ? "text-ink-faint line-through decoration-1" : ""
            }`}
          >
            {d.day}
          </span>
          <span className="tabular text-sm text-ink-soft">
            {d.month} {d.year}
          </span>
        </div>

        {/* Event details */}
        <div className="min-w-0 flex-1">
          <h3 className={`font-display text-xl leading-snug ${struck}`}>{event.title}</h3>
          <p className={`mt-1 text-sm text-ink-soft ${cancelled ? "line-through decoration-1" : ""}`}>
            {event.venue} · {event.city}, {event.country} · {event.startTime}
          </p>
          {(event.collaborators || event.priceText) && (
            <p className="mt-1 text-sm text-ink-faint">
              {[event.collaborators, event.priceText].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* CTA — only for upcoming rows */}
        {!archive && <EventRowCta event={event} />}
      </div>
    </li>
  );
}

function EventRowCta({ event }: { event: EventRecord }) {
  const cta = eventCta(event);

  switch (cta.kind) {
    case "tickets":
      return (
        <div className="shrink-0 sm:text-right">
          <TrackedLink
            href={cta.href}
            external
            event="ticket_click"
            eventProps={{ event: event.slug }}
            className="inline-block bg-ink px-5 py-2.5 text-sm font-medium tracking-wide text-canvas uppercase transition-colors hover:bg-accent-strong"
            aria-label={`Tickets for ${event.title}`}
          >
            Tickets
          </TrackedLink>
        </div>
      );
    case "free":
      return (
        <div className="flex shrink-0 items-center gap-4 sm:justify-end">
          <span className="inline-block border border-ok px-3 py-1 text-xs font-medium tracking-wide text-ok uppercase">
            Free entry
          </span>
          {cta.detailsHref && (
            <TrackedLink
              href={cta.detailsHref}
              external
              event="gig_details_click"
              eventProps={{ event: event.slug }}
              className="text-sm underline underline-offset-4 hover:text-accent-strong"
              aria-label={`Details for ${event.title}`}
            >
              Details
            </TrackedLink>
          )}
        </div>
      );
    case "sold_out":
      return (
        <div className="shrink-0 sm:text-right">
          <span className="text-sm font-medium tracking-wide text-ink-faint uppercase">
            Sold out
          </span>
        </div>
      );
    case "cancelled":
      return (
        <div className="shrink-0 sm:text-right">
          <span className="text-sm font-medium tracking-wide text-danger uppercase">
            Cancelled
          </span>
        </div>
      );
    default:
      return null;
  }
}
