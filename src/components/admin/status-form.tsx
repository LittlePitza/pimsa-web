"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Inline status select + save button used by the leads and applications
 * lists.
 *
 * The button stays disabled until the value actually changes, so the row
 * never invites a no-op write, and it reports its own pending state — the
 * previous version gave no sign at all that a save was in flight, which on a
 * remote database reads as a dead click.
 */
function SaveButton({ context, dirty }: { context: string; dirty: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!dirty || pending}
      aria-label={`Guardar estado de ${context}`}
      className={cn(
        "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
        dirty && !pending
          ? "text-navy-500 hover:bg-navy-500/10"
          : "text-ink-muted cursor-not-allowed",
      )}
    >
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

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
  const [value, setValue] = useState(defaultValue);

  return (
    <form action={action} className="flex items-center gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name="status"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="border-line bg-surface text-ink rounded-sm border px-2 py-1.5 text-sm transition-colors focus:border-blue-600 focus:outline-none"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>
      <SaveButton context={context} dirty={value !== defaultValue} />
    </form>
  );
}
