import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

/** Breadcrumb trail with BreadcrumbList JSON-LD (PLAN.md §6). */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <nav aria-label="Ruta de navegación">
      <JsonLd data={breadcrumbSchema(items)} />
      <ol
        className={cn(
          "flex flex-wrap gap-2 font-mono text-xs tracking-wider uppercase",
          dark ? "text-blue-400" : "text-ink-muted",
        )}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? "text-green-300" : "text-green-600"}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className={cn(
                      "transition-colors",
                      dark ? "hover:text-paper" : "hover:text-blue-600",
                    )}
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
