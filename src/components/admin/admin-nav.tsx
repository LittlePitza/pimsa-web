"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { label: "Resumen", href: "/admin" },
  { label: "Vacantes", href: "/admin/vacantes" },
  { label: "Postulaciones", href: "/admin/postulaciones" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Stock", href: "/admin/stock" },
  { label: "Configuración", href: "/admin/configuracion" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Panel navigation with the current section highlighted. */
export function AdminNav({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  return (
    <ul className={variant === "desktop" ? "flex gap-6" : "flex justify-around px-2 py-2"}>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors",
                variant === "desktop" ? "" : "px-2 py-1",
                active
                  ? "text-blue-600 underline decoration-2 underline-offset-8"
                  : "text-ink hover:text-blue-600",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
