import { cn } from "@/lib/utils";

export function Card({
  className,
  lift = false,
  children,
}: {
  className?: string;
  /** Adds the 2px hover lift micro-interaction (DESIGN.md §5). */
  lift?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-surface border-line shadow-card rounded-md border p-6",
        lift &&
          "transition-[translate,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
