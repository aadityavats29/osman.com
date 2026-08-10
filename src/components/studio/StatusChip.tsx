import type { ReactNode } from "react";
import type { ContentStatus, EventState, ProductStatus } from "@/lib/types";

type Tone = "ok" | "warn" | "danger" | "faint";

const toneClasses: Record<Tone, string> = {
  ok: "border-ok/40 text-ok",
  warn: "border-warn/50 text-warn",
  danger: "border-danger/40 text-danger",
  faint: "border-line text-ink-faint",
};

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: ContentStatus }) {
  if (status === "PUBLISHED") return <Chip tone="ok">Published</Chip>;
  if (status === "ARCHIVED") return <Chip tone="faint">Archived</Chip>;
  return <Chip tone="warn">Draft</Chip>;
}

/** Only renders for the states worth flagging — a scheduled event shows nothing. */
export function EventStateChip({ state }: { state: EventState }) {
  if (state === "SOLD_OUT") return <Chip tone="danger">Sold out</Chip>;
  if (state === "CANCELLED") return <Chip tone="danger">Cancelled</Chip>;
  return null;
}

export function ProductStatusChip({ status }: { status: ProductStatus }) {
  if (status === "AVAILABLE") return <Chip tone="ok">Available</Chip>;
  if (status === "ARCHIVED") return <Chip tone="faint">Archived</Chip>;
  return <Chip tone="warn">Concept</Chip>;
}
