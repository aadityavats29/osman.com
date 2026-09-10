/**
 * Osman Meyredi logotype — Round 2: the single-line horizontal wordmark
 * (traced into public/images/logo-horizontal.svg from the master folder's
 * "Osman Meyredi _Horizontal White.png"; the earlier two-line trace remains
 * at public/images/logo.svg, now unused).
 *
 * Renders the traced brand SVG via a CSS mask (.logo-mark in globals.css),
 * so it inherits the surrounding text color — ink in the header, any theme,
 * no extra assets.
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
