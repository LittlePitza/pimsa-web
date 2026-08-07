import Image from "next/image";
import type { ServiceImage } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Annotated photography (DESIGN.md §4.5): bordered frame with green corner
 * ticks and a mono figcaption — caption left, optional tag right.
 *
 * Each corner is two independent strokes rather than one L-shaped border, so
 * they can draw themselves in. The ticks are what turn an industrial photo
 * into an engineering plate, which is why they get the motion and the
 * photograph itself stays perfectly still. Inside a <Reveal> the strokes wait
 * for the figure to be in view; anywhere else they simply draw on load.
 */
const TICK = "figure-tick bg-green-500 absolute";
export function AnnotatedFigure({
  image,
  aspect = "aspect-4/3",
  sizes,
  preload = false,
  parallax = false,
  className,
}: {
  image: ServiceImage;
  /** Tailwind aspect class for the frame, e.g. "aspect-4/3". */
  aspect?: string;
  /** next/image responsive sizes attribute. */
  sizes: string;
  /** Preload as the LCP candidate (next/image `preload`). */
  preload?: boolean;
  /** Drift the photograph slowly behind its frame as the page scrolls. */
  parallax?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={cn("border-line relative border", aspect)}>
        {/* The clip lives on an inner wrapper, never on the frame: the corner
            ticks sit at -1px and a frame-level overflow-hidden would slice
            them off. */}
        <div className={cn("absolute inset-0 overflow-hidden", parallax && "parallax-media")}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload={preload}
            sizes={sizes}
            className="object-cover"
          />
        </div>
        {/* Top-left corner */}
        <span
          aria-hidden
          className={cn(TICK, "figure-tick-h -top-px -left-px h-0.5 w-6")}
          style={{ "--tick-origin-x": "left" } as React.CSSProperties}
        />
        <span
          aria-hidden
          className={cn(TICK, "figure-tick-v -top-px -left-px h-6 w-0.5")}
          style={{ "--tick-origin-y": "top" } as React.CSSProperties}
        />
        {/* Bottom-right corner */}
        <span
          aria-hidden
          className={cn(TICK, "figure-tick-h -right-px -bottom-px h-0.5 w-6")}
          style={{ "--tick-origin-x": "right" } as React.CSSProperties}
        />
        <span
          aria-hidden
          className={cn(TICK, "figure-tick-v -right-px -bottom-px h-6 w-0.5")}
          style={{ "--tick-origin-y": "bottom" } as React.CSSProperties}
        />
      </div>
      <figcaption className="text-ink-muted mt-3 flex items-baseline justify-between gap-4 font-mono text-xs tracking-[0.14em] uppercase">
        <span>{image.caption}</span>
        {image.tag ? <span className="shrink-0 text-green-600">{image.tag}</span> : null}
      </figcaption>
    </figure>
  );
}
