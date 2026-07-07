import type { ApplicationStatus, LeadStatus, VacancyStatus } from "@/db/schema";

/** Spanish UI labels for enum statuses. */

export const vacancyStatusLabels: Record<VacancyStatus, string> = {
  draft: "Borrador",
  open: "Publicada",
  closed: "Cerrada",
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  new: "Nueva",
  reviewing: "En revisión",
  finalist: "Finalista",
  hired: "Contratada",
  rejected: "Descartada",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  closed: "Cerrado",
};
