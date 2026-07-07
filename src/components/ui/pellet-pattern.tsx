import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Dot-matrix granule texture abstracting plastic pellets (DESIGN.md §4.3).
 * Pure inline SVG — bytes, not requests.
 */
export function PelletPattern({ className }: { className?: string }) {
  const id = useId();

  return (
    <svg aria-hidden className={cn("pointer-events-none", className)}>
      <defs>
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
