import { LibraryTrackForm } from "@/components/studio/LibraryTrackForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add track" };

export default function NewLibraryTrackPage() {
  return (
    <div>
      <PageHeader
        title="Add track"
        intro="Title, genre and moods help people find it; the audio link makes it playable."
      />
      <LibraryTrackForm />
    </div>
  );
}
