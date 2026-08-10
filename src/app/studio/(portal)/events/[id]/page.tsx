import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { EventForm } from "@/components/studio/EventForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit show" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getRepos().events.get(id);
  if (!event) notFound();

  return (
    <div>
      <PageHeader title={event.title} intro="Changes go live as soon as you publish." />
      <EventForm event={event} />
    </div>
  );
}
