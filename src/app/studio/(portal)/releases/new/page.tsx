import { ReleaseForm } from "@/components/studio/ReleaseForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add release" };

export default function NewReleasePage() {
  return (
    <div>
      <PageHeader
        title="Add release"
        intro="Add the music and the links where people can listen."
      />
      <ReleaseForm />
    </div>
  );
}
