import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Faq } from "@/types/content";

/** FAQ accordion section, reused by home (teaser) and the FAQ page. */
export function FaqSection({
  items,
  index = "06",
  title = "Preguntas frecuentes",
  intro,
  showAllLink = false,
}: {
  items: Faq[];
  index?: string;
  title?: string;
  intro?: string;
  showAllLink?: boolean;
}) {
  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <SectionHeading index={index} eyebrow="FAQ" title={title} intro={intro} />

        <div className="mt-12">
          <Accordion>
            {items.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                index={String(i + 1).padStart(2, "0")}
                title={faq.question}
              >
                <p>{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {showAllLink ? (
          <div className="mt-10">
            <ButtonLink href="/preguntas-frecuentes" variant="outline">
              Ver todas las preguntas
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
