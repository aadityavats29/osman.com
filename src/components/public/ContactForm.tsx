"use client";

import { useActionState, useState } from "react";
import { submitContact, type ContactFormState } from "@/server/actions/contact";
import { trackEvent } from "@/lib/analytics";

const INQUIRY_OPTIONS: { value: string; label: string }[] = [
  { value: "PERFORMANCE_BOOKING", label: "Performance booking" },
  { value: "COACHING", label: "Coaching" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "PRESS_MEDIA", label: "Press & media" },
  { value: "COLLABORATION_SESSION", label: "Collaboration & session" },
  { value: "GENERAL", label: "General" },
];

const INITIAL_STATE: ContactFormState = { ok: false };

const inputClass =
  "w-full border border-line bg-canvas px-3.5 py-2.5 text-base text-ink placeholder:text-ink-faint focus:border-ink";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {messages[0]}
    </p>
  );
}

export function ContactForm({
  initialType,
  contactEmail,
}: {
  initialType?: string;
  contactEmail: string;
}) {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_STATE);
  const [inquiryType, setInquiryType] = useState(
    INQUIRY_OPTIONS.some((o) => o.value === initialType) ? (initialType as string) : "GENERAL"
  );

  if (state.ok) {
    return (
      <div role="status" className="border-t border-line pt-8">
        <h2 className="font-display text-2xl">Thank you — your message is on its way.</h2>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Osman reads every inquiry himself and will reply as soon as he can, usually within a
          few days. If your date is close or something changes in the meantime, you can always
          write directly to{" "}
          <a href={`mailto:${contactEmail}`} className="u-link">
            {contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const detailsOpen = Boolean(errors.organisation || errors.eventDate || errors.location);

  return (
    <form
      action={formAction}
      onSubmit={() => trackEvent("contact_submit", { type: inquiryType })}
      noValidate={false}
      className="space-y-6"
    >
      {!state.ok && state.message && (
        <p role="alert" className="border border-line bg-canvas-soft px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          <FieldError id="contact-name-error" messages={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          <FieldError id="contact-email-error" messages={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-type" className={labelClass}>
          What is this about?
        </label>
        <select
          id="contact-type"
          name="inquiryType"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className={inputClass}
          aria-invalid={errors.inquiryType ? true : undefined}
          aria-describedby={errors.inquiryType ? "contact-type-error" : undefined}
        >
          {INQUIRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FieldError id="contact-type-error" messages={errors.inquiryType} />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          className={inputClass}
          placeholder="The occasion, the room, the atmosphere you have in mind — whatever you already know."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        <FieldError id="contact-message-error" messages={errors.message} />
      </div>

      <details open={detailsOpen || undefined} className="border-t border-line pt-5">
        <summary className="cursor-pointer text-sm font-medium underline underline-offset-4">
          More about your event (optional)
        </summary>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="contact-organisation" className={labelClass}>
              Organisation
            </label>
            <input
              id="contact-organisation"
              name="organisation"
              type="text"
              autoComplete="organization"
              className={inputClass}
              aria-invalid={errors.organisation ? true : undefined}
              aria-describedby={errors.organisation ? "contact-organisation-error" : undefined}
            />
            <FieldError id="contact-organisation-error" messages={errors.organisation} />
          </div>
          <div>
            <label htmlFor="contact-event-date" className={labelClass}>
              Event date
            </label>
            <input
              id="contact-event-date"
              name="eventDate"
              type="date"
              className={inputClass}
              aria-invalid={errors.eventDate ? true : undefined}
              aria-describedby={errors.eventDate ? "contact-event-date-error" : undefined}
            />
            <FieldError id="contact-event-date-error" messages={errors.eventDate} />
          </div>
          <div>
            <label htmlFor="contact-location" className={labelClass}>
              Location
            </label>
            <input
              id="contact-location"
              name="location"
              type="text"
              className={inputClass}
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={errors.location ? "contact-location-error" : undefined}
            />
            <FieldError id="contact-location-error" messages={errors.location} />
          </div>
        </div>
      </details>

      {/* Honeypot — hidden from real visitors, ignored by assistive technology. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-block bg-ink px-7 py-3 text-sm font-medium tracking-wide text-canvas uppercase transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
