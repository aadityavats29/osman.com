"use client";

import { useActionState, useState } from "react";
import type { EventRecord, EventType } from "@/lib/types";
import { deleteEventAction, saveEventAction } from "@/server/actions/events";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import {
  CheckboxField,
  FormError,
  PublishButtons,
  SelectField,
  TextField,
  TextareaField,
  secondaryButtonClass,
} from "./fields";

const TYPE_TILES: Array<{ value: EventType; title: string; help: string }> = [
  {
    value: "TICKETED_CONCERT",
    title: "Ticketed concert",
    help: "People buy a ticket.",
  },
  {
    value: "FREE_GIG",
    title: "Free gig",
    help: "Free entry, e.g. a café or bar.",
  },
];

export function EventForm({
  event,
  initialType,
}: {
  event?: EventRecord;
  initialType?: EventType;
}) {
  const [state, formAction, pending] = useActionState(saveEventAction, initialActionState);

  // Resubmitted values win over the stored record, so a failed save keeps edits.
  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  const [eventType, setEventType] = useState<EventType>(() => {
    const submitted = state.values?.eventType;
    if (submitted === "TICKETED_CONCERT" || submitted === "FREE_GIG") return submitted;
    return event?.eventType ?? initialType ?? "TICKETED_CONCERT";
  });

  const detailsOpen = Boolean(
    event &&
      (event.endTime ||
        event.address ||
        event.priceText ||
        event.collaborators ||
        event.featured ||
        event.eventState !== "SCHEDULED")
  );

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {event ? <input type="hidden" name="id" value={event.id} /> : null}
        <FormError errors={state.errors} />

        <fieldset>
          <legend className="text-sm font-medium text-ink">Kind of event</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {TYPE_TILES.map((tile) => (
              <label
                key={tile.value}
                className={`cursor-pointer rounded-md border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                  eventType === tile.value
                    ? "border-accent bg-accent/5"
                    : "border-line hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="eventType"
                  value={tile.value}
                  checked={eventType === tile.value}
                  onChange={() => setEventType(tile.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-ink">{tile.title}</span>
                <span className="mt-1 block text-xs text-ink-soft">{tile.help}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <TextField
          label="Event name"
          name="title"
          defaultValue={v("title", event?.title)}
          errors={state.errors?.title}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Date"
            name="date"
            type="date"
            defaultValue={v("date", event?.date)}
            errors={state.errors?.date}
          />
          <TextField
            label="Start time"
            name="startTime"
            type="time"
            defaultValue={v("startTime", event?.startTime)}
            errors={state.errors?.startTime}
          />
        </div>

        <TextField
          label="Venue"
          name="venue"
          defaultValue={v("venue", event?.venue)}
          errors={state.errors?.venue}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="City"
            name="city"
            defaultValue={v("city", event?.city)}
            errors={state.errors?.city}
          />
          <TextField
            label="Country"
            name="country"
            defaultValue={v("country", event?.country)}
            errors={state.errors?.country}
          />
        </div>

        <TextField
          label="Poster or photo (link)"
          name="imageUrl"
          type="url"
          optional
          help="Leave empty to use a neutral placeholder."
          defaultValue={v("imageUrl", event?.imageUrl)}
          errors={state.errors?.imageUrl}
        />

        <TextareaField
          label="Short description"
          name="description"
          optional
          rows={4}
          help="A sentence or two about the evening."
          defaultValue={v("description", event?.description)}
          errors={state.errors?.description}
        />

        {eventType === "TICKETED_CONCERT" ? (
          <TextField
            label="Ticket link"
            name="ticketUrl"
            type="url"
            optional
            help="Where people buy tickets."
            defaultValue={v("ticketUrl", event?.ticketUrl)}
            errors={state.errors?.ticketUrl}
          />
        ) : (
          <TextField
            label="Venue or reservation link"
            name="venueUrl"
            type="url"
            optional
            help="Where people find the venue or reserve a table."
            defaultValue={v("venueUrl", event?.venueUrl)}
            errors={state.errors?.venueUrl}
          />
        )}

        <details className="rounded-md border border-line" open={detailsOpen}>
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink-soft select-none">
            Optional details
          </summary>
          <div className="space-y-6 border-t border-line px-4 py-5">
            <TextField
              label="End time"
              name="endTime"
              type="time"
              optional
              defaultValue={v("endTime", event?.endTime)}
              errors={state.errors?.endTime}
            />
            <TextField
              label="Address"
              name="address"
              optional
              help="Street and number, shown with the venue."
              defaultValue={v("address", event?.address)}
              errors={state.errors?.address}
            />
            <TextField
              label="Price"
              name="priceText"
              optional
              placeholder="e.g. € 15,00"
              help="Written exactly as it should appear, e.g. € 15,00 or Free entry."
              defaultValue={v("priceText", event?.priceText)}
              errors={state.errors?.priceText}
            />
            <TextField
              label="Collaborators or line-up"
              name="collaborators"
              optional
              help="Who plays with you that night."
              defaultValue={v("collaborators", event?.collaborators)}
              errors={state.errors?.collaborators}
            />
            <CheckboxField
              label="Highlight on the homepage"
              name="featured"
              defaultChecked={checked("featured", event?.featured ?? false)}
            />
            {event ? (
              <SelectField
                label="Event status"
                name="eventState"
                help="Mark the show sold out or cancelled — it stays visible, clearly labelled."
                defaultValue={v("eventState", event.eventState)}
                errors={state.errors?.eventState}
                options={[
                  { value: "SCHEDULED", label: "Scheduled" },
                  { value: "SOLD_OUT", label: "Sold out" },
                  { value: "CANCELLED", label: "Cancelled" },
                ]}
              />
            ) : null}
          </div>
        </details>

        {state.warning ? (
          <div role="alert" className="rounded-md border border-warn/50 bg-warn/5 p-4">
            <p className="text-sm font-semibold text-warn">Before you publish</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{state.warning}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="submit"
                name="acknowledgeWarnings"
                value="true"
                className={secondaryButtonClass}
              >
                Publish anyway
              </button>
              <button type="submit" name="intent" value="draft" className={secondaryButtonClass}>
                Save as draft instead
              </button>
            </div>
          </div>
        ) : null}

        <PublishButtons isPublished={event?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {event ? <DangerZone action={deleteEventAction} id={event.id} noun="event" /> : null}
    </div>
  );
}
