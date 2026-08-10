import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { StatusChip } from "@/components/studio/StatusChip";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getRepos().services.list();
  const sorted = [...services].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Services"
        intro="These three pages are a fixed part of the site — edit their text and images here."
      />

      <ul className="divide-y divide-line rounded-md border border-line">
        {sorted.map((service) => (
          <li key={service.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            <span className="min-w-0 flex-1">
              <Link
                href={`/studio/services/${service.id}`}
                className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
              >
                {service.title}
              </Link>
              <span className="block truncate text-xs text-ink-faint">
                {service.shortDescription}
              </span>
            </span>
            <StatusChip status={service.status} />
            <Link
              href={`/studio/services/${service.id}`}
              className="text-xs font-medium text-accent underline-offset-2 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
