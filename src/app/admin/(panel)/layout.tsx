import type { Metadata } from "next";
import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";
import { Logo } from "@/components/layout/logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const adminNav = [
  { label: "Resumen", href: "/admin" },
  { label: "Vacantes", href: "/admin/vacantes" },
  { label: "Postulaciones", href: "/admin/postulaciones" },
  { label: "Leads", href: "/admin/leads" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-surface border-line border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
          <div className="flex items-center gap-8">
            <Link href="/admin" aria-label="Panel — inicio">
              <Logo />
            </Link>
            <nav aria-label="Navegación del panel" className="hidden md:block">
              <ul className="flex gap-6">
                {adminNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ink hover:text-blue-600 text-sm font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-ink-muted hidden font-mono text-xs sm:block">
              {session.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
        {/* Mobile nav */}
        <nav aria-label="Navegación del panel (móvil)" className="border-line border-t md:hidden">
          <ul className="flex justify-around px-2 py-2">
            {adminNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink px-2 py-1 text-sm font-medium">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
    </div>
  );
}
