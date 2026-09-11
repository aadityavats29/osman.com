import { FaqForm } from "@/components/studio/FaqForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add Q&A" };

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader
        title="Add Q&A"
        intro="One question visitors actually ask, answered in a sentence or two of approved wording."
      />
      <FaqForm />
    </div>
  );
}
