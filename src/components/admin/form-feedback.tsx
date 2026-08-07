import type { ActionState } from "@/app/admin/actions";

/**
 * The result of a server action, rendered the same way everywhere.
 *
 * `role` differs by outcome on purpose: an error is announced assertively
 * because it interrupts what the person was doing, while a confirmation is
 * polite — it should not cut across a screen reader mid-sentence.
 */
export function FormFeedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800"
      >
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p
        role="status"
        className="border-line bg-surface rounded-sm border border-l-4 border-l-green-600 p-4 text-sm"
      >
        {state.success}
      </p>
    );
  }
  return null;
}
