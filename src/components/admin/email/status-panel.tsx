import { VerifySmtpButton } from "@/components/admin/email/verify-button";
import type { EmailHealth } from "@/db/queries/email-log";
import { formatSender, type SmtpConfig } from "@/lib/email/config";
import { cn, formatDate } from "@/lib/utils";

/**
 * The first thing on the page, and usually the only thing anyone needs to
 * read: is email working right now?
 *
 * The severity ladder is deliberate. Failures outrank a missing account,
 * because "configured but bouncing" is the state that silently loses leads,
 * while "not configured" is at least honest about itself. Both outrank the
 * quiet case where nothing has been sent yet — new install, or a weekend.
 */

type Level = "ok" | "warn" | "error";

const levelStyles: Record<Level, string> = {
  ok: "border-l-green-600",
  warn: "border-l-amber-500",
  error: "border-l-red-600",
};

const levelDot: Record<Level, string> = {
  ok: "bg-green-500",
  warn: "bg-amber-500",
  error: "bg-red-600",
};

function assess(
  smtp: SmtpConfig,
  health: EmailHealth,
): { level: Level; headline: string; detail: string } {
  if (health.failures24h > 0) {
    return {
      level: "error",
      headline: `${health.failures24h} ${health.failures24h === 1 ? "envío falló" : "envíos fallaron"} en las últimas 24 h`,
      detail: "Revisa la bitácora al final de esta página para ver el motivo exacto.",
    };
  }
  if (!smtp.complete) {
    return {
      level: "error",
      headline: "Sin cuenta de envío",
      detail:
        "Los leads y las postulaciones se siguen guardando en el panel, pero no se envía ningún aviso por correo.",
    };
  }
  if (!health.lastSentAt) {
    return {
      level: "warn",
      headline: "Cuenta configurada, sin envíos registrados",
      detail: "Manda un correo de prueba para confirmar que la entrega funciona.",
    };
  }
  return {
    level: "ok",
    headline: "El correo está funcionando",
    detail: `${health.sent24h} ${health.sent24h === 1 ? "envío" : "envíos"} en las últimas 24 h, sin fallos.`,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-muted font-mono text-xs tracking-wider uppercase">{label}</dt>
      <dd className="text-ink mt-1 text-sm break-words">{value || "—"}</dd>
    </div>
  );
}

const sourceLabels = {
  panel: "configurada desde el panel",
  env: "heredada del servidor (hPanel)",
  default: "sin configurar",
} as const;

export function EmailStatusPanel({ smtp, health }: { smtp: SmtpConfig; health: EmailHealth }) {
  const status = assess(smtp, health);

  return (
    <section
      className={cn(
        "border-line bg-surface shadow-card rounded-md border border-l-4 p-6",
        levelStyles[status.level],
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", levelDot[status.level])} />
        <div>
          <h2 className="font-display text-navy-500 text-lg font-bold">{status.headline}</h2>
          <p className="text-ink-muted mt-1 text-sm">{status.detail}</p>
        </div>
      </div>

      <dl className="border-line mt-6 grid gap-5 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Servidor" value={smtp.host ? `${smtp.host}:${smtp.port}` : "Sin configurar"} />
        <Fact label="Buzón" value={smtp.user} />
        <Fact label="Se envía como" value={formatSender(smtp)} />
        <Fact label="Último envío" value={formatDate(health.lastSentAt)} />
      </dl>

      <p className="text-ink-muted mt-4 text-xs">Cuenta de envío {sourceLabels[smtp.source]}.</p>

      <div className="mt-5">
        <VerifySmtpButton />
      </div>
    </section>
  );
}
