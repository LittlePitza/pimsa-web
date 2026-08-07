"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A recipient list that shows what it understood.
 *
 * The value posts as one plain string — the server owns parsing and
 * normalising, and a JavaScript-free browser still submits a usable field.
 * What the chips add is the answer to the question this control kept getting
 * wrong in a bare text input: *did it read my separators the way I meant
 * them?* A pasted "ventas@pimsa.com; rh@pimsa.com" splitting into two chips
 * settles that before anyone waits on a lead that never arrives.
 */

/** Mirrors the server's parser in `@/lib/email/config`. */
function parse(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Deliberately loose: "something@something.tld". The authority on what counts
 * as valid is the zod schema on the server — this only has to catch the
 * mistakes people actually make (a missing @, a trailing comma, a typo'd
 * domain with no dot) without rejecting an address the server would accept.
 */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EmailListField({
  id,
  label,
  defaultValue = "",
  placeholder,
  hint,
  required = false,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const hintId = useId();

  const entries = parse(value);
  const invalid = entries.filter((entry) => !LOOKS_LIKE_EMAIL.test(entry));

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-ink font-mono text-xs font-medium tracking-wider uppercase"
      >
        {label}
        {required ? <span className="text-green-600"> *</span> : null}
      </label>

      <input
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        maxLength={500}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hintId}
        aria-invalid={invalid.length > 0}
        className={cn(
          "border-line bg-surface text-ink placeholder:text-ink-muted/80 w-full rounded-sm border px-4 py-3",
          "transition-colors duration-150 focus:outline-none",
          invalid.length > 0 ? "border-red-600" : "focus:border-blue-600",
        )}
      />

      <div id={hintId} className="flex flex-col gap-2">
        {entries.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {entries.map((entry, index) => {
              const ok = LOOKS_LIKE_EMAIL.test(entry);
              return (
                <li
                  key={`${entry}-${index}`}
                  className={cn(
                    "rounded-full px-2.5 py-1 font-mono text-xs",
                    ok
                      ? "bg-navy-500/10 text-navy-500"
                      : "border border-red-200 bg-red-50 text-red-800",
                  )}
                >
                  {ok ? entry : `${entry} — no parece un correo`}
                </li>
              );
            })}
          </ul>
        ) : null}

        {hint ? <p className="text-ink-muted text-xs">{hint}</p> : null}
      </div>
    </div>
  );
}
