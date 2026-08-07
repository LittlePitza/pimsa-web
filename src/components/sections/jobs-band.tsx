import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Compact recruiting band linking to the job board. */
export function JobsBand() {
  return (
    <section data-band="dark" className="bg-forest-800">
      <Container className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div>
          <Eyebrow tone="dark">Talento</Eyebrow>
          <h2 className="font-display text-paper mt-3 text-2xl font-semibold md:text-3xl">
            ¿Quieres formar parte del equipo?
          </h2>
          <p className="text-paper/75 mt-2 max-w-[52ch]">
            Somos una empresa en crecimiento. Conoce nuestras vacantes abiertas y postúlate en
            línea.
          </p>
        </div>
        <ButtonLink href="/jobs" variant="accent" size="lg" className="shrink-0">
          Ver vacantes
        </ButtonLink>
      </Container>
    </section>
  );
}
