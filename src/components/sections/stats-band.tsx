import Image, { type StaticImageData } from "next/image";
import { Container } from "@/components/ui/container";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stat } from "@/components/ui/stat";
import { stats } from "@/content/about";
import { cn } from "@/lib/utils";
import warehouseAisle from "../../../public/media/corporate/almacen-pasillo.jpg";

/**
 * Capacity data over real PIMSA plant photography.
 *
 * The backdrop is a prop because this band runs on both Home and Nosotros:
 * hard-coding it meant the same photograph greeted the reader twice within
 * two clicks, which is what made the site feel like one page repeated. Any
 * frame passed here disappears under an ~88% overlay, so pick for structure
 * and tonal range, never for subject.
 */
export function StatsBand({
  index = "05",
  image = warehouseAisle,
  imagePosition = "object-[50%_52%]",
}: {
  index?: string;
  image?: StaticImageData;
  /** Tailwind object-position for the backdrop crop. */
  imagePosition?: string;
}) {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden py-12 md:py-24">
      {/* Decorative backdrop under an ~88% overlay — low quality is invisible here. */}
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        quality={50}
        placeholder="blur"
        className={cn("object-cover", imagePosition)}
      />
      <div className="bg-navy-900/88 absolute inset-0 mix-blend-multiply" aria-hidden />
      <div
        className="from-navy-900 via-navy-900/80 to-navy-900/35 absolute inset-0 bg-gradient-to-r"
        aria-hidden
      />
      <PelletPattern className="absolute bottom-0 left-0 h-56 w-80 text-blue-400/15" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(18rem,4fr)_minmax(0,8fr)] lg:items-end">
          <SectionHeading
            index={index}
            eyebrow="Capacidad instalada"
            title="Escala industrial, evidencia visible"
            intro="Infraestructura propia para recibir, transformar y devolver material a cadenas productivas de alto volumen."
            tone="dark"
          />

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-t border-blue-400/35 pt-5 backdrop-blur-[1px]"
              >
                <Stat stat={stat} tone="dark" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-blue-400/30 pt-4 font-mono text-[0.65rem] tracking-[0.16em] text-blue-400 uppercase">
          <span>Planta La Estancia · PIMSA</span>
          <span className="text-green-300">Molienda · Peletizado · Laboratorio</span>
        </div>
      </Container>
    </section>
  );
}
