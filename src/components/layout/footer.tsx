import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { certifications, company, fullAddress, legalNav, mainNav, whatsappUrl } from "@/content/company";
import { services } from "@/content/services";

/** Site footer on navy-900: sitemap, NAP, certifications, social (DESIGN.md §8). */
export function Footer() {
  return (
    <footer data-band="dark" className="bg-navy-900 text-paper">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Plásticos PIMSA — Inicio">
              <Logo tone="dark" />
            </Link>
            <p className="text-paper/70 mt-5 max-w-xs text-sm">{company.description}</p>
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
            <h2 className="text-blue-400 font-mono text-xs tracking-[0.18em] uppercase">
              Navegación
            </h2>
            <ul className="mt-5 space-y-3">
              {mainNav
                .filter((item) => !item.children)
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-paper/80 hover:text-green-300 text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Servicios">
            <h2 className="text-blue-400 font-mono text-xs tracking-[0.18em] uppercase">
              Servicios
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/servicios/${service.slug}`}
                    className="text-paper/80 hover:text-green-300 text-sm transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact / NAP — consistent with Google Business Profile (PLAN.md §6) */}
          <div>
            <h2 className="text-blue-400 font-mono text-xs tracking-[0.18em] uppercase">
              Contacto
            </h2>
            <address className="text-paper/80 mt-5 space-y-3 text-sm not-italic">
              <p>{fullAddress()}</p>
              <p>
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-green-300">
                  {company.phone}
                </a>
              </p>
              <p>
                <a
                  href={whatsappUrl()}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-green-300"
                >
                  WhatsApp: {company.whatsappDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="hover:text-green-300">
                  {company.email}
                </a>
              </p>
              <p className="text-paper/60">{company.hours}</p>
            </address>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Redes sociales">
              {company.social.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-blue-400 hover:text-green-300 font-mono text-xs tracking-wider uppercase transition-colors"
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
            © {new Date().getFullYear()} {company.legalName} Todos los derechos reservados.
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/60 hover:text-green-300">
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
