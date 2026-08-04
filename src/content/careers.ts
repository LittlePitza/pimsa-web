import type { Faq, ProcessStep, Spec } from "@/types/content";
import { certifications, company, industries } from "@/content/company";
import { formatInteger, operationalFacts } from "@/content/operational-facts";
import { MAX_CV_LABEL } from "@/lib/uploads";

/**
 * Job-board content, written for a candidate rather than a buyer.
 *
 * Ground rule for this file: every claim is either derived from data that
 * already exists (company.ts, operational-facts.ts) or describes behaviour
 * this codebase actually implements. Nothing about pay, benefits, schedules
 * or culture is invented here — see `workBenefits` below.
 */

/** Why this is a real place to work, in facts rather than adjectives. */
export const whyWorkHere: Spec[] = [
  {
    label: "Una planta, no un escritorio",
    value:
      "Molienda, peletizado, laboratorio y logística propia. El trabajo es operativo y se ve: entra scrap industrial y sale materia prima.",
  },
  {
    label: "Procesos documentados",
    value: `Operamos bajo un sistema de gestión certificado ${certifications[0]?.code ?? "ISO 9001:2015"}, así que hay procedimientos escritos, capacitación y una forma definida de hacer cada cosa.`,
  },
  {
    label: "Industria que no se detiene",
    value: `Atendemos a ${industries.join(", ").toLowerCase()}, sectores con demanda constante en el Bajío.`,
  },
  {
    label: "Operación consolidada",
    value: `Más de ${operationalFacts.companiesServedMinimum} compañías atendidas y ${formatInteger(operationalFacts.millingCapacityKgPerYear / 1000)} toneladas de capacidad anual de molienda instalada.`,
  },
];

/**
 * The hiring pipeline, described exactly as the system runs it. These four
 * steps mirror the application statuses in the database (new → reviewing →
 * finalist → hired/rejected), so the page can never promise a process the
 * panel doesn't actually follow.
 *
 * Deliberately free of time commitments: the code enforces no SLA, so
 * publishing one would be a promise nobody is keeping.
 */
export const hiringSteps: ProcessStep[] = [
  {
    title: "Envías tu postulación",
    description:
      "Llenas el formulario y adjuntas tu CV. Queda registrada al momento, no se pierde en un correo.",
  },
  {
    title: "Recursos Humanos la revisa",
    description:
      "Tu perfil llega directo al equipo de RRHH, que lo compara con lo que buscamos para el puesto.",
  },
  {
    title: "Te contactamos para entrevista",
    description:
      "Si tu perfil embona, te buscamos por teléfono o correo para conocerte y platicar del puesto.",
  },
  {
    title: "Te damos una respuesta",
    description:
      "Te informamos la decisión. Si no avanzas esta vez, tu CV se queda con nosotros para futuras vacantes.",
  },
];

/**
 * Benefits deliberately left empty.
 *
 * TODO(rrhh): llenar con las prestaciones reales (prestaciones de ley,
 * superiores, transporte, comedor, capacitación, etc.). Mientras esté vacío
 * la sección no se renderiza — es preferible a publicar prestaciones que
 * nadie ha confirmado, porque un candidato las lee como un compromiso.
 * Cada vacante ya publica las suyas en su propio detalle.
 */
export const workBenefits: Spec[] = [];

/** Questions a candidate actually has, answered from how the site works. */
export const candidateFaqs: Faq[] = [
  {
    question: "¿Qué necesito para postularme?",
    answer: `Tus datos de contacto y tu CV en PDF o Word, de máximo ${MAX_CV_LABEL}. Todo el proceso es en línea desde esta página; no necesitas venir a dejar papeles.`,
  },
  {
    question: "No veo una vacante para mi perfil, ¿puedo postularme de todos modos?",
    answer:
      "Sí. En esta misma página puedes enviar una postulación espontánea con tu CV. Queda registrada en nuestra bolsa y Recursos Humanos la revisa cuando se abre una vacante que embone con tu perfil.",
  },
  {
    question: "¿Dónde tendría que trabajar?",
    answer: `En nuestra planta de ${company.address.locality}, ${company.address.municipality}, ${company.address.state}. La dirección completa y el horario de oficina están en esta página.`,
  },
  {
    question: "¿Qué pasa con mi CV y mis datos?",
    answer:
      "Se usan únicamente para el proceso de reclutamiento, conforme a nuestro aviso de privacidad. Tu CV queda guardado en nuestro sistema interno y solo lo consulta el equipo de Recursos Humanos.",
  },
  {
    question: "¿Cómo sé si avancé en el proceso?",
    answer:
      "Recursos Humanos te contacta por el teléfono o el correo que registres en tu postulación. Por eso vale la pena revisar que ambos estén correctos antes de enviar.",
  },
  {
    question: "¿Puedo postularme a más de una vacante?",
    answer:
      "Sí, puedes enviar una postulación por cada vacante que te interese. Cada una se revisa por separado.",
  },
];
