"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productInput } from "@/lib/validation/schemas";
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
  stripMeta,
  toRawInput,
} from "./shared";

const LIST_PATH = "/studio/shop";

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  // Product visibility uses its own status select (Concept / Available / Archived).
  const raw = toRawInput(formData);
  const parsed = productInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  const repos = getRepos();
  if (id) {
    const existing = await repos.products.get(id);
    if (!existing) {
      return { errors: { _form: ["This item no longer exists."] } };
    }
    await repos.products.update(id, { ...data });
  } else {
    const all = await repos.products.list();
    const slugs = new Set(all.map((p) => p.slug));
    await repos.products.create({
      ...data,
      slug: uniqueSlug(data.title, slugs),
      externalCommerceId: null,
      sortOrder: nextSortOrder(all),
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateProductAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.products.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.products.list();
  const title = `${existing.title} (copy)`;
  const slugs = new Set(all.map((p) => p.slug));
  await repos.products.create({
    ...stripMeta(existing),
    title,
    slug: uniqueSlug(title, slugs),
    status: "CONCEPT",
    externalCommerceId: null,
    sortOrder: nextSortOrder(all),
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveProductAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().products.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().products.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
