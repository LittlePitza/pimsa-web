import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { certifications } from "@/content/company";

/** Certifications as badge cards — key trust signals (PLAN.md §2). */
export function CertGrid({ index = "05" }: { index?: string }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          index={index}
          eyebrow="Certificaciones"
          title="Confianza respaldada por certificaciones"
          intro="Nuestros procesos y registros están certificados para operar con las industrias más exigentes."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {certifications.map((cert, i) => (
            <Reveal key={cert.code} delay={i * 60}>
              <Card lift className="h-full">
                <p className="font-mono text-green-600 text-lg font-semibold tracking-wider">
                  {cert.code}
                </p>
                <h3 className="font-display text-navy-500 mt-3 text-xl font-semibold">
                  {cert.name}
                </h3>
                <p className="text-ink-muted mt-3 text-sm">{cert.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
