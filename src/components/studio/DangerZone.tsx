/**
 * Collapsed "Danger zone" with a confirm-checkbox-guarded delete.
 * Rendered as a sibling of the main edit form (forms cannot nest).
 * The checkbox is required, so deletion needs an explicit tick even without JS;
 * the server action additionally checks the confirmation before removing anything.
 */
export function DangerZone({
  action,
  id,
  noun,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  noun: string;
}) {
  return (
    <details className="mt-10 rounded-md border border-line">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink-soft select-none">
        Danger zone
      </summary>
      <form action={action} className="space-y-4 border-t border-line px-4 py-4">
        <input type="hidden" name="id" value={id} />
        <p className="text-sm leading-relaxed text-ink-soft">
          Deleting this {noun} removes it from the site permanently. If you might need it
          again later, archive it instead.
        </p>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            name="confirm"
            value="yes"
            required
            className="h-4 w-4 accent-(--color-danger)"
          />
          Yes, delete this {noun} permanently
        </label>
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-danger/50 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
        >
          Delete permanently
        </button>
      </form>
    </details>
  );
}
