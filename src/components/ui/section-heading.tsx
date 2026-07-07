import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/**
 * Section header: mono index eyebrow + display heading + optional intro.
 * Every major section is numbered like an engineering document (DESIGN.md §4.2).
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  as: Heading = "h2",
  className,
}: {
  /** Two-digit section index, e.g. "02". */
  index?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow tone={tone}>
        {index ? `${index} / ` : ""}
        {eyebrow}
      </Eyebrow>
      <Heading
        className={cn(
          "font-display text-h2 mt-4 font-semibold",
          tone === "dark" ? "text-paper" : "text-navy-500",
        )}
      >
        {title}
      </Heading>
      {intro ? (
        <p className={cn("text-lead mt-5", tone === "dark" ? "text-paper/80" : "text-ink-muted")}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
