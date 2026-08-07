"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/content/company";
import { cn } from "@/lib/utils";

/**
 * Site header: transparent over the home hero, solid paper once scrolled
 * (DESIGN.md §8). Quote CTA always visible.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Close menus on navigation — state adjustment during render
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  // Only the home hero sits on a navy band behind the header.
  const overHero = pathname === "/" && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the services dropdown on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  // Close the mobile menu with Escape, returning focus to the toggle button.
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const linkClasses = (href: string) =>
    cn(
      "text-sm font-medium transition-colors duration-150",
      overHero ? "text-paper/85 hover:text-paper" : "text-ink hover:text-blue-600",
      pathname === href && (overHero ? "text-paper" : "text-blue-600"),
    );

  return (
    <header
      data-band={overHero ? "dark" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero ? "bg-transparent" : "bg-paper/95 border-line border-b backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
        {/* Full header height so the whole logo area is tappable on mobile —
            the 36px-tall SVG alone left dead zones above and below it. */}
        <Link
          href="/"
          aria-label="Plásticos PIMSA — Ir al inicio"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex h-full shrink-0 items-center rounded-sm"
        >
          <Logo tone={overHero ? "dark" : "light"} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href} ref={servicesRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((open) => !open)}
                    className={cn(linkClasses(item.href), "inline-flex items-center gap-1")}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      strokeWidth={1.5}
                      className={cn("size-4 transition-transform", servicesOpen && "rotate-180")}
                    />
                  </button>
                  {servicesOpen ? (
                    <ul
                      id="services-menu"
                      className="bg-surface border-line shadow-lift absolute top-full left-1/2 mt-3 w-64 -translate-x-1/2 rounded-md border p-2"
                    >
                      <li>
                        <Link
                          href={item.href}
                          className="text-navy-500 hover:bg-paper block rounded-sm px-3 py-2 text-sm font-medium"
                        >
                          Todos los servicios
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="text-ink hover:bg-paper block rounded-sm px-3 py-2 text-sm"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={linkClasses(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href="/contact"
            size="sm"
            variant={overHero ? "accent" : "primary"}
            className="hidden sm:inline-flex"
          >
            Cotizar
          </ButtonLink>

          {/* Mobile menu toggle */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "-mr-1.5 inline-flex size-11 items-center justify-center rounded-sm lg:hidden",
              overHero ? "text-paper" : "text-navy-500",
            )}
          >
            {menuOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Navegación móvil"
          className="bg-paper border-line max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b px-5 pt-2 pb-6 lg:hidden"
        >
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href} className="border-line border-b last:border-0">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="text-navy-500 block py-3.5 font-medium"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="pb-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="text-ink-muted flex min-h-11 items-center text-sm"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <ButtonLink href="/contact" className="mt-5 w-full">
            Solicitar cotización
          </ButtonLink>
        </nav>
      ) : null}
    </header>
  );
}
