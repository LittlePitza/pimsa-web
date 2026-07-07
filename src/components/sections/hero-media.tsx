import Image from "next/image";
import { HeroVideo } from "@/components/sections/hero-video";
import type { HeroMedia } from "@/content/home";

/**
 * Optional hero background media (photo or looping video) behind a navy
 * overlay that preserves text contrast (WCAG AA) and the brand look.
 */
export function HeroMediaBackground({ media }: { media: HeroMedia }) {
  if (media.type === "none") return null;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {media.type === "image" ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <HeroVideo src={media.src} poster={media.poster} />
      )}
      {/* Navy overlay: keeps headline contrast over any footage */}
      <div className="from-navy-900/95 via-navy-900/80 to-navy-900/60 absolute inset-0 bg-linear-to-r" />
    </div>
  );
}
