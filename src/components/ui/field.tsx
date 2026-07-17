import { cn } from "@/lib/utils";

/** Form fields with mono labels (DESIGN.md §7 — Contacto). */

const inputClasses =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-ink " +
  "placeholder:text-ink-muted/80 transition-colors duration-150 " +
  "focus:border-blue-600 focus:outline-none aria-invalid:border-red-600";

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-ink font-mono text-xs font-medium tracking-wider uppercase"
    >
      {children}
      {required ? <span className="text-green-600"> *</span> : null}
    </label>
  );
}

/** Error message tied to its control via id + aria-describedby, announced politely. */
function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-sm text-red-700">
      {error}
    </p>
  );
}

interface BaseProps {
  label: string;
  id: string;
  error?: string;
  className?: string;
}

export function InputField({
  label,
  id,
  error,
  className,
  required,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses}
        {...props}
      />
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function TextareaField({
  label,
  id,
  error,
  className,
  required,
  ...props
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        name={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        rows={5}
        className={cn(inputClasses, "resize-y")}
        {...props}
      />
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  error,
  className,
  required,
  children,
  ...props
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <select
        id={id}
        name={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses}
        {...props}
      >
        {children}
      </select>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
