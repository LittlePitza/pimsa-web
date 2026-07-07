import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export interface Crumb {
  name: string;
  path: string;
}

/** Breadcrumb trail with BreadcrumbList JSON-LD (PLAN.md §6). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      <JsonLd data={breadcrumbSchema(items)} />
      <ol className="text-ink-muted flex flex-wrap gap-2 font-mono text-xs tracking-wider uppercase">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-green-600">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="hover:text-blue-600 transition-colors">
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
