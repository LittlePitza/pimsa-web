import { cn } from "@/lib/utils";

/**
 * Mono uppercase label — THE signature detail (DESIGN.md §3).
 * Used as eyebrow above headings: "01 — RECOLECCIÓN DE SCRAP".
 */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  /** "light" = on paper/surface backgrounds · "dark" = on navy bands. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium tracking-[0.18em] uppercase",
        tone === "dark" ? "text-green-300" : "text-green-600",
        className,
      )}
    >
      {children}
    </p>
  );
}
