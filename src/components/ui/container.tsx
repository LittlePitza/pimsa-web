import { cn } from "@/lib/utils";

/** Standard content container: 12-col editorial grid width (DESIGN.md §6). */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-5 md:px-8", className)}>{children}</div>
  );
}
