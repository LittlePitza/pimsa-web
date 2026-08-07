import type { Metadata } from "next";
import { cookies } from "next/headers";
import { signOutAction } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ADMIN_ROOT_ID, ADMIN_THEME_COOKIE } from "@/components/admin/theme-toggle";
import { isSuperAdmin, requireAdmin } from "@/lib/auth";
import { homeFor, roleLabels } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const canManageAccounts = isSuperAdmin(session.email);
  // Every "home" affordance points at the caller's own portal, so Marketing
  // and RRHH never bounce off the general panel they can't open.
  const home = homeFor(session.role);
  // Rendered server-side from the cookie, so the chosen theme paints on the
  // first frame — no light flash before hydration.
  const theme = (await cookies()).get(ADMIN_THEME_COOKIE)?.value === "dark" ? "dark" : "light";

  return (
    <div id={ADMIN_ROOT_ID} data-theme={theme} className="bg-paper text-ink min-h-svh lg:flex">
      <AdminSidebar
        role={session.role}
        canManageAccounts={canManageAccounts}
        email={session.email}
        roleLabel={roleLabels[session.role]}
        home={home}
        signOutAction={signOutAction}
      />
      <div className="min-w-0 flex-1">
        <main id="main" className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
