import { socialIconPaths } from "@/components/layout/social-icon-paths";
import type { SocialLink } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * One social brand mark. Server-rendered, zero client JS.
 *
 * `aria-hidden` is deliberate: the accessible name belongs on the anchor that
 * wraps this (as real `sr-only` text, which machine translation and text
 * crawlers can read), never on the glyph. `fill-current` lets the mark
 * inherit the link's rest/hover/focus colour instead of pinning a brand hue.
 */
export function SocialIcon({ name, className }: { name: SocialLink["name"]; className?: string }) {
  const icon = socialIconPaths[name];

  return (
    <svg
      viewBox={icon.viewBox}
      aria-hidden
      focusable="false"
      className={cn("fill-current", icon.sizeClass, className)}
    >
      <path d={icon.d} />
    </svg>
  );
}
