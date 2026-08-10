import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/studio/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in — Osman Studio",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/studio");

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white/50 p-8">
        <p className="font-display text-2xl text-ink">Osman Studio</p>
        <p className="mt-1 text-sm text-ink-faint">Sign in to manage the site.</p>
        <LoginForm />
      </div>
    </main>
  );
}
