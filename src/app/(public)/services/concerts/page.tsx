import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { ServiceDetail } from "@/components/public/ServiceDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getRepos().services.getBySlug("concerts");
  return {
    title: service?.title ?? "Concerts & live performance",
    description:
      service?.shortDescription ??
      "Book Osman Meyredi for private events, weddings, corporate evenings, intimate concerts, festivals and session work.",
    alternates: { canonical: "/services/concerts" },
  };
}

export default async function ConcertsServicePage() {
  const service = await getRepos().services.getBySlug("concerts");
  if (!service || service.status !== "PUBLISHED") notFound();

  return (
    <ServiceDetail
      service={service}
      inquiryType="PERFORMANCE_BOOKING"
      ctaLabel="Ask about booking a performance"
      placeholderLabel="Concerts — live performance photo"
      note={
        <p className="border-l-2 border-accent pl-4 text-sm text-ink-soft">
          Looking for tickets to an upcoming show?{" "}
          <Link href="/shows/concerts" className="u-link">
            See Shows
          </Link>
          . This page is about booking Osman to perform at your event.
        </p>
      }
    />
  );
}
