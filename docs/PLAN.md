# Plásticos PIMSA — Corporate Website Project Plan

> Central website for **plasticospimsa.com** — Plásticos de Ingeniería Mexicanos, S.A. de C.V.
> Status: **Planning** · Last updated: 2026-07-03

---

## 1. Project Goals

1. Replace the current WordPress/Elementor site with a fast, modern, professional web application.
2. Present a formal, trustworthy corporate image to industrial clients (automotive, white goods, electronics).
3. Maximize organic visibility (SEO) so prospects find PIMSA when searching for plastic recycling, engineering polymers, scrap collection, grinding/pelletizing services in Mexico.
4. Serve as a **platform, not just a brochure**: a solid base that grows over time (marketing tools, plastic stock catalog, blog, client portal, internal apps).
5. Give the Marketing team measurable tools: analytics, lead capture, campaign landing pages, editable content.

## 2. Company Context (research summary)

- **Business**: industrial plastic recycling & circular economy. Founded ~2008, incorporated Sep 2011 by Luis Benítez Fernández.
- **Services**: engineering polymers (resins/forms), grinding & pelletizing (maquila), scrap collection (official environmental permits), collapsible HD containers.
- **Credentials**: ISO-9001:2015, IMMEX, DUNS — trust signals that must be prominent.
- **Industries served**: automotive, white goods, electrical/electronic.
- **Location**: Calle Ingenieros #104, Distrito Industrial Oriente, El Castillo, 38160 Apaseo el Grande, Gto.
- **Channels**: WhatsApp (+52 442 274 7546), Facebook, LinkedIn, Instagram, TikTok.
- **Current site**: WordPress + Elementor, Spanish, blue/teal branding, contact form, FAQ.

## 3. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16 (LTS) — App Router** | SSR/SSG for SEO, React ecosystem, first-class metadata API, scalable to a full app |
| Language | **TypeScript (strict)** | Type safety, long-term maintainability |
| Styling | **Tailwind CSS v4** | Consistent design system, fast iteration, small CSS output |
| UI primitives | **shadcn/ui + Radix** (as needed) | Accessible, unstyled primitives we own in-repo — no dependency lock-in |
| Content | **MDX / structured data files first**; headless CMS later if Marketing needs self-service | Start simple, zero infra; upgrade path is planned (see §9) |
| Forms / leads | Next.js Route Handlers + email delivery (Resend/SMTP) + honeypot/rate limit | Own the data, no third-party form lock-in |
| Analytics | **GA4 via Google Tag Manager** + Meta Pixel (behind cookie consent) | Marketing manages tags without code deploys |
| Icons/assets | Lucide icons, `next/image` with AVIF/WebP | Performance |
| Hosting | **Hostinger Node.js Web Apps** with GitHub auto-deploy | Deploys on every push to `main`; supports full SSR |
| Repo | Git + GitHub, Conventional Commits | Traceability, CI-ready |

**Conventions**: all code, comments, file names, commit messages in **English**. Site content in **Spanish** (primary audience), architected for future `en` locale (see §9).

## 4. Architecture & Folder Structure

```
pimsa-web/
├── public/                  # Static assets (favicons, og images, logos)
├── src/
│   ├── app/                 # App Router
│   │   ├── (marketing)/     # Public site route group
│   │   │   ├── page.tsx             # Home
│   │   │   ├── about/               # About us
│   │   │   ├── services/            # Services hub
│   │   │   │   └── [slug]/          # polimeros · molienda-peletizado · recoleccion-scrap · contenedores
│   │   │   ├── stock/               # Plastic stock (future: dynamic catalog)
│   │   │   ├── contact/
│   │   │   └── faq/
│   │   ├── api/             # Route handlers (contact form, etc.)
│   │   ├── layout.tsx       # Root layout (fonts, analytics, consent)
│   │   ├── sitemap.ts       # Auto-generated sitemap
│   │   ├── robots.ts
│   │   ├── manifest.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/              # Design-system primitives (Button, Card, ...)
│   │   ├── layout/          # Header, Footer, Nav, WhatsApp FAB
│   │   ├── sections/        # Page sections (Hero, ServicesGrid, CTA, FAQ, ...)
│   │   └── marketing/       # Analytics, consent banner, pixels
│   ├── content/             # Structured content (services, faqs, company data)
│   ├── lib/                 # Utilities (seo helpers, schema.org builders, env)
│   ├── styles/              # globals.css, design tokens
│   └── types/               # Shared TypeScript types
├── .github/workflows/       # CI (lint, typecheck, build)
├── .env.example             # Documented env vars (never commit secrets)
├── PLAN.md                  # This document
└── README.md
```

**Principles**

- **Server Components by default**; `"use client"` only where interactivity requires it.
- Content separated from presentation (`src/content/`) → pages stay clean, CMS migration later is trivial.
- Design tokens (colors, spacing, type scale) centralized → consistent brand, easy re-theme.
- Every page owns its metadata via `generateMetadata` and a shared SEO helper.

## 5. Sitemap & Pages (Phase 1)

| Route | Page | Primary SEO intent (Spanish keywords) |
|---|---|---|
| `/` | Home | reciclaje de plásticos de ingeniería, economía circular México |
| `/about` | About / history / certifications | empresa recicladora de plásticos Guanajuato |
| `/services` | Services hub | servicios de reciclaje industrial |
| `/services/polimeros` | Engineering polymers | polímeros de ingeniería reciclados, resinas |
| `/services/molienda-peletizado` | Grinding & pelletizing | molienda y peletizado de plástico, maquila |
| `/services/recoleccion-scrap` | Scrap collection | recolección de scrap plástico industrial |
| `/services/contenedores` | Collapsible containers | contenedores colapsables industriales |
| `/stock` | Plastic stock | venta de plástico reciclado / disponibilidad |
| `/contact` | Contact + form + map | contacto recicladora Apaseo el Grande |
| `/faq` | FAQ | long-tail questions (also FAQ schema) |
| Legal | Privacy notice (LFPDPPP), cookies | compliance |

Each service page: problem → process → benefits → certifications → CTA (quote/WhatsApp). Strong internal linking between services, stock, and contact.

## 6. SEO Strategy

**Technical**
- SSG/ISR for all marketing pages → instant TTFB, fully crawlable HTML.
- `sitemap.ts`, `robots.ts`, canonical URLs, clean Spanish slugs.
- **Structured data (JSON-LD)**: `Organization`, `LocalBusiness` (address, geo, hours), `Service` per service page, `FAQPage`, `BreadcrumbList`.
- Open Graph + Twitter cards with branded OG images per page.
- 301 redirect map from all current WordPress URLs → new routes (critical to keep existing rankings).
- Google Search Console + Bing Webmaster verification from day one.

**Performance (Core Web Vitals as a ranking factor)**
- Target Lighthouse ≥ 95 mobile: `next/image`, `next/font` (self-hosted, no layout shift), zero render-blocking third parties, GTM loaded after interaction/consent.
- Budget: < 130 kB JS on marketing pages.

**Content**
- One clear H1 + semantic heading hierarchy per page; keyword-focused but natural copy.
- FAQ page targets long-tail queries; blog (Phase 2) sustains growth.
- Local SEO: consistent NAP with Google Business Profile.

## 7. Marketing Toolkit

- **GTM container** → Marketing adds/edits tags (GA4, Meta Pixel, LinkedIn Insight) without deploys.
- **Cookie consent banner** (LFPDPPP-friendly) gating non-essential tags.
- **Lead capture**: contact/quote forms with source tracking (UTM persistence), delivered to email + stored for CRM handoff.
- **WhatsApp CTA** floating button with click tracking.
- **Campaign landing pages**: reusable section components make new landings a content file, not a dev project.
- Phase 2: blog/news system, newsletter signup, downloadable technical datasheets (gated for lead gen).

## 8. Deployment — Hostinger

- Hostinger **Node.js Web Apps** + GitHub integration: auto build & deploy on every push to `main`.
- Settings: install `npm ci` · build `npm run build` · start `npm run start -- -p $PORT` · Node 22 LTS (20 minimum).
- Environment variables configured in hPanel (never committed); `.env.example` documents them.
- Domain `plasticospimsa.com` pointed after staging validation; SSL via Hostinger.
- CI on GitHub Actions (lint + typecheck + build) so broken code never reaches `main`.

## 9. Roadmap

| Phase | Scope |
|---|---|
| **0. Foundation** (now) | Plan, repo, Next.js scaffold, tooling (TS strict, ESLint, Prettier, CI), design tokens, base layout |
| **1. Core site** | All Phase-1 pages, SEO infrastructure, contact form, consent + analytics, redirect map |
| **2. Launch** | Hostinger staging → content review with Marketing → DNS cutover, Search Console, GBP alignment |
| **3. Growth** | Blog, dynamic plastic-stock catalog (DB-backed), gated datasheets, `en` locale for international/IMMEX clients |
| **4. Platform** | Headless CMS for Marketing self-service, client/quote portal, internal integrations |

## 10. Working Agreements

- **Git**: `main` = production (auto-deploys). Feature branches `feat/...`, `fix/...` → PR → merge. Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`...).
- **Quality gates**: ESLint + Prettier + `tsc --noEmit` on CI; no direct pushes of failing builds.
- **Accessibility**: WCAG 2.1 AA baseline (semantic HTML, contrast, keyboard nav).
- **Definition of done**: builds clean, lint/typecheck pass, metadata + JSON-LD present, responsive (360px → 1440px), Lighthouse spot-check.

---

**Next step**: Phase 0 — scaffold the Next.js application and tooling on this foundation.
