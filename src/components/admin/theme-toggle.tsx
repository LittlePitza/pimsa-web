"use client";

import { Moon, Sun } from "lucide-react";

/** Cookie the panel layout reads to render the right theme on the server. */
export const ADMIN_THEME_COOKIE = "pimsa_admin_theme";

/** The element carrying data-theme — the admin layout's root. */
export const ADMIN_ROOT_ID = "admin-panel-root";

/**
 * Night-mode switch. Deliberately stateless: the current theme lives in the
 * root's data-theme attribute and the icon follows it via the dark: variant,
 * so every instance (sidebar, drawer) stays in sync by construction. The
 * cookie makes the next server render agree with what the user chose.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.getElementById(ADMIN_ROOT_ID);
    if (!root) return;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    document.cookie = `${ADMIN_THEME_COOKIE}=${next}; path=/admin; max-age=31536000; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre modo día y modo noche"
      title="Modo día / noche"
      className="border-line text-ink-muted hover:bg-paper hover:text-ink grid size-9 shrink-0 place-items-center rounded-md border transition-colors"
    >
      <Moon aria-hidden className="size-4 dark:hidden" strokeWidth={1.75} />
      <Sun aria-hidden className="hidden size-4 dark:block" strokeWidth={1.75} />
    </button>
  );
}
