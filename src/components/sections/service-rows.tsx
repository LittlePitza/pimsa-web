import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { services } from "@/content/services";

/**
 * Services hub as an index/table-of-contents (DESIGN.md §7): each service
 * a full-width row with a big index number, name, one-liner, photo and arrow.
 * The photo sits desaturated and shifts to full color on hover.
 */
export function ServiceRows() {
  return (
    <section>
      <Container className="pb-24 md:pb-32">
        <ul className="border-line border-t">
          {services.map((service) => (
            <li key={service.slug} className="border-line border-b">
              <Link
                href={`/servicios/${service.slug}`}
                className="group grid items-center gap-x-8 gap-y-4 py-8 md:grid-cols-[auto_1fr_11rem_auto] md:py-10"
              >
                <span
                  aria-hidden
                  className="font-display text-h1 text-line group-hover:text-green-500 font-bold transition-colors duration-150"
                >
                  {service.index}
                </span>
                <div>
                  {/* Real headings: the hub's service names are its document outline. */}
                  <h2 className="font-display text-h3 text-navy-500 group-hover:text-blue-600 font-semibold transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-ink-muted mt-1 max-w-[60ch]">{service.tagline}</p>
                </div>
                <span className="border-line relative hidden aspect-4/3 overflow-hidden border md:block">
                  <Image
                    src={service.figure.src}
                    alt={service.figure.alt}
                    fill
                    sizes="11rem"
                    className="object-cover grayscale-[0.85] transition-[filter,scale] duration-300 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </span>
                <ArrowRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="text-ink-muted group-hover:text-green-600 hidden size-7 transition-[translate,color] duration-150 group-hover:translate-x-2 md:block"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
