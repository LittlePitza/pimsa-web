"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardList,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Mail,
  Megaphone,
  Menu,
  Package,
  UserCog,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import type { AdminRole } from "@/lib/enums";
import { areaLabels, areaLinks, AREAS, canAccess, isFullPanel } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  key: string;
  title: string | null;
  items: NavItem[];
}

/** Icon per destination. Keyed by href so the nav data in roles.ts stays pure. */
const iconFor: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/marketing": Megaphone,
  "/admin/leads": Inbox,
  "/admin/stock": Package,
  "/admin/rrhh": Briefcase,
  "/admin/vacantes": ClipboardList,
  "/admin/postulaciones": FileText,
  "/admin/configuracion": Mail,
  "/admin/cuentas": UserCog,
};

/**
 * One group per area the role may enter, so Marketing and RRHH each see a
 * sidebar with nothing but their own portal in it. Cosmetic only — the real
 * gate is requireArea() on every page and action.
 */
function buildGroups(role: AdminRole, canManageAccounts: boolean): NavGroup[] {
  const groups: NavGroup[] = [];

  if (isFullPanel(role)) {
    groups.push({
      key: "general",
      title: "General",
      items: [{ label: "Panel", href: "/admin" }],
    });
  }

  for (const area of AREAS) {
    if (!canAccess(role, area)) continue;
    groups.push({
      key: area,
      title: areaLabels[area],
      items: areaLinks[area].map((link) => ({ label: link.label, href: link.href })),
    });
  }

  groups.push({
    key: "config",
    title: "Administración",
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

/**
 * Panel shell navigation: a quiet light sidebar on desktop, a slim top bar
 * plus an off-canvas drawer on mobile. The drawer only exists in the DOM
 * while open, so keyboard focus can never wander into an invisible menu.
 */
export function AdminSidebar({
  role,
  canManageAccounts = false,
  email,
  roleLabel,
  home,
  signOutAction,
}: {
  role: AdminRole;
  canManageAccounts?: boolean;
  email: string;
  roleLabel: string;
  home: string;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Navigating is what "choosing a menu item" means — close the drawer.
  // Adjusted during render (not in an effect) so the old menu never paints
  // over the new page for a frame.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  // While the drawer is open: Escape closes it and the page behind stays put.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups = buildGroups(role, canManageAccounts);

  const panel = (
    <>
      <div className="border-line border-b px-5 py-4">
        <Link href={home} aria-label="Panel — inicio" className="inline-block">
          <Logo className="h-8 dark:hidden" />
          <Logo tone="dark" className="hidden h-8 dark:block" />
        </Link>
      </div>

      <nav
        aria-label="Navegación del panel"
        className="admin-nav-scroll flex-1 overflow-y-auto px-3 py-4"
      >
        {groups.map((group) => (
          <div key={group.key} className="mb-5 last:mb-0">
            {group.title ? (
              <p className="text-ink-muted/80 mb-1.5 px-2.5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase">
                {group.title}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = iconFor[item.href];
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-navy-500/10 text-navy-500 font-semibold"
                          : "text-ink-muted hover:bg-paper hover:text-ink font-medium",
                      )}
                    >
                      {Icon ? (
                        <Icon aria-hidden strokeWidth={1.75} className="size-4 shrink-0" />
                      ) : null}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-line border-t p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="bg-navy-500/10 text-navy-500 font-display grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold uppercase"
          >
            {email.slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-ink truncate font-mono text-xs" title={email}>
              {email}
            </p>
            <p className="text-ink-muted text-[11px]">{roleLabel}</p>
          </div>
          <ThemeToggle />
        </div>
        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="border-line text-ink-muted hover:bg-paper hover:text-ink flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
          >
            <LogOut aria-hidden className="size-4" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="bg-surface border-line sticky top-0 z-40 border-b lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href={home} aria-label="Panel — inicio">
            <Logo className="h-7 dark:hidden" />
            <Logo tone="dark" className="hidden h-7 dark:block" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="admin-drawer"
            aria-label="Abrir menú"
            className="text-navy-500 hover:bg-paper grid size-11 place-items-center rounded-md transition-colors"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación del panel"
        >
          <div
            aria-hidden
            className="admin-fade bg-navy-900/40 absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <aside
            id="admin-drawer"
            className="admin-drawer bg-surface shadow-lift relative flex h-full w-72 max-w-[85vw] flex-col"
          >
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="text-ink-muted hover:bg-paper hover:text-ink absolute top-3 right-3 grid size-11 place-items-center rounded-md transition-colors"
            >
              <X aria-hidden className="size-5" />
            </button>
            {panel}
          </aside>
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="bg-surface border-line sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r lg:flex">
        {panel}
      </aside>
    </>
  );
}
