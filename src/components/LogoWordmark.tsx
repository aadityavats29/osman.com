/**
 * Osman Meyredi logotype (two-line lowercase wordmark).
 *
 * Renders the traced brand SVG (public/images/logo.svg) via a CSS mask
 * (.logo-mark in globals.css), so it inherits the surrounding text color —
 * ink in the header, faint in the footer marquee, any theme, no extra assets.
 *
 * Pass `label` when the mark stands alone as meaningful content; omit it
 * inside links that already have an accessible name (the default renders
 * aria-hidden).
 */
export function LogoWordmark({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`logo-mark ${className}`}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    />
  );
}
