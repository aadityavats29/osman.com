"use server";

import { serviceInput } from "@/lib/validation/schemas";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import { publicContentChanged, fieldErrors, formValues, guardEditor, recordId, toRawInput } from "./shared";

/**
 * Services are a fixed set of three pages — no create, no delete.
 * Saving returns { ok: true } so the edit page can confirm in place.
 */
export async function saveServiceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);
  if (!id) {
    return { errors: { _form: ["This page no longer exists."] } };
  }

  const raw = toRawInput(formData);
  raw.status = formData.get("published") === "true" ? "PUBLISHED" : "DRAFT";
  const parsed = serviceInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }

  const repos = getRepos();
  const existing = await repos.services.get(id);
  if (!existing) {
    return { errors: { _form: ["This page no longer exists."] } };
  }

  await repos.services.update(id, { ...parsed.data });
  publicContentChanged("services");
  return { ok: true };
}
