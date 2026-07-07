import { cn } from "@/lib/utils";

/** Mono tag/badge, e.g. material chips ("ABS", "ISO 9001:2015"). */
export function Badge({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-xs tracking-wider uppercase",
        tone === "dark"
          ? "border-blue-400/40 text-green-300"
          : "border-line text-ink-muted bg-surface",
        className,
      )}
    >
      {children}
    </span>
  );
}
