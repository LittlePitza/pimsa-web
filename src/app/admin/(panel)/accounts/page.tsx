import { AccountCard, type AccountCardData } from "@/components/admin/account-card";
import { NewAccountForm } from "@/components/admin/new-account-form";
import { listAdmins } from "@/db/queries/admins";
import { isSuperAdmin, requireSuperAdmin } from "@/lib/auth";

export const metadata = { title: "Cuentas — Panel" };

/** Account management — create users, change emails/names, reset passwords. */
export default async function AccountsPage() {
  const session = await requireSuperAdmin();
  const admins = await listAdmins();

  const accounts: AccountCardData[] = admins.map((admin) => ({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    // Super-admins always act as whole-panel, whatever the stored value is.
    role: isSuperAdmin(admin.email) ? "admin" : admin.role,
    createdAt: admin.createdAt,
    lastLoginAt: admin.lastLoginAt,
    isSuper: isSuperAdmin(admin.email),
    isSelf: admin.id === session.userId,
  }));

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Cuentas</h1>
      <p className="text-ink-muted mt-2 max-w-2xl text-sm">
        Administra el acceso al panel: crea usuarios, asígnales su área, cambia sus correos y
        nombres, y actualiza contraseñas. Cada cuenta solo entra al portal de su área. Solo los
        super-administradores ven esta sección.
      </p>

      <section className="border-line bg-surface shadow-card mt-8 rounded-md border p-6">
        <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
          Nueva cuenta
        </h2>
        <p className="text-ink-muted mt-2 text-sm">
          El usuario podrá cambiar su contraseña temporal después de iniciar sesión.
        </p>
        <div className="mt-5">
          <NewAccountForm />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
          Cuentas registradas ({accounts.length})
        </h2>
        <ul className="mt-5 space-y-5">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
          {accounts.length === 0 ? (
            <li className="border-line bg-surface text-ink-muted rounded-md border p-6 text-sm">
              No hay cuentas registradas.
            </li>
          ) : null}
        </ul>
      </section>
    </>
  );
}
