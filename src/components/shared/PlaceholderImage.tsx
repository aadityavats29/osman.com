/**
 * Deliberate, clearly-temporary visual placeholder.
 * Used wherever a real photo/artwork will eventually go (TODO markers for Osman's
 * assets). Preserves the final aspect ratio so swapping in real images never
 * requires layout changes.
 */
export function PlaceholderImage({
  label,
  ratio = "3/2",
  dark = false,
  className = "",
}: {
  /** What belongs here eventually, e.g. "Portrait — stage photo" */
  label: string;
  /** CSS aspect-ratio value, e.g. "3/2", "1/1", "16/9" */
  ratio?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      style={{ aspectRatio: ratio }}
      className={`relative flex w-full items-end overflow-hidden border ${
        dark
          ? "border-(--color-line-dark) bg-[#211d16] text-(--color-ink-faint)"
          : "border-(--color-line) bg-(--color-canvas-soft) text-(--color-ink-faint)"
      } ${className}`}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-40"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.25" />
      </svg>
      <span className="relative p-3 text-[0.7rem] font-medium tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}
