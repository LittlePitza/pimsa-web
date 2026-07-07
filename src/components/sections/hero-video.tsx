"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping background video. Pauses (showing the poster frame) when
 * the user prefers reduced motion (DESIGN.md §5).
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) {
        video.pause();
      } else {
        video.play().catch(() => undefined);
      }
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 size-full object-cover"
    />
  );
}
