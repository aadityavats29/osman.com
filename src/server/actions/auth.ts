"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcryptjs from "bcryptjs";
import { loginInput } from "@/lib/validation/schemas";
import { createSession, destroySession, getSessionUser } from "@/lib/auth/session";
import { getRepos } from "@/server/repositories";
import { rateLimit } from "@/lib/rateLimit";
import type { ActionState } from "@/components/studio/actionState";
import { fieldErrors } from "./shared";

const GENERIC_FAILURE = "That email or password doesn't match.";

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (await getSessionUser()) redirect("/studio");

  const emailRaw = formData.get("email");
  const values = { email: typeof emailRaw === "string" ? emailRaw : "" };

  const parsed = loginInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values };
  }
  const { email, password } = parsed.data;

  const requestHeaders = await headers();
  const ip = (requestHeaders.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!rateLimit(`login:${ip}:${email.toLowerCase()}`, 5, 10 * 60 * 1000)) {
    return {
      errors: { _form: ["Too many attempts. Please wait ten minutes and try again."] },
      values,
    };
  }

  const user = await getRepos().users.findByEmail(email);
  const passwordMatches = user
    ? await bcryptjs.compare(password, user.passwordHash)
    : false;
  if (!user || !passwordMatches) {
    return { errors: { _form: [GENERIC_FAILURE] }, values };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  redirect("/studio");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/studio/login");
}
