import { EmailFlowCard } from "@/components/admin/email/flow-card";
import { EmailLogTable } from "@/components/admin/email/log-table";
import { SmtpForm } from "@/components/admin/email/smtp-form";
import { EmailStatusPanel } from "@/components/admin/email/status-panel";
import { EmailTestPanel, type TestPanelFlow } from "@/components/admin/email/test-panel";
import { emailHealth, recentEmailLog } from "@/db/queries/email-log";
import { isSuperAdmin, requireAdmin } from "@/lib/auth";
import {
  envRecipients,
  flowDescriptions,
  flowKeys,
  flowLabels,
  formatEmailList,
  getEmailConfig,
  hasStoredSmtpPassword,
  NOTIFICATION_FLOWS,
  parseEmailList,
  type NotificationFlow,
} from "@/lib/email/config";
import { canAccess } from "@/lib/roles";
import { loadSettings } from "@/lib/settings";

export const metadata = { title: "Correo — Configuración" };

/** Enough history to cover a bad afternoon without paginating. */
const LOG_LIMIT = 25;

/**
 * The email control centre, read top to bottom in order of urgency: is it
 * working, where does each thing land, does a real message arrive, and what
 * actually went out.
 *
 * Split by area like the rest of the panel — Marketing configures the contact
 * leads, RRHH the job applications — with the SMTP account reserved for
 * super-admins, since it is the one setting that changes how the whole site
 * sends rather than how one team receives.
 */
export default async function AdminEmailSettingsPage() {
  const session = await requireAdmin();

  const owned = NOTIFICATION_FLOWS.filter((flow) =>
    canAccess(session.role, flow === "leads" ? "marketing" : "rrhh"),
  );
  const canManageSmtp = isSuperAdmin(session.email);

  /**
   * The log and the health strip see exactly the flows the caller owns —
   * acknowledgements and test sends included, since each is attributed to the
   * flow whose data it carries. An empty list means no restriction, which is
   * the whole-panel case.
   */
  const scope = owned.length === NOTIFICATION_FLOWS.length ? [] : owned;

  const [config, settingsMap, storedPassword, health, log] = await Promise.all([
    getEmailConfig(),
    loadSettings(),
    hasStoredSmtpPassword(),
    emailHealth(scope),
    recentEmailLog(LOG_LIMIT, scope),
  ]);

  /** Saved value, not the resolved one — the field must show what is stored. */
  const saved = (flow: NotificationFlow, key: keyof ReturnType<typeof flowKeys>) =>
    formatEmailList(parseEmailList(settingsMap.get(flowKeys(flow)[key]) ?? ""));

  const testFlows: TestPanelFlow[] = owned.map((flow) => ({
    flow,
    label: flowLabels[flow],
    recipients: formatEmailList(config.flows[flow].to),
  }));

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Correo</h1>
      <p className="text-ink-muted mt-2 max-w-2xl text-sm">
        A dónde llegan los avisos del sitio, cómo se envían y qué ha salido. Los cambios aplican de
        inmediato, sin volver a desplegar.
      </p>

      <div className="mt-8">
        <EmailStatusPanel smtp={config.smtp} health={health} />
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
          Avisos por formulario
        </h2>
        <p className="text-ink-muted mt-2 max-w-2xl text-sm">
          Cada formulario del sitio guarda siempre su registro en el panel. Aquí decides a quién,
          además, se le avisa por correo.
        </p>

        <div className="mt-6 grid gap-6">
          {owned.map((flow) => (
            <EmailFlowCard
              key={flow}
              flow={flow}
              title={flowLabels[flow]}
              description={flowDescriptions[flow]}
              enabled={config.flows[flow].enabled}
              to={saved(flow, "to")}
              cc={saved(flow, "cc")}
              bcc={saved(flow, "bcc")}
              subjectTag={settingsMap.get(flowKeys(flow).subjectTag) ?? ""}
              acknowledge={config.flows[flow].acknowledge}
              fallback={formatEmailList(envRecipients(flow))}
              acknowledgeLabel={
                flow === "leads"
                  ? "Confirma al prospecto que recibimos su mensaje."
                  : "Confirma al candidato que recibimos su postulación y su CV."
              }
            />
          ))}
        </div>
      </section>

      <section className="border-line mt-12 border-t pt-8">
        <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
          Probar el envío
        </h2>
        <p className="text-ink-muted mt-2 max-w-2xl text-sm">
          Manda el aviso real —misma plantilla, mismo remitente— a los destinatarios guardados o a
          cualquier correo, para comprobarlo antes de dejarlo en producción.
        </p>
        <div className="mt-6">
          <EmailTestPanel flows={testFlows} />
        </div>
      </section>

      {canManageSmtp ? (
        <section className="border-line mt-12 border-t pt-8">
          <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
            Cuenta de envío (SMTP)
          </h2>
          <p className="text-ink-muted mt-2 max-w-2xl text-sm">
            El buzón desde el que sale todo el correo del sitio. Afecta a todas las áreas, por eso
            solo lo administra el super-administrador.
          </p>
          <div className="mt-6">
            <SmtpForm
              host={config.smtp.host}
              port={config.smtp.port}
              user={config.smtp.user}
              fromName={config.smtp.fromName}
              fromAddress={config.smtp.fromAddress}
              hasStoredPassword={storedPassword}
              inheritedFromServer={config.smtp.source !== "panel"}
            />
          </div>
        </section>
      ) : null}

      <section className="border-line mt-12 border-t pt-8">
        <h2 className="font-mono text-xs font-medium tracking-[0.18em] text-green-600 uppercase">
          Bitácora de envíos
        </h2>
        <p className="text-ink-muted mt-2 max-w-2xl text-sm">
          Los últimos {LOG_LIMIT} intentos, con su resultado. Si alguien reporta que no le llegó un
          aviso, la respuesta está aquí.
        </p>
        <div className="mt-6">
          <EmailLogTable entries={log} />
        </div>
      </section>
    </>
  );
}
