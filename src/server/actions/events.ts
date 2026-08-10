"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eventInput } from "@/lib/validation/schemas";
import { publishWarnings } from "@/lib/events";
import { uniqueSlug } from "@/lib/slug";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import {
  acknowledgedWarnings,
  confirmedDeletion,
  fieldErrors,
  formValues,
  guardEditor,
  recordId,
  statusFromIntent,
  stripMeta,
  toRawInput,
} from "./shared";

const LIST_PATH = "/studio/events";

export async function saveEventAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData);
  raw.status = statusFromIntent(formData);
  const parsed = eventInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }

  const data = parsed.data;
  // A free gig never carries a ticket link, whatever was submitted.
  if (data.eventType === "FREE_GIG") data.ticketUrl = null;

  if (data.status === "PUBLISHED" && !acknowledgedWarnings(formData)) {
    const warnings = publishWarnings(data);
    if (warnings.length > 0) {
      return { warning: warnings.join(" "), values: formValues(formData) };
    }
  }

  const repos = getRepos();
  if (id) {
    const existing = await repos.events.get(id);
    if (!existing) {
      return { errors: { _form: ["This event no longer exists."] } };
    }
    const publishedAt =
      existing.publishedAt ??
      (data.status === "PUBLISHED" ? new Date().toISOString() : null);
    await repos.events.update(id, { ...data, publishedAt });
  } else {
    const slugs = new Set((await repos.events.list()).map((e) => e.slug));
    await repos.events.create({
      ...data,
      slug: uniqueSlug(data.title, slugs),
      publishedAt: data.status === "PUBLISHED" ? new Date().toISOString() : null,
    });
  }

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function duplicateEventAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.events.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const title = `${existing.title} (copy)`;
  const slugs = new Set((await repos.events.list()).map((e) => e.slug));
  await repos.events.create({
    ...stripMeta(existing),
    title,
    slug: uniqueSlug(title, slugs),
    status: "DRAFT",
    publishedAt: null,
  });

  revalidatePath("/", "layout");
  redirect(LIST_PATH);
}

export async function archiveEventAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().events.update(id, { status: "ARCHIVED" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function unpublishEventAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().events.update(id, { status: "DRAFT" });
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().events.remove(id);
    revalidatePath("/", "layout");
  }
  redirect(LIST_PATH);
}
