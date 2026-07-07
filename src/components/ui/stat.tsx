"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Stat as StatData } from "@/types/content";

/**
 * Oversized data point (DESIGN.md §4.6): display-size number with mono label.
 * Counts up once when it enters the viewport; renders the final value
 * immediately when reduced motion is preferred or JS is unavailable.
 */
export function Stat({
  stat,
  tone = "dark",
  className,
}: {
  stat: StatData;
  tone?: "light" | "dark";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(stat.value * eased));
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        setDisplay(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stat.value]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span
        ref={ref}
        className={cn(
          "font-display text-h1 font-semibold tabular-nums",
          tone === "dark" ? "text-paper" : "text-navy-500",
        )}
      >
        {stat.prefix}
        {display}
        <span className={tone === "dark" ? "text-green-300" : "text-green-600"}>
          {stat.suffix}
        </span>
      </span>
      <span
        className={cn(
          "font-mono text-xs tracking-wider uppercase",
          tone === "dark" ? "text-paper/70" : "text-ink-muted",
        )}
      >
        {stat.label}
      </span>
    </div>
  );
}
