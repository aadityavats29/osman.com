import Link from "next/link";
import type { EventRecord } from "@/lib/types";
import { getRepos } from "@/server/repositories";
import { byDateAsc, formatEventDate, isUpcoming } from "@/lib/events";
import { eventTypeLabels } from "@/components/studio/labels";
import { EventStateChip, StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveEventAction,
  duplicateEventAction,
  unpublishEventAction,
} from "@/server/actions/events";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shows" };

function EventRow({ event }: { event: EventRecord }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
      <span className="tabular w-32 shrink-0 text-sm text-ink-soft">
        {formatEventDate(event.date).full}
      </span>
      <span className="min-w-0 flex-1">
        <Link
          href={`/studio/events/${event.id}`}
          className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
        >
          {event.title}
        </Link>
        <span className="block truncate text-xs text-ink-faint">
          {event.venue}, {event.city} · {eventTypeLabels[event.eventType]}
        </span>
      </span>
      <span className="flex items-center gap-2">
        <StatusChip status={event.status} />
        <EventStateChip state={event.eventState} />
      </span>
      <span className="flex items-center gap-3">
        <Link
          href={`/studio/events/${event.id}`}
          className="text-xs font-medium text-accent underline-offset-2 hover:underline"
        >
          Edit
        </Link>
        <RowAction action={duplicateEventAction} id={event.id} label="Duplicate" />
        {event.status === "PUBLISHED" ? (
          <RowAction action={unpublishEventAction} id={event.id} label="Unpublish" />
        ) : null}
        {event.status !== "ARCHIVED" ? (
          <RowAction action={archiveEventAction} id={event.id} label="Archive" />
        ) : null}
      </span>
    </li>
  );
}

export default async function EventsPage() {
  const events = await getRepos().events.list();
  const now = new Date();

  const current = events
    .filter((e) => e.status === "DRAFT" || (e.status === "PUBLISHED" && isUpcoming(e, now)))
    .sort(byDateAsc);
  const currentIds = new Set(current.map((e) => e.id));
  const past = events
    .filter((e) => !currentIds.has(e.id))
    .sort((a, b) => byDateAsc(b, a));

  return (
    <div className="space-y-10">
      <PageHeader
        title="Shows"
        intro="Concerts and gigs, upcoming and past."
        actionHref="/studio/events/new"
        actionLabel="Add a show"
      />

      <section aria-labelledby="events-current">
        <h2 id="events-current" className="eyebrow">
          Upcoming &amp; drafts
        </h2>
        {current.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              message="No upcoming shows or drafts yet."
              actionHref="/studio/events/new"
              actionLabel="Add a show"
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-md border border-line">
            {current.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="events-past">
        <h2 id="events-past" className="eyebrow">
          Past &amp; archived
        </h2>
        {past.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">Nothing here yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-md border border-line">
            {past.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
