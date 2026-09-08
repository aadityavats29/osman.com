import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { ServiceDetail } from "@/components/public/ServiceDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getRepos().services.getBySlug("workshops");
  return {
    title: service?.title ?? "Workshops — listening & collaboration",
    description:
      service?.shortDescription ??
      "Music-based listening and collaboration workshops for organisations and teams. No musical experience required.",
    alternates: { canonical: "/services/workshops" },
  };
}

export default async function WorkshopsServicePage() {
  const service = await getRepos().services.getBySlug("workshops");
  if (!service || service.status !== "PUBLISHED") notFound();

  return (
    <ServiceDetail
      service={service}
      inquiryType="WORKSHOP"
      ctaLabel="Ask about a workshop"
      placeholderLabel="Workshops — group session photo"
    />
  );
}
