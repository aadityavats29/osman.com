"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { releaseInput } from "@/lib/validation/schemas";
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

const LIST_PATH = "/studio/releases";

export async function saveReleaseAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData, ["year"]);
  raw.status = statusFromIntent(formData);
  const parsed = releaseInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  const repos = getRepos();
  if (id) {
    const existing = await repos.releases.get(id);
    if (!existing) {
      return { errors: { _form: ["This release no longer exists."] } };
    }
    await repos.releases.update(id, { ...data });
  } else {
    const all = await repos.releases.list();
    const slugs = new Set(all.map((r) => r.slug));
    await repos.releases.create({
      ...data,
      slug: uniqueSlug(data.title, slugs),
      sortOrder: nextSortOrder(all),
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateReleaseAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.releases.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.releases.list();
  const title = `${existing.title} (copy)`;
  const slugs = new Set(all.map((r) => r.slug));
  await repos.releases.create({
    ...stripMeta(existing),
    title,
    slug: uniqueSlug(title, slugs),
    status: "DRAFT",
    sortOrder: nextSortOrder(all),
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveReleaseAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().releases.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function unpublishReleaseAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().releases.update(id, { status: "DRAFT" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteReleaseAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().releases.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
