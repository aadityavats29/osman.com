/**
 * Small inline forms for list-row actions (Duplicate, Archive, Unpublish).
 * Plain server-rendered forms — they work without JavaScript.
 */
export function RowAction({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs font-medium text-ink-soft underline-offset-2 hover:text-accent hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
