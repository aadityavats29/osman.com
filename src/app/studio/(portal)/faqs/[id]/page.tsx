import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { FaqForm } from "@/components/studio/FaqForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Q&A" };

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getRepos().faqs.get(id);
  if (!item) notFound();

  return (
    <div>
      <PageHeader title={item.question} intro="Changes go live as soon as you publish." />
      <FaqForm item={item} />
    </div>
  );
}
