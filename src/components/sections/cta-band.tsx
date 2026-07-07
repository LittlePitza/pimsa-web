import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { whatsappUrl } from "@/content/company";

/** Closing call-to-action band, reused across pages. */
export function CtaBand({
  title = "Convierte tu scrap en valor",
  intro = "Cuéntanos qué material generas o qué polímero necesitas y te respondemos el mismo día hábil.",
}: {
  title?: string;
  intro?: string;
}) {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden">
      <div className="technical-grid absolute inset-0" aria-hidden />
      <Container className="relative py-20 md:py-28">
        <div className="max-w-2xl">
          <Eyebrow tone="dark">Siguiente paso</Eyebrow>
          <h2 className="font-display text-h2 text-paper mt-4 font-semibold">{title}</h2>
          <p className="text-paper/75 text-lead mt-5">{intro}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/contacto" variant="accent" size="lg">
              Solicitar cotización
            </ButtonLink>
            <ButtonLink href={whatsappUrl()} variant="outline-light" size="lg">
              Escribir por WhatsApp
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
