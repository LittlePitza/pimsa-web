import { Container } from "@/components/ui/container";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stat } from "@/components/ui/stat";
import { stats } from "@/content/about";

/** Oversized data band on navy (DESIGN.md §4.6, §6 — bento stats). */
export function StatsBand() {
  return (
    <section data-band="dark" className="bg-navy-900 relative overflow-hidden py-24 md:py-32">
      <PelletPattern className="text-blue-400/15 absolute bottom-0 left-0 h-56 w-80" />

      <Container className="relative">
        <SectionHeading
          index="04"
          eyebrow="En números"
          title="Resultados que se pueden medir"
          tone="dark"
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-blue-400/30 border-t pt-6">
              <Stat stat={stat} tone="dark" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
