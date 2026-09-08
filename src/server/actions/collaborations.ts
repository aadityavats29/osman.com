"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { collaborationInput } from "@/lib/validation/schemas";
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

const LIST_PATH = "/studio/collaborations";

export async function saveCollaborationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData, ["startYear", "endYear"]);
  raw.status = statusFromIntent(formData);
  const parsed = collaborationInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  const repos = getRepos();
  if (id) {
    const existing = await repos.collaborations.get(id);
    if (!existing) {
      return { errors: { _form: ["This collaboration no longer exists."] } };
    }
    await repos.collaborations.update(id, { ...data });
  } else {
    const all = await repos.collaborations.list();
    const slugs = new Set(all.map((c) => c.slug));
    await repos.collaborations.create({
      ...data,
      slug: uniqueSlug(data.name, slugs),
      sortOrder: nextSortOrder(all),
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateCollaborationAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.collaborations.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.collaborations.list();
  const name = `${existing.name} (copy)`;
  const slugs = new Set(all.map((c) => c.slug));
  await repos.collaborations.create({
    ...stripMeta(existing),
    name,
    slug: uniqueSlug(name, slugs),
    status: "DRAFT",
    sortOrder: nextSortOrder(all),
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveCollaborationAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().collaborations.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function unpublishCollaborationAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().collaborations.update(id, { status: "DRAFT" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteCollaborationAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().collaborations.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
