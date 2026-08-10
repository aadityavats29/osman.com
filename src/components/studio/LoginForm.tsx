"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/actions/auth";
import { initialActionState } from "./actionState";
import { FormError, TextField, primaryButtonClass } from "./fields";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <FormError errors={state.errors} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        errors={state.errors?.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state.errors?.password}
      />
      <button type="submit" disabled={pending} className={`${primaryButtonClass} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
