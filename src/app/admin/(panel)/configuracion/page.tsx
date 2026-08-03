import { EmailSettingsForm } from "@/components/admin/email-settings-form";
import { TestEmailForm } from "@/components/admin/test-email-form";
import { requireAdmin } from "@/lib/auth";
import { canAccess } from "@/lib/roles";
import { getSettingSafe, SETTING_KEYS } from "@/lib/settings";

/**
 * Shared screen, split by area: each team configures only the email flow it
 * owns (Marketing the contact leads, RRHH the job applications). Whole-panel
 * accounts see both.
 */
export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const ownsLeads = canAccess(session.role, "marketing");
  const ownsApplications = canAccess(session.role, "rrhh");

  const [leadsTo, applicationsTo] = await Promise.all([
    ownsLeads ? getSettingSafe(SETTING_KEYS.emailLeadsTo) : Promise.resolve(""),
    ownsApplications ? getSettingSafe(SETTING_KEYS.emailApplicationsTo) : Promise.resolve(""),
  ]);

  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
  const smtpAccount = process.env.SMTP_USER ?? "";

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Configuración</h1>

      <section className="mt-8">
        <h2 className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
          Correo — destinatarios
        </h2>
        <p className="text-ink-muted mt-2 max-w-2xl text-sm">
          Define a qué correos llega cada tipo de mensaje del sitio. Los cambios aplican de
          inmediato, sin necesidad de redesplegar.
        </p>
        <div className="mt-6">
          <EmailSettingsForm
            leadsTo={leadsTo ?? ""}
            applicationsTo={applicationsTo ?? ""}
            fallback={process.env.CONTACT_EMAIL_TO ?? ""}
            showLeads={ownsLeads}
            showApplications={ownsApplications}
          />
        </div>
      </section>

      <section className="border-line mt-12 border-t pt-8">
        <h2 className="text-green-600 font-mono text-xs font-medium tracking-[0.18em] uppercase">
          Cuenta de envío (SMTP)
        </h2>
        <p className="text-ink-muted mt-2 max-w-2xl text-sm">
          {smtpConfigured ? (
            <>
              Los correos se envían desde <strong className="text-ink">{smtpAccount}</strong>. Las
              credenciales viven en las variables de entorno del servidor (hPanel), no en esta
              base de datos.
            </>
          ) : (
            <>
              <strong className="text-red-700">SMTP sin configurar.</strong> Los mensajes se están
              guardando en el panel, pero no se envían por correo. Configura las variables
              SMTP_HOST, SMTP_USER, SMTP_PASS y CONTACT_EMAIL_TO en el servidor (ver
              .env.example).
            </>
          )}
        </p>
        <TestEmailForm showLeads={ownsLeads} showApplications={ownsApplications} />
      </section>
    </>
  );
}
