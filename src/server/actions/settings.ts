"use server";

import { revalidatePath } from "next/cache";
import { siteSettingsInput } from "@/lib/validation/schemas";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import { fieldErrors, formValues, guardEditor, toRawInput } from "./shared";

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();

  const raw = toRawInput(formData);
  const parsed = siteSettingsInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }
  const data = parsed.data;

  if (data.shopMode === "external" && !data.shopUrl) {
    return {
      errors: { shopUrl: ["Add the address of the external shop first."] },
      values: formValues(formData),
    };
  }

  await getRepos().settings.set(data);
  revalidatePath("/", "layout");
  return { ok: true };
}
