import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { ServiceDetail } from "@/components/public/ServiceDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getRepos().services.getBySlug("coaching");
  return {
    title: service?.title ?? "Band coaching",
    description:
      service?.shortDescription ??
      "Practical band coaching built around listening, space, groove and interaction — in English, Italian or Dutch.",
    alternates: { canonical: "/services/coaching" },
  };
}

export default async function CoachingServicePage() {
  const service = await getRepos().services.getBySlug("coaching");
  if (!service || service.status !== "PUBLISHED") notFound();

  return (
    <ServiceDetail
      service={service}
      inquiryType="COACHING"
      ctaLabel="Ask about coaching"
      placeholderLabel="Coaching — band rehearsal photo"
    />
  );
}
