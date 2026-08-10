/** Deterministic slug generation for portal content. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

/** Ensures uniqueness against a set of existing slugs by appending -2, -3, ... */
export function uniqueSlug(base: string, existing: Set<string>): string {
  const s = slugify(base);
  if (!existing.has(s)) return s;
  let i = 2;
  while (existing.has(`${s}-${i}`)) i += 1;
  return `${s}-${i}`;
}
