"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  /** Area hub (dashboard) — emphasized so each group reads as a unit. */
  strong?: boolean;
}

/** Grouped so each team sees its own area; dividers separate the groups. */
function buildGroups(canManageAccounts: boolean): { key: string; items: NavItem[] }[] {
  return [
    { key: "general", items: [{ label: "Panel", href: "/admin", strong: true }] },
    {
      key: "marketing",
      items: [
        { label: "Marketing", href: "/admin/marketing", strong: true },
        { label: "Leads", href: "/admin/leads" },
        { label: "Stock", href: "/admin/stock" },
      ],
    },
    {
      key: "rrhh",
      items: [
        { label: "RRHH", href: "/admin/rrhh", strong: true },
        { label: "Vacantes", href: "/admin/vacantes" },
        { label: "Postulaciones", href: "/admin/postulaciones" },
      ],
    },
    {
      key: "config",
      items: [
        { label: "Configuración", href: "/admin/configuracion" },
        ...(canManageAccounts ? [{ label: "Cuentas", href: "/admin/cuentas" }] : []),
      ],
    },
  ];
}

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Panel navigation with the current section highlighted. */
export function AdminNav({
  variant,
  canManageAccounts = false,
}: {
  variant: "desktop" | "mobile";
  canManageAccounts?: boolean;
}) {
  const pathname = usePathname();
  const groups = buildGroups(canManageAccounts);

  return (
    <ul
      className={cn(
        "flex items-center",
        variant === "desktop"
          ? "gap-x-4"
          : "flex-wrap gap-x-3 gap-y-2 px-4 py-3",
      )}
    >
      {groups.map((group, groupIndex) => (
        <Fragment key={group.key}>
          {groupIndex > 0 ? (
            <li
              aria-hidden
              className="bg-line hidden h-4 w-px shrink-0 md:block"
            />
          ) : null}
          {group.items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors",
                    item.strong ? "font-semibold" : "font-medium",
                    active
                      ? "text-blue-600 underline decoration-2 underline-offset-8"
                      : item.strong
                        ? "text-navy-500 hover:text-blue-600"
                        : "text-ink hover:text-blue-600",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </Fragment>
      ))}
    </ul>
  );
}
