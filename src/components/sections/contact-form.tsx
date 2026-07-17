"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/ui/field";
import { trackEvent } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Lead capture form (PLAN.md §7): source tracking via persisted UTM params,
 * honeypot anti-spam field, delivery through /api/contact.
 */
export function ContactForm({ serviceNames }: { serviceNames: readonly string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  // The form is replaced by the confirmation — move focus there so keyboard
  // and screen-reader users don't land in a void.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, utm: getStoredUtm() }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "No pudimos enviar tu mensaje.");
      }

      setStatus("success");
      trackEvent("lead_submit", { service: String(data.service ?? "") });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "No pudimos enviar tu mensaje. Intenta de nuevo.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="bg-surface shadow-card rounded-md border-l-4 border-green-600 p-8 focus:outline-none"
      >
        <h3 className="font-display text-navy-500 text-xl font-semibold">¡Mensaje enviado!</h3>
        <p className="text-ink-muted mt-3">
          Gracias por contactarnos. Te responderemos en horario hábil, normalmente el mismo día. Si
          es urgente, escríbenos por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField id="name" label="Nombre" autoComplete="name" required maxLength={120} />
        <InputField id="company" label="Empresa" autoComplete="organization" maxLength={120} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
        />
        <InputField id="phone" label="Teléfono" type="tel" autoComplete="tel" maxLength={30} />
      </div>
      <SelectField id="service" label="Servicio de interés" defaultValue="">
        <option value="">Selecciona una opción</option>
        {serviceNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
        <option value="Otro">Otro</option>
      </SelectField>
      <TextareaField
        id="message"
        label="Mensaje"
        required
        maxLength={3000}
        placeholder="Cuéntanos qué material generas o necesitas, volúmenes aproximados y tu ubicación."
      />

      {/* Honeypot — hidden from real users, bots fill it */}
      <div aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {errorMessage}
        </p>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
        </Button>
        <p className="text-ink-muted mt-4 text-xs">
          Al enviar aceptas nuestro{" "}
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
