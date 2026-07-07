import { cn } from "@/lib/utils";

/**
 * Typographic logo placeholder with the loop motif.
 * TODO(marketing): replace with the official vector logo once delivered
 * (docs/marketing-material-request.md §1).
 */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden
        className="size-8"
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
      >
        {/* Open loop — the circularity motif (DESIGN.md §4.4) */}
        <path
          d="M28 16a12 12 0 1 1-6.5-10.68"
          className={tone === "dark" ? "stroke-paper" : "stroke-navy-500"}
        />
        <circle cx="25" cy="7" r="3.2" className="fill-green-500" stroke="none" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-bold tracking-tight",
            tone === "dark" ? "text-paper" : "text-navy-500",
          )}
        >
          PIMSA
        </span>
        <span
          className={cn(
            "font-mono text-[0.55rem] tracking-[0.22em] uppercase",
            tone === "dark" ? "text-blue-400" : "text-ink-muted",
          )}
        >
          Plásticos de Ingeniería
        </span>
      </span>
    </span>
  );
}
