"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mediaItemInput } from "@/lib/validation/schemas";
import { uniqueSlug } from "@/lib/slug";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import {
  confirmedDeletion,
  fieldErrors,
  formValues,
  guardEditor,
  recordId,
  statusFromIntent,
  stripMeta,
  toRawInput,
} from "./shared";

const LIST_PATH = "/studio/media";

export async function saveMediaItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData);
  raw.status = statusFromIntent(formData);
  const parsed = mediaItemInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  const repos = getRepos();
  if (id) {
    const existing = await repos.media.get(id);
    if (!existing) {
      return { errors: { _form: ["This media item no longer exists."] } };
    }
    await repos.media.update(id, { ...data });
  } else {
    const slugs = new Set((await repos.media.list()).map((m) => m.slug));
    await repos.media.create({
      ...data,
      slug: uniqueSlug(data.headline, slugs),
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateMediaItemAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.media.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const headline = `${existing.headline} (copy)`;
  const slugs = new Set((await repos.media.list()).map((m) => m.slug));
  await repos.media.create({
    ...stripMeta(existing),
    headline,
    slug: uniqueSlug(headline, slugs),
    status: "DRAFT",
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveMediaItemAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().media.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function unpublishMediaItemAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().media.update(id, { status: "DRAFT" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteMediaItemAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().media.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
