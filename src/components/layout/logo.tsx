import { cn } from "@/lib/utils";
import {
  isotypePaths,
  LOGO_GREEN,
  LOGO_NAVY,
  type LogoPath,
  wordmarkPaths,
} from "@/components/layout/logo-paths";

/** Paper tone for the negative (dark-background) variant. */
const PAPER = "#f7f8f5";

function LogoPaths({ paths, tone }: { paths: LogoPath[]; tone: "light" | "dark" }) {
  const base = tone === "dark" ? PAPER : LOGO_NAVY;
  return (
    <>
      {paths.map((path) => (
        <path key={path.d.slice(0, 24)} d={path.d} fill={path.green ? LOGO_GREEN : base} />
      ))}
    </>
  );
}

/**
 * Official PIMSA horizontal lockup: infinity-loop isotype + “pimsa” wordmark.
 * `tone="dark"` renders the negative version for navy backgrounds.
 */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <svg
      viewBox="0 0 1461 311"
      role="img"
      aria-label="Plásticos PIMSA"
      className={cn("h-9 w-auto", className)}
    >
      {/* Isotype scaled from the 909×792 artboard onto the lockup grid */}
      <g transform="translate(-305.59 -145.16) scale(1.3462)">
        <LogoPaths paths={isotypePaths} tone={tone} />
      </g>
      <g transform="translate(598.06 -373)">
        <LogoPaths paths={wordmarkPaths} tone={tone} />
      </g>
    </svg>
  );
}

/** Isotype alone — compact brand moments (404, dividers, avatars). */
export function LogoMark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <svg
      viewBox="227 116 419 208"
      role="img"
      aria-label="PIMSA"
      className={cn("h-8 w-auto", className)}
    >
      <LogoPaths paths={isotypePaths} tone={tone} />
    </svg>
  );
}
