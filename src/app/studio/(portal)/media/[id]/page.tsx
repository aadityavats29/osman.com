import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { MediaForm } from "@/components/studio/MediaForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit media article" };

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getRepos().media.get(id);
  if (!item) notFound();

  return (
    <div>
      <PageHeader title={item.headline} intro="Changes go live as soon as you publish." />
      <MediaForm item={item} />
    </div>
  );
}
