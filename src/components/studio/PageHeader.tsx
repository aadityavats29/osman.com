import Link from "next/link";
import type { ReactNode } from "react";
import { primaryButtonClass } from "./fields";

export function PageHeader({
  title,
  intro,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  intro?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-xl">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {intro ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{intro}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={primaryButtonClass}>
          {actionLabel}
        </Link>
      ) : null}
      {children}
    </header>
  );
}

export function EmptyState({
  message,
  actionHref,
  actionLabel,
}: {
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-line px-6 py-10 text-center">
      <p className="text-sm text-ink-soft">{message}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={`${primaryButtonClass} mt-4`}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
