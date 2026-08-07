import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium " +
  "transition-colors duration-150 whitespace-nowrap " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /** Navy on light backgrounds. */
  primary: "bg-navy-500 text-white hover:bg-blue-600",
  /** Green CTA — reserved for dark (navy) bands (DESIGN.md §2 usage rules). */
  accent: "bg-green-500 text-navy-900 hover:bg-green-300",
  outline: "border border-navy-500 text-navy-500 hover:bg-navy-500 hover:text-white",
  "outline-light": "border border-blue-400 text-paper hover:border-green-300 hover:text-green-300",
  ghost: "text-navy-500 hover:bg-navy-500/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

export function buttonClasses(
  { variant = "primary", size = "md" }: StyleProps,
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonClasses({ variant, size }, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  ...props
}: StyleProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const external = href.startsWith("http");
  const classes = buttonClasses({ variant, size }, className);

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...props} />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
