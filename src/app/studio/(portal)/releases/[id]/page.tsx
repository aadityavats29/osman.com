import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { ReleaseForm } from "@/components/studio/ReleaseForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit release" };

export default async function EditReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const release = await getRepos().releases.get(id);
  if (!release) notFound();

  return (
    <div>
      <PageHeader title={release.title} intro="Changes go live as soon as you publish." />
      <ReleaseForm release={release} />
    </div>
  );
}
