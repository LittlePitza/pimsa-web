/**
 * Inline status select + save button used by the leads and applications
 * lists. Server component: receives an already-bound server action.
 */
export function StatusForm({
  action,
  id,
  label,
  context,
  statuses,
  statusLabels,
  defaultValue,
}: {
  action: (formData: FormData) => Promise<void>;
  /** Unique form control id, e.g. `lead-status-12`. */
  id: string;
  /** sr-only label for the select, e.g. "Estado del lead". */
  label: string;
  /** Accessible context for the save button, e.g. the person's name. */
  context: string;
  statuses: readonly string[];
  statusLabels: Record<string, string>;
  defaultValue: string;
}) {
  return (
    <form action={action} className="flex items-center gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name="status"
        defaultValue={defaultValue}
        className="border-line bg-surface text-ink rounded-sm border px-2 py-1.5 text-sm"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        aria-label={`Guardar estado de ${context}`}
        className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
      >
        Guardar
      </button>
    </form>
  );
}
