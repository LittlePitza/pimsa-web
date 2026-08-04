"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/ui/field";
import { trackEvent } from "@/lib/analytics";
import { CV_ACCEPT, MAX_CV_BYTES, MAX_CV_LABEL } from "@/lib/uploads";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Job application form: fields + CV upload (PDF/Word ≤ 5 MB).
 *
 * Works in two modes. Against a vacancy it applies to that posting; with no
 * slug it files a spontaneous application, which the panel lists as
 * "Postulación general". Either way the CV reaches RRHH — before this, a
 * candidate with no matching vacancy was pointed at the sales contact form,
 * which has no file upload and delivers to the commercial inbox.
 */
export function ApplicationForm({
  vacancySlug = "",
  vacancyTitle,
}: {
  vacancySlug?: string;
  /** Omitted for a spontaneous application. */
  vacancyTitle?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("vacancySlug", vacancySlug);

    const cv = formData.get("cv");
    if (cv instanceof File && cv.size > MAX_CV_BYTES) {
      setStatus("error");
      setErrorMessage(`El CV supera el tamaño máximo de ${MAX_CV_LABEL}.`);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/applications", { method: "POST", body: formData });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "No pudimos enviar tu postulación.");
      }
      setStatus("success");
      trackEvent("job_application_submit", { vacancy: vacancySlug || "general" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "No pudimos enviar tu postulación.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border-green-600 bg-surface shadow-card rounded-md border-l-4 p-8 focus:outline-none"
      >
        <h3 className="font-display text-navy-500 text-xl font-semibold">
          ¡Postulación recibida!
        </h3>
        <p className="text-ink-muted mt-3">
          {vacancyTitle
            ? `Gracias por tu interés en la vacante de ${vacancyTitle}.`
            : "Gracias por enviarnos tu perfil."}{" "}
          Recursos Humanos revisará tu CV y te contactará si avanzas en el proceso.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField id="name" label="Nombre completo" autoComplete="name" required maxLength={120} />
        <InputField id="phone" label="Teléfono" type="tel" autoComplete="tel" required maxLength={30} />
      </div>
      <InputField
        id="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        required
        maxLength={200}
      />
      <TextareaField
        id="message"
        label="Cuéntanos de ti"
        required
        maxLength={3000}
        placeholder={
          vacancyTitle
            ? "Experiencia relevante, disponibilidad y por qué te interesa esta vacante."
            : "Qué tipo de puesto buscas, tu experiencia y tu disponibilidad."
        }
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="cv"
          className="text-ink font-mono text-xs font-medium tracking-wider uppercase"
        >
          CV (PDF o Word, máx. {MAX_CV_LABEL}) <span className="text-green-600">*</span>
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          required
          accept={CV_ACCEPT}
          className="border-line bg-surface text-ink file:bg-navy-500 file:text-white w-full cursor-pointer rounded-sm border px-4 py-2.5 text-sm file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
        />
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <p role="alert" className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando…" : "Enviar postulación"}
        </Button>
        <p className="text-ink-muted mt-4 text-xs">
          Tus datos se usan únicamente para este proceso de reclutamiento conforme a nuestro{" "}
          <Link
            href="/aviso-de-privacidad"
            target="_blank"
            className="text-blue-600 underline"
          >
            aviso de privacidad
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
