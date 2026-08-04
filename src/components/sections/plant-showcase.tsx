import { AnnotatedFigure } from "@/components/ui/annotated-figure";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { operationFigures } from "@/content/about";
import { cn } from "@/lib/utils";

/**
 * The plant, in evidence (DESIGN.md §4.5 — annotated photography).
 *
 * A supplier page can claim anything; photographs of a real operation are
 * what an evaluating engineer actually weighs. The four figures follow the
 * material's own path — reception, transformation, verification, delivery —
 * so scrolling the section walks the process end to end.
 *
 * The grid is deliberately asymmetric (DESIGN.md §6): the two outer figures
 * run tall and the inner pair stacks, which breaks the four-equal-thumbnails
 * rhythm that makes a page read as a template.
 */

/** Column spans + aspect per figure, keeping the layout off-centre. */
const figureLayout = [
  { span: "lg:col-span-7", aspect: "aspect-4/3" },
  { span: "lg:col-span-5", aspect: "aspect-square" },
  { span: "lg:col-span-5", aspect: "aspect-square" },
  { span: "lg:col-span-7", aspect: "aspect-4/3" },
] as const;

export function PlantShowcase({ index = "03" }: { index?: string }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(16rem,3fr)] lg:items-end">
          <SectionHeading
            index={index}
            eyebrow="La operación"
            title="Una planta que se puede recorrer"
            intro="Recibimos scrap de la industria, lo transformamos en material recuperado y lo devolvemos a producción. Todo ocurre en instalaciones propias, bajo un sistema de gestión certificado."
          />
          <div className="border-line hidden border-t pt-5 lg:block">
            <p className="font-mono text-xs tracking-[0.16em] text-green-600 uppercase">
              Visitas de auditoría
            </p>
            <p className="text-ink-muted mt-2 text-sm">
              Recibimos auditorías de proveedor y visitas técnicas agendadas.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8 lg:grid-cols-12">
          {operationFigures.map((figure, i) => {
            const layout = figureLayout[i] ?? figureLayout[0];
            return (
              <Reveal key={figure.src} delay={i * 70} className={cn(layout.span)}>
                <AnnotatedFigure
                  image={figure}
                  aspect={layout.aspect}
                  parallax
                  sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
