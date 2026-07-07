/**
 * Home hero media configuration.
 *
 * The hero keeps its current layout and spacing; this only swaps the
 * background layer behind the navy overlay:
 *
 * - Video:  drop the file at  public/media/hero.mp4  (H.264, ideally ≤ 8 MB,
 *   10–20 s loop, no audio) and a poster at public/media/hero-poster.jpg,
 *   then set  { type: "video", src: "/media/hero.mp4", poster: "/media/hero-poster.jpg" }.
 * - Photo:  drop it at public/media/hero.jpg (≥ 2000 px wide) and set
 *   { type: "image", src: "/media/hero.jpg", alt: "Planta de PIMSA" }.
 * - None:   { type: "none" } keeps the technical-grid background.
 *
 * TODO(marketing): switch once plant photography/video is delivered
 * (docs/marketing-material-request.md §2).
 */
export type HeroMedia =
  | { type: "none" }
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

export const heroMedia: HeroMedia = { type: "none" };
