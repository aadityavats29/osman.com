import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { VideoForm } from "@/components/studio/VideoForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit live video" };

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getRepos().videos.get(id);
  if (!video) notFound();

  return (
    <div>
      <PageHeader title={video.title} intro="Changes go live as soon as you publish." />
      <VideoForm video={video} />
    </div>
  );
}
