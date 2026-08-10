import "server-only";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireEditor } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/types";

/**
 * Helpers shared by the studio server actions.
 * Not a "use server" file — nothing here is directly callable from the client.
 */

/** Every mutating action calls this first. Not signed in (or read-only) → login screen. */
export async function guardEditor(): Promise<SessionUser> {
  let user: SessionUser | null = null;
  try {
    user = await requireEditor();
  } catch {
    user = null;
  }
  if (!user) redirect("/studio/login");
  return user;
}

/** All string fields of a FormData, minus React/Next internal $ACTION entries. */
export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) out[key] = value;
  }
  return out;
}

/**
 * FormData → plain object for zod. Keys listed in `emptyAsMissing` are removed
 * when blank so schema defaults apply (needed for coerced number fields like year).
 */
export function toRawInput(
  formData: FormData,
  emptyAsMissing: string[] = []
): Record<string, unknown> {
  const obj: Record<string, unknown> = { ...formValues(formData) };
  for (const key of emptyAsMissing) {
    if (obj[key] === "") delete obj[key];
  }
  return obj;
}

/** Flattens a zod error into { field: [messages] }, with "_form" for form-level issues. */
export function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const flat = z.flattenError(error);
  const out: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) out[key] = messages as string[];
  }
  if (flat.formErrors.length > 0) out._form = flat.formErrors;
  return out;
}

/** "Publish now" / "Save as draft" submit buttons → content status. */
export function statusFromIntent(formData: FormData): "PUBLISHED" | "DRAFT" {
  if (acknowledgedWarnings(formData)) return "PUBLISHED";
  return formData.get("intent") === "publish" ? "PUBLISHED" : "DRAFT";
}

/** True when the user pressed "Publish anyway" on a publish warning. */
export function acknowledgedWarnings(formData: FormData): boolean {
  return formData.get("acknowledgeWarnings") === "true";
}

/** The hidden "id" field on edit forms and row-action forms; null on create. */
export function recordId(formData: FormData): string | null {
  const id = formData.get("id");
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** New items go to the end of manually-ordered collections. */
export function nextSortOrder(rows: Array<{ sortOrder: number }>): number {
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}

/** Copy of a record without id/createdAt/updatedAt — the shape create() expects. */
export function stripMeta<T extends { id: string }>(
  record: T
): Omit<T, "id" | "createdAt" | "updatedAt"> {
  const copy: Record<string, unknown> = { ...record };
  delete copy.id;
  delete copy.createdAt;
  delete copy.updatedAt;
  return copy as Omit<T, "id" | "createdAt" | "updatedAt">;
}

/** The delete confirm checkbox in the danger zone. */
export function confirmedDeletion(formData: FormData): boolean {
  return formData.get("confirm") === "yes";
}
