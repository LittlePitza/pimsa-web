import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Factory, Fingerprint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { certifications } from "@/content/company";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types/content";

const credentialMeta: Record<
  string,
  { eyebrow: string; mark: string; detail: string; icon: LucideIcon }
> = {
  "ISO 9001:2015": {
    eyebrow: "Sistema de gestión",
    mark: "ISO",
    detail: "9001:2015",
    icon: BadgeCheck,
  },
  IMMEX: {
    eyebrow: "Programa y registro",
    mark: "IMMEX",
    detail: "Manufactura y exportación",
    icon: Factory,
  },
  DUNS: {
    eyebrow: "Identificador empresarial",
    mark: "D-U-N-S",
    detail: "Registro internacional",
    icon: Fingerprint,
  },
};

const credentialLayout = ["lg:col-span-6", "lg:col-span-3", "lg:col-span-3"] as const;

function CredentialCard({ cert, index }: { cert: Certification; index: number }) {
  const meta = credentialMeta[cert.code] ?? {
    eyebrow: "Credencial operativa",
    mark: cert.code,
    detail: cert.name,
    icon: BadgeCheck,
  };
  const Icon = meta.icon;
  const featured = index === 0;

  return (
    <article
      className={cn(
        "border-line group relative flex h-full min-h-[19rem] flex-col overflow-hidden border p-6 md:p-7",
        featured ? "bg-navy-900 text-white" : "bg-surface text-navy-900",
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <p
          className={cn(
            "font-mono text-[0.65rem] tracking-[0.18em] uppercase",
            featured ? "text-green-300" : "text-green-600",
          )}
        >
          {meta.eyebrow}
        </p>
        <Icon
          aria-hidden
          className={cn("size-6", featured ? "text-green-300" : "text-green-600")}
          strokeWidth={1.5}
        />
      </div>

      <div className="mt-auto">
        <p
          className={cn(
            "font-display font-black tracking-[-0.055em]",
            featured
              ? "text-[clamp(4rem,8vw,7.5rem)] leading-[0.72] text-white"
              : "text-navy-500 text-4xl leading-none",
          )}
        >
          {meta.mark}
        </p>
        <p
          className={cn(
            "mt-3 font-mono text-xs tracking-[0.14em] uppercase",
            featured ? "text-blue-400" : "text-ink-muted",
          )}
        >
          {meta.detail}
        </p>
        <div className={cn("mt-6 border-t pt-5", featured ? "border-blue-400/30" : "border-line")}>
          <h3
            className={cn(
              "font-display text-xl font-semibold",
              featured ? "text-white" : "text-navy-500",
            )}
          >
            {cert.name}
          </h3>
          <p className={cn("mt-2 text-sm", featured ? "text-blue-400" : "text-ink-muted")}>
            {cert.description}
          </p>
        </div>
      </div>
    </article>
  );
}

/** Visual dossier for the quality system and business registries. */
export function CertGrid({ index = "07" }: { index?: string }) {
  return (
    <section className="py-14 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)] lg:items-end">
          <SectionHeading
            index={index}
            eyebrow="Credenciales operativas"
            title="Un expediente, no una colección de logotipos"
            intro="Presentamos cada elemento por lo que realmente representa: sistema de gestión, programa de operación o identificador empresarial."
          />
          <div className="border-line hidden border-t pt-5 lg:block">
            <p className="font-mono text-xs tracking-[0.16em] text-green-600 uppercase">
              Homologación de proveedor
            </p>
            <p className="text-ink-muted mt-2 text-sm">
              La documentación publicable, organismo y vigencias se comparten durante el proceso
              comercial.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:mt-12 md:grid-cols-2 lg:grid-cols-12">
          {certifications.map((cert, i) => (
            <Reveal key={cert.code} delay={i * 60} className={cn("min-w-0", credentialLayout[i])}>
              <CredentialCard cert={cert} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="border-line mt-6 border-t pt-5 lg:hidden">
          <p className="font-mono text-xs tracking-[0.16em] text-green-600 uppercase">
            Homologación de proveedor
          </p>
          <p className="text-ink-muted mt-2 text-sm">
            La documentación publicable, organismo y vigencias se comparten durante el proceso
            comercial.
          </p>
        </div>

        <div className="border-line mt-8 flex flex-col items-start justify-between gap-5 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-ink-muted max-w-2xl text-sm">
            ¿Tu empresa requiere un formato específico para alta o evaluación de proveedor?
          </p>
          <ButtonLink href="/contacto" variant="outline">
            Solicitar documentación
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
