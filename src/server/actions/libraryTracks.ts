"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { libraryTrackInput } from "@/lib/validation/schemas";
import { uniqueSlug } from "@/lib/slug";
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

const LIST_PATH = "/studio/library";

export async function saveLibraryTrackAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData, ["durationSec"]);
  raw.status = statusFromIntent(formData);
  const parsed = libraryTrackInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  const repos = getRepos();
  if (id) {
    const existing = await repos.libraryTracks.get(id);
    if (!existing) {
      return { errors: { _form: ["This track no longer exists."] } };
    }
    await repos.libraryTracks.update(id, { ...data });
  } else {
    const all = await repos.libraryTracks.list();
    const slugs = new Set(all.map((t) => t.slug));
    await repos.libraryTracks.create({
      ...data,
      slug: uniqueSlug(data.title, slugs),
      sortOrder: nextSortOrder(all),
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateLibraryTrackAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.libraryTracks.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.libraryTracks.list();
  const title = `${existing.title} (copy)`;
  const slugs = new Set(all.map((t) => t.slug));
  await repos.libraryTracks.create({
    ...stripMeta(existing),
    title,
    slug: uniqueSlug(title, slugs),
    status: "DRAFT",
    sortOrder: nextSortOrder(all),
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveLibraryTrackAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().libraryTracks.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function unpublishLibraryTrackAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().libraryTracks.update(id, { status: "DRAFT" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteLibraryTrackAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().libraryTracks.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
