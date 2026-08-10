import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { ServiceForm } from "@/components/studio/ServiceForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getRepos().services.get(id);
  if (!service) notFound();

  return (
    <div>
      <PageHeader
        title={service.title}
        intro="Changes are visible on the site as soon as you save."
      />
      <ServiceForm service={service} />
    </div>
  );
}
