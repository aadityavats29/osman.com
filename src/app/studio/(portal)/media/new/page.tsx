import { MediaForm } from "@/components/studio/MediaForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add media article" };

export default function NewMediaPage() {
  return (
    <div>
      <PageHeader
        title="Add media article"
        intro="Link to a piece written or recorded about your work."
      />
      <MediaForm />
    </div>
  );
}
