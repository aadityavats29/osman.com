import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { CollaborationForm } from "@/components/studio/CollaborationForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit collaboration" };

export default async function EditCollaborationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collaboration = await getRepos().collaborations.get(id);
  if (!collaboration) notFound();

  return (
    <div>
      <PageHeader title={collaboration.name} intro="Changes go live as soon as you publish." />
      <CollaborationForm collaboration={collaboration} />
    </div>
  );
}
