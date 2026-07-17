import Image from "next/image";
import type { ServiceImage } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Annotated photography (DESIGN.md §4.5): bordered frame with green corner
 * ticks and a mono figcaption — caption left, optional tag right.
 */
export function AnnotatedFigure({
  image,
  aspect = "aspect-4/3",
  sizes,
  preload = false,
  className,
}: {
  image: ServiceImage;
  /** Tailwind aspect class for the frame, e.g. "aspect-4/3". */
  aspect?: string;
  /** next/image responsive sizes attribute. */
  sizes: string;
  /** Preload as the LCP candidate (next/image `preload`). */
  preload?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={cn("border-line relative border", aspect)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload={preload}
          sizes={sizes}
          className="object-cover"
        />
        <span
          aria-hidden
          className="border-green-500 absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2"
        />
        <span
          aria-hidden
          className="border-green-500 absolute -right-px -bottom-px h-6 w-6 border-r-2 border-b-2"
        />
      </div>
      <figcaption className="text-ink-muted mt-3 flex items-baseline justify-between gap-4 font-mono text-xs tracking-[0.14em] uppercase">
        <span>{image.caption}</span>
        {image.tag ? <span className="text-green-600 shrink-0">{image.tag}</span> : null}
      </figcaption>
    </figure>
  );
}
