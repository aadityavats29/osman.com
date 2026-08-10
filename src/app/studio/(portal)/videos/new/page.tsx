import { VideoForm } from "@/components/studio/VideoForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add live video" };

export default function NewVideoPage() {
  return (
    <div>
      <PageHeader
        title="Add live video"
        intro="Paste a YouTube or Vimeo link and give it a title."
      />
      <VideoForm />
    </div>
  );
}
