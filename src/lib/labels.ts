import type {
  ApplicationStatus,
  EmploymentType,
  LeadStatus,
  SalaryPeriod,
  VacancyStatus,
  WorkMode,
} from "@/lib/enums";

/** Spanish UI labels for enum statuses. */

export const vacancyStatusLabels: Record<VacancyStatus, string> = {
  draft: "Borrador",
  open: "Publicada",
  closed: "Cerrada",
};

export const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: "Tiempo completo",
  PART_TIME: "Medio tiempo",
  CONTRACTOR: "Por honorarios",
  TEMPORARY: "Temporal",
  INTERN: "Prácticas / becario",
};

export const workModeLabels: Record<WorkMode, string> = {
  onsite: "Presencial",
  hybrid: "Híbrido",
  remote: "Remoto",
};

/** Reads after an amount: "$12,000 mensuales". */
export const salaryPeriodLabels: Record<SalaryPeriod, string> = {
  HOUR: "por hora",
  DAY: "diarios",
  WEEK: "semanales",
  MONTH: "mensuales",
  YEAR: "anuales",
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
