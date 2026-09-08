import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { LibraryTrackForm } from "@/components/studio/LibraryTrackForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit track" };

export default async function EditLibraryTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const track = await getRepos().libraryTracks.get(id);
  if (!track) notFound();

  return (
    <div>
      <PageHeader title={track.title} intro="Changes go live as soon as you publish." />
      <LibraryTrackForm track={track} />
    </div>
  );
}
