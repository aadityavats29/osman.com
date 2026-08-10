import type { ReactNode } from "react";
import type { ServiceRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { TrackedLink } from "./TrackedLink";

/**
 * Shared editorial layout for the three service pages. Content comes from the
 * services repo; body is \n\n-separated plain text rendered as paragraphs.
 */
export function ServiceDetail({
  service,
  inquiryType,
  ctaLabel,
  placeholderLabel,
  note,
}: {
  service: ServiceRecord;
  inquiryType: "PERFORMANCE_BOOKING" | "COACHING" | "WORKSHOP";
  ctaLabel: string;
  placeholderLabel: string;
  note?: ReactNode;
}) {
  const paragraphs = service.body
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article>
      <section className="py-24 sm:py-32">
        <Container>
          <p className="eyebrow">Services</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-soft">
            {service.shortDescription}
          </p>
          {note && <div className="mt-6">{note}</div>}
        </Container>
        <Container wide className="mt-14">
          <PlaceholderImage label={placeholderLabel} ratio="3/1" />
        </Container>
        <Container className="mt-14">
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-6 leading-relaxed text-ink first:mt-0">
              {p}
            </p>
          ))}
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <TrackedLink
            href={`/contact?type=${inquiryType}`}
            event="service_inquiry_click"
            eventProps={{ service: service.slug }}
            className="inline-block bg-ink px-7 py-3 text-sm font-medium tracking-wide text-canvas uppercase transition-colors hover:bg-accent-strong"
          >
            {ctaLabel}
          </TrackedLink>
          <p className="mt-4 text-sm text-ink-soft">
            No forms required if you prefer email — details are on the contact page.
          </p>
        </Container>
      </section>
    </article>
  );
}
