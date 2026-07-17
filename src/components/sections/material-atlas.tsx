import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import materialAbs from "../../../public/media/servicios/material-abs.jpg";
import materialPa from "../../../public/media/servicios/material-pa.jpg";
import materialPbt from "../../../public/media/servicios/material-pbt.jpg";
import materialPc from "../../../public/media/servicios/material-pc.jpg";
import materialPmma from "../../../public/media/servicios/material-pmma.jpg";
import materialPom from "../../../public/media/servicios/material-pom.jpg";

const materials = [
  {
    code: "PC",
    name: "Policarbonato",
    form: "Molido cristal",
    image: materialPc,
    span: "md:col-span-2 lg:col-span-2",
    tone: "",
  },
  {
    code: "ABS/PC",
    name: "Mezcla ABS con PC",
    form: "Molido",
    image: materialAbs,
    span: "",
    tone: "",
  },
  {
    code: "PA66",
    name: "Poliamida",
    form: "Molido natural",
    image: materialPa,
    span: "",
    tone: "",
  },
  {
    code: "PP",
    name: "Polipropileno",
    form: "Molido o pellet",
    image: null,
    span: "",
    tone: "bg-green-500 text-navy-900",
  },
  {
    code: "PVC",
    name: "Policloruro de vinilo",
    form: "Presentación según lote",
    image: null,
    span: "",
    tone: "bg-navy-700 text-paper",
  },
  {
    code: "PBT",
    name: "Polibutileno tereftalato",
    form: "Pellet",
    image: materialPbt,
    span: "lg:col-span-2",
    tone: "",
  },
  {
    code: "POM",
    name: "Polioximetileno",
    form: "Pellet",
    image: materialPom,
    span: "",
    tone: "",
  },
  {
    code: "PMMA",
    name: "Polimetilmetacrilato",
    form: "Molido",
    image: materialPmma,
    span: "",
    tone: "",
  },
  {
    code: "TPO",
    name: "Elastómero termoplástico olefínico",
    form: "Molido o pellet",
    image: null,
    span: "md:col-span-2 lg:col-span-2",
    tone: "bg-blue-600 text-paper",
  },
] as const;

export function MaterialAtlas() {
  return (
    <section className="bg-green-300/10 py-14 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(20rem,3fr)] lg:items-end">
          <SectionHeading
            index="02"
            eyebrow="Materiales"
            title="Un atlas de polímeros para volver a producir"
            intro="Nueve familias destacadas en el portafolio corporativo, disponibles en distintas presentaciones, colores y condiciones según lote."
          />
          <div className="border-line border-t pt-5 lg:mb-1">
            <p className="font-mono text-xs tracking-[0.16em] text-green-600 uppercase">
              Disponibilidad variable
            </p>
            <p className="text-ink-muted mt-2 text-sm">
              Cada proyecto se revisa por resina, volumen, color, propiedades y aplicación final.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid auto-rows-[13rem] grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {materials.map((material) => (
            <li
              key={material.code}
              className={cn(
                "group border-line relative overflow-hidden rounded-sm border",
                material.span,
                material.image ? "bg-navy-900 text-white" : material.tone,
              )}
            >
              {material.image ? (
                <>
                  <Image
                    src={material.image}
                    alt={`Muestra de ${material.name} reciclado`}
                    fill
                    sizes={
                      material.span
                        ? "(max-width: 359px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 66vw, (max-width: 1279px) 50vw, 38rem"
                        : "(max-width: 359px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 19rem"
                    }
                    placeholder="blur"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                  <div
                    className="from-navy-900/95 via-navy-900/15 absolute inset-0 bg-gradient-to-t to-transparent"
                    aria-hidden
                  />
                </>
              ) : (
                <span
                  aria-hidden
                  className="font-display absolute -top-8 -right-4 text-[7rem] leading-none font-bold opacity-10"
                >
                  {material.code}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-xs font-semibold tracking-[0.18em] uppercase opacity-90">
                  {material.form}
                </p>
                <p className="font-display mt-1 text-3xl font-bold">{material.code}</p>
                <p className="mt-1 max-w-[26ch] text-[0.78rem] leading-snug break-words opacity-90 sm:text-sm">
                  {material.name}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-end">
          <ButtonLink href="/servicios/polimeros" variant="primary">
            Explorar el portafolio
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
