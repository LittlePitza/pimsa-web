import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Interior page hero on paper: breadcrumbs + mono eyebrow + display title. */
export function PageHero({
  eyebrow,
  index,
  title,
  intro,
  breadcrumbs,
}: {
  eyebrow: string;
  index?: string;
  title: string;
  intro?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <section className="border-line border-b pt-28 md:pt-36">
      <Container className="pb-12 md:pb-16">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className="mt-8 max-w-3xl">
          <Eyebrow>
            {index ? `${index} / ` : ""}
            {eyebrow}
          </Eyebrow>
          <h1 className="font-display text-h1 text-navy-500 mt-4 font-bold">{title}</h1>
          {intro ? <p className="text-lead text-ink-muted mt-6 max-w-[68ch]">{intro}</p> : null}
        </div>
      </Container>
    </section>
  );
}
