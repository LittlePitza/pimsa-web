"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/enums";
import { areaLinks, AREAS, canAccess, isFullPanel } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  /** Area hub (dashboard) — emphasized so each group reads as a unit. */
  strong?: boolean;
}

/**
 * One group per area the role may enter, so Marketing and RRHH each see a
 * nav with nothing but their own portal in it. Cosmetic only — the real
 * gate is requireArea() on every page and action.
 */
function buildGroups(
  role: AdminRole,
  canManageAccounts: boolean,
): { key: string; items: NavItem[] }[] {
  const groups: { key: string; items: NavItem[] }[] = [];

  if (isFullPanel(role)) {
    groups.push({ key: "general", items: [{ label: "Panel", href: "/admin", strong: true }] });
  }

  for (const area of AREAS) {
    if (!canAccess(role, area)) continue;
    groups.push({
      key: area,
      items: areaLinks[area].map((link) => ({
        label: link.label,
        href: link.href,
        strong: link.hub,
      })),
    });
  }

  groups.push({
    key: "config",
    items: [
      // The URL stays /configuracion (bookmarks, muscle memory); the label
      // says what the screen actually holds.
      { label: "Correo", href: "/admin/configuracion" },
      ...(canManageAccounts ? [{ label: "Cuentas", href: "/admin/cuentas" }] : []),
    ],
  });

  return groups;
}

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Panel navigation with the current section highlighted. */
export function AdminNav({
  variant,
  role,
  canManageAccounts = false,
}: {
  variant: "desktop" | "mobile";
  role: AdminRole;
  canManageAccounts?: boolean;
}) {
  const pathname = usePathname();
  const groups = buildGroups(role, canManageAccounts);

  return (
    <ul
      className={cn(
        "flex items-center",
        variant === "desktop" ? "gap-x-4" : "flex-wrap gap-x-3 gap-y-2 px-4 py-3",
      )}
    >
      {groups.map((group, groupIndex) => (
        <Fragment key={group.key}>
          {groupIndex > 0 ? (
            <li aria-hidden className="bg-line hidden h-4 w-px shrink-0 md:block" />
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
