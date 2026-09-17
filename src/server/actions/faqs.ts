"use server";

import { redirect } from "next/navigation";
import { faqInput } from "@/lib/validation/schemas";
import { uniqueSlug } from "@/lib/slug";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import {
  confirmedDeletion,
  fieldErrors,
  formValues,
  guardEditor,
  nextSortOrder,
  publicContentChanged,
  recordId,
  statusFromIntent,
  stripMeta,
  toRawInput,
} from "./shared";

const LIST_PATH = "/studio/faqs";

export async function saveFaqAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData);
  raw.status = statusFromIntent(formData);
  const parsed = faqInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  const repos = getRepos();
  if (id) {
    const existing = await repos.faqs.get(id);
    if (!existing) {
      return { errors: { _form: ["This Q&A no longer exists."] } };
    }
    await repos.faqs.update(id, { ...data });
  } else {
    const all = await repos.faqs.list();
    const slugs = new Set(all.map((f) => f.slug));
    await repos.faqs.create({
      ...data,
      slug: uniqueSlug(data.question, slugs),
      sortOrder: nextSortOrder(all),
    });
  }

  publicContentChanged("faqs");
  redirect(LIST_PATH);
}

export async function duplicateFaqAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.faqs.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.faqs.list();
  const question = `${existing.question} (copy)`;
  const slugs = new Set(all.map((f) => f.slug));
  await repos.faqs.create({
    ...stripMeta(existing),
    question,
    slug: uniqueSlug(question, slugs),
    status: "DRAFT",
    sortOrder: nextSortOrder(all),
  });

  publicContentChanged("faqs");
  redirect(LIST_PATH);
}

export async function archiveFaqAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().faqs.update(id, { status: "ARCHIVED" });
    publicContentChanged("faqs");
  }
  redirect(LIST_PATH);
}

export async function unpublishFaqAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().faqs.update(id, { status: "DRAFT" });
    publicContentChanged("faqs");
  }
  redirect(LIST_PATH);
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().faqs.remove(id);
    publicContentChanged("faqs");
  }
  redirect(LIST_PATH);
}
