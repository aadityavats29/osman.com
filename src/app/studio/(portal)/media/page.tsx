import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { mediaTypeLabels } from "@/components/studio/labels";
import { Chip, StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveMediaItemAction,
  duplicateMediaItemAction,
  unpublishMediaItemAction,
} from "@/server/actions/mediaItems";

export const dynamic = "force-dynamic";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  const items = await getRepos().media.list();
  const sorted = [...items].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Media"
        intro="Articles, interviews, podcasts and reviews about your work."
        actionHref="/studio/media/new"
        actionLabel="Add media article"
      />

      {sorted.length === 0 ? (
        <EmptyState
          message="No media coverage yet."
          actionHref="/studio/media/new"
          actionLabel="Add media article"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {sorted.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/media/${item.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {item.headline}
                </Link>
                <span className="block truncate text-xs text-ink-faint">
                  {[item.publication, mediaTypeLabels[item.mediaType], item.date]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusChip status={item.status} />
                {item.featured ? <Chip tone="faint">Featured</Chip> : null}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/media/${item.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateMediaItemAction} id={item.id} label="Duplicate" />
                {item.status === "PUBLISHED" ? (
                  <RowAction action={unpublishMediaItemAction} id={item.id} label="Unpublish" />
                ) : null}
                {item.status !== "ARCHIVED" ? (
                  <RowAction action={archiveMediaItemAction} id={item.id} label="Archive" />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
