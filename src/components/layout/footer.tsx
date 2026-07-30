import Link from "next/link";
import { CurrentYear } from "@/components/layout/current-year";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import {
  certifications,
  company,
  fullAddress,
  legalNav,
  mainNav,
  whatsappUrl,
} from "@/content/company";
import { services } from "@/content/services";

/** Site footer on navy-900: sitemap, NAP, certifications, social (DESIGN.md §8). */
export function Footer() {
  return (
    <footer data-band="dark" className="bg-navy-900 text-paper">
      <Container className="py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Plásticos PIMSA — Ir al inicio"
              className="inline-flex min-h-11 items-center rounded-sm"
            >
              <Logo tone="dark" />
            </Link>
            <p className="mt-4 font-mono text-xs tracking-[0.18em] text-green-300 uppercase">
              {company.tagline}
            </p>
            <p className="text-paper/70 mt-4 max-w-xs text-sm">{company.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge key={cert.code} tone="dark">
                  {cert.code}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sitemap */}
          <nav aria-label="Mapa del sitio">
            <h2 className="font-mono text-xs tracking-[0.18em] text-blue-400 uppercase">
              Navegación
            </h2>
            <ul className="mt-3 space-y-0.5 md:mt-5 md:space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-paper/80 flex min-h-9 items-center text-sm transition-colors hover:text-green-300 md:min-h-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Servicios">
            <h2 className="font-mono text-xs tracking-[0.18em] text-blue-400 uppercase">
              Servicios
            </h2>
            <ul className="mt-3 space-y-0.5 md:mt-5 md:space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/servicios/${service.slug}`}
                    className="text-paper/80 flex min-h-9 items-center text-sm transition-colors hover:text-green-300 md:min-h-0"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact / NAP — consistent with Google Business Profile (PLAN.md §6) */}
          <div>
            <h2 className="font-mono text-xs tracking-[0.18em] text-blue-400 uppercase">
              Contacto
            </h2>
            <address className="text-paper/80 mt-5 space-y-3 text-sm not-italic">
              <p>{fullAddress()}</p>
              <p>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="inline-flex min-h-9 items-center hover:text-green-300 md:min-h-0"
                >
                  {company.phone}
                </a>
              </p>
              <p>
                <a
                  href={whatsappUrl()}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex min-h-9 items-center hover:text-green-300 md:min-h-0"
                >
                  WhatsApp: {company.whatsappDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex min-h-9 items-center hover:text-green-300 md:min-h-0"
                >
                  {company.email}
                </a>
              </p>
              <p className="text-paper/60">{company.hours}</p>
            </address>
            <ul className="mt-4 flex flex-wrap gap-x-5 md:mt-6" aria-label="Redes sociales">
              {company.social.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex min-h-9 items-center font-mono text-xs tracking-wider text-blue-400 uppercase transition-colors hover:text-green-300 md:min-h-0"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-navy-700 border-t">
        <Container className="flex flex-col items-start justify-between gap-3 py-6 text-xs md:flex-row md:items-center">
          <p className="text-paper/50">
            © <CurrentYear serverYear={new Date().getFullYear()} /> {company.legalName} Todos los
            derechos reservados.
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-paper/60 flex min-h-9 items-center hover:text-green-300 md:min-h-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
