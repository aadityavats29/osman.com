"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { liveVideoInput } from "@/lib/validation/schemas";
import { uniqueSlug } from "@/lib/slug";
import { vimeoId, youtubeId } from "@/lib/embed";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import {
  confirmedDeletion,
  fieldErrors,
  formValues,
  guardEditor,
  nextSortOrder,
  recordId,
  statusFromIntent,
  stripMeta,
  toRawInput,
} from "./shared";

const LIST_PATH = "/studio/videos";

export async function saveVideoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData, ["year"]);
  raw.status = statusFromIntent(formData);
  const parsed = liveVideoInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }

  const data = parsed.data;
  const yt = youtubeId(data.videoUrl);
  const vimeo = vimeoId(data.videoUrl);
  if (!yt && !vimeo) {
    return {
      errors: { videoUrl: ["Paste a full YouTube or Vimeo link."] },
      values: formValues(formData),
    };
  }
  data.platform = yt ? "youtube" : "vimeo";

  const repos = getRepos();
  if (id) {
    const existing = await repos.videos.get(id);
    if (!existing) {
      return { errors: { _form: ["This video no longer exists."] } };
    }
    await repos.videos.update(id, { ...data });
  } else {
    const all = await repos.videos.list();
    const slugs = new Set(all.map((v) => v.slug));
    await repos.videos.create({
      ...data,
      slug: uniqueSlug(data.title, slugs),
      sortOrder: nextSortOrder(all),
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.videos.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.videos.list();
  const title = `${existing.title} (copy)`;
  const slugs = new Set(all.map((v) => v.slug));
  await repos.videos.create({
    ...stripMeta(existing),
    title,
    slug: uniqueSlug(title, slugs),
    status: "DRAFT",
    sortOrder: nextSortOrder(all),
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().videos.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function unpublishVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().videos.update(id, { status: "DRAFT" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().videos.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
