import Link from "next/link";
import { MapPin } from "lucide-react";
import { CurrentYear } from "@/components/layout/current-year";
import { Logo } from "@/components/layout/logo";
import { SocialIcon } from "@/components/layout/social-icon";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PelletPattern } from "@/components/ui/pellet-pattern";
import {
  certifications,
  company,
  confirmedSocial,
  fullAddress,
  legalNav,
  mainNav,
} from "@/content/company";
import { services } from "@/content/services";

/**
 * Site footer on navy-900 (DESIGN.md §8): one four-column band plus a closing
 * stamp line, deliberately short. It ends the document rather than
 * advertising into it — CtaBand already sits directly above on every
 * marketing page, so a third quote button here would be redundancy.
 *
 * What a reader may notice is absent was all cut for height, and each has a
 * better home elsewhere: `company.description` (already in the Organization
 * JSON-LD, the meta description and /about), the certification descriptions
 * (CertGrid on /about) and the phone, WhatsApp, email and opening hours
 * (/contact). The certification codes stay as readable text, not images, so
 * they survive text extraction.
 *
 * This component is load-bearing for SEO and must stay a server component
 * with every link in the initial HTML: the Header renders its Servicios
 * dropdown and its whole mobile menu conditionally, so on /stock, /faq,
 * /privacy, /jobs and /contact this footer is the ONLY server-rendered link
 * path to /services and the four service pages. Never move these lists behind
 * a JS-gated accordion — CSS-collapse them if the design ever needs it.
 */

/** Column label: mono, blue-400 = structure (green stays scarce, DESIGN.md §2). */
const columnHeading = "font-mono text-xs font-medium tracking-[0.16em] text-blue-400 uppercase";

/**
 * 44px tap targets below md, 24px above — SC 2.5.8 is met by size at every
 * breakpoint rather than by the spacing exception, which the previous
 * `md:min-h-0` relied on and lost the moment a row wrapped.
 */
const navLink =
  "text-paper/80 hover:text-green-300 flex min-h-11 items-center text-sm underline-offset-4 transition-colors duration-150 hover:underline md:min-h-6";

export function Footer() {
  return (
    <footer
      data-band="dark"
      className="bg-navy-900 text-paper relative overflow-hidden border-t border-blue-400/30"
    >
      {/* The footer used to be the only flat navy surface on the site, and it
          abuts CtaBand's identical navy with no rule — hence the top hairline
          plus the house background motifs. Both are inline SVG/CSS. */}
      <div className="technical-grid absolute inset-0 opacity-50" aria-hidden />
      <PelletPattern className="absolute right-0 bottom-0 h-32 w-48 text-green-300/10" />

      {/* Navegación is now the tallest column, so the ratios only need to keep
          the address off a fourth line and the service names off a second. */}
      <Container className="relative py-8 md:py-10">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,1.45fr)] lg:gap-x-10">
          {/* ── Brand ──────────────────────────────────────────────────── */}
          <div>
            <Link
              href="/"
              aria-label="Plásticos PIMSA — Ir al inicio"
              className="inline-flex min-h-11 items-center rounded-sm"
            >
              <Logo tone="dark" />
            </Link>
            <Eyebrow tone="dark" className="mt-3">
              {company.tagline}
            </Eyebrow>

            {confirmedSocial.length > 0 ? (
              <nav aria-labelledby="footer-social-heading" className="mt-3">
                {/* Visually silent: four recognisable brand marks need no
                    "Síguenos" label, but the landmark still needs a name. */}
                <h2 id="footer-social-heading" className="sr-only">
                  Redes sociales
                </h2>
                {/* role="list" because Preflight strips list-style, and with it
                    the implicit list semantics in Safari/VoiceOver. */}
                <ul role="list" className="-ml-3 flex flex-wrap gap-1">
                  {confirmedSocial.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        // noreferrer is dropped on purpose: Referrer-Policy is
                        // already strict-origin-when-cross-origin site-wide, and
                        // stripping the header only blinds PIMSA's own analytics.
                        rel="noopener"
                        className="text-paper/80 hover:bg-paper/10 inline-flex size-11 items-center justify-center rounded-sm transition-colors duration-150 hover:text-green-300"
                      >
                        <SocialIcon name={social.name} />
                        {/* Real text, not aria-label: it survives machine
                            translation for the non-Spanish engineers this site
                            serves, and the new-tab behaviour is otherwise
                            announced by nothing (SC 2.4.4). */}
                        <span className="sr-only">
                          {company.name} en {social.name} (abre en una pestaña nueva)
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <ul
              role="list"
              // text-xs, not the denser text-[0.65rem] meta size: these are
              // trust signals for an audience that skews older and often reads
              // on plant-floor displays.
              className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs tracking-[0.16em] text-blue-400 uppercase"
            >
              {certifications.map((cert) => (
                <li key={cert.code}>{cert.code}</li>
              ))}
            </ul>
          </div>

          {/* ── Sitemap ──────────────────────────────────────────────────
              The two link columns pair up below sm so the phone footer is not
              one long ribbon; `sm:contents` dissolves this wrapper so both
              navs become direct children of the grid above at wider sizes. */}
          <div className="grid grid-cols-2 gap-x-8 sm:contents">
            {/* aria-labelledby, not aria-label: the landmark name and the
                visible heading are then the same string and cannot drift. */}
            <nav aria-labelledby="footer-nav-heading">
              <h2 id="footer-nav-heading" className={columnHeading}>
                Navegación
              </h2>
              <ul role="list" className="mt-2 md:mt-3">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    {/* longLabel where the terse header word says nothing to a
                      crawler ("Stock" → "Stock disponible"). */}
                    <Link href={item.href} className={navLink}>
                      {item.longLabel ?? item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-services-heading">
              <h2 id="footer-services-heading" className={columnHeading}>
                Servicios
              </h2>
              <ul role="list" className="mt-2 md:mt-3">
                {services.map((service) => (
                  <li key={service.slug}>
                    {/* Anchor text stays exactly the service name — the same
                      wording as each target page's own H1. */}
                    <Link href={`/services/${service.slug}`} className={navLink}>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Address ────────────────────────────────────────────────────
              Phone, WhatsApp, email and hours deliberately live only on
              /contact — repeating them here was the tallest block in the
              footer. What stays is the postal address, which must remain
              verbatim-consistent with the PostalAddress node in the
              LocalBusiness JSON-LD and with the Google Business Profile
              (PLAN.md §6): it is the site-wide location signal on the pages
              where that JSON-LD does not run. */}
          <div>
            <h2 className={columnHeading}>Domicilio</h2>
            <address className="mt-2 not-italic md:mt-3">
              {/* The "N" in NAP: without the name inside the block, this reads
                  as a floating address with no owner to a text extractor. */}
              <p className="text-paper text-sm font-medium">{company.legalName}</p>
              <p className="text-paper/80 mt-2 flex gap-2 text-sm">
                <MapPin
                  aria-hidden
                  strokeWidth={1.5}
                  className="mt-0.5 size-4 shrink-0 text-blue-400"
                />
                <span>{fullAddress()}</span>
              </p>
            </address>
          </div>
        </div>
      </Container>

      {/* ── Stamp line ─────────────────────────────────────────────────────
          The house closing meta strip: mono, uppercase, blue at the left,
          the single green accent at the right. */}
      <div className="relative border-t border-blue-400/30">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-3 font-mono text-xs tracking-[0.16em] text-blue-400 uppercase">
          <p className="text-paper/70">
            © <CurrentYear serverYear={new Date().getFullYear()} /> {company.legalName}
          </p>
          <ul role="list" className="flex flex-wrap gap-x-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center underline-offset-4 transition-colors duration-150 hover:text-green-300 hover:underline md:min-h-6"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Country is deliberately omitted: it is already in <address> and in
              the PostalAddress node. */}
          <p className="text-green-300">
            {company.address.municipality} · {company.address.state}
          </p>
        </Container>
      </div>
    </footer>
  );
}
