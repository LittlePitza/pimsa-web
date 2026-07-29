# PIMSA Web

Corporate website and internal admin panel for **[plasticospimsa.com](https://plasticospimsa.com)** —
Plásticos de Ingeniería Mexicanos, S.A. de C.V.

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Drizzle ORM + MySQL.
Deployed to Hostinger Node.js Web Apps with auto-deploy from `main`.

| Document | Contents |
| --- | --- |
| [PLAN.md](./PLAN.md) | Project goals, architecture, SEO strategy, roadmap |
| [DESIGN.md](./DESIGN.md) | Design system, art direction, component inventory |
| [docs/marketing-material-request.md](./docs/marketing-material-request.md) | Pending material from Marketing (`TODO(marketing)` markers) |

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in only what you need
npm run dev                  # http://localhost:3000
```

The **public site runs with zero configuration**: without `SMTP_*` the contact form
logs leads to the console instead of sending email, and without `NEXT_PUBLIC_GTM_ID`
analytics stay off. The **admin panel and job board need a database** — see
[Database setup](#database-setup).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (respects `$PORT`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run format` | Prettier write (`format:check` to verify only) |
| `npm run db:generate` | Generate SQL migrations from `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations (needs `DATABASE_URL`) |
| `npm run db:studio` | Drizzle Studio — browse the database |
| `npm run db:seed-stock` | Seed the stock catalog with starter rows |
| `npm run admin:create` | Create or update an admin panel user |

## Routes

### Public site — `src/app/(marketing)/`

| Route | Page |
| --- | --- |
| `/` | Home — hero, process loop, services, stats, certifications, FAQ teaser |
| `/nosotros` | Company history, certifications, team |
| `/servicios` | Services hub |
| `/servicios/[slug]` | Polímeros · Molienda y peletizado · Recolección de scrap · Contenedores |
| `/stock` | Filterable catalog of available recycled material |
| `/vacantes` · `/vacantes/[slug]` | Job board — apply with CV (PDF/Word, ≤ 5 MB) |
| `/contacto` | Contact form + NAP + map |
| `/preguntas-frecuentes` | FAQ accordion (`FAQPage` JSON-LD) |
| `/aviso-de-privacidad` | Privacy notice (LFPDPPP) |

SEO files are generated at the app root: `sitemap.ts`, `robots.ts`, `manifest.ts`,
`opengraph-image.tsx`, `icon.svg`, `apple-icon.png`.

### Admin panel — `src/app/admin/`

> **Login URL: [`/admin/login`](https://plasticospimsa.com/admin/login)**
> (`/admin` redirects there when there is no valid session).

| Route | Section |
| --- | --- |
| `/admin` | Dashboard with per-area metrics |
| `/admin/rrhh` | HR area overview |
| `/admin/vacantes` · `/nueva` · `/[id]` | Vacancy CRUD and publishing |
| `/admin/postulaciones` | Applications — status workflow + CV download |
| `/admin/marketing` | Marketing area overview |
| `/admin/leads` | Contact-form leads with UTM source |
| `/admin/stock` · `/nuevo` · `/[id]` | Stock catalog CRUD |
| `/admin/configuracion` | Site settings stored in the database |
| `/admin/cuentas` | Account management — **super-admins only** |

The panel is `noindex, nofollow` and every page is guarded server-side.

## Authentication

- Email + password, hashed with **bcrypt**; sessions are **signed JWT cookies**
  (`jose`) — `httpOnly`, `sameSite=lax`, `secure` in production, valid **8 hours**.
- Guards live in [src/lib/auth.ts](./src/lib/auth.ts): `requireAdmin()` on every panel
  page, `requireSuperAdmin()` on account management. There is no middleware — the
  checks run in the layout and in each server action.
- Sessions carry a password-version claim, so **deleting an account or resetting its
  password immediately revokes its open sessions**.
- **Super-admins** (from `SUPER_ADMIN_EMAILS`, default `sistemas@plasticospimsa.com`)
  can create users, change emails and reset passwords from `/admin/cuentas`.

Create the first user:

```bash
npm run admin:create -- correo@plasticospimsa.com "contraseña-segura" "Nombre"
```

## Database setup

MySQL on Hostinger, accessed with **Drizzle ORM + `mysql2`** (pure JS — no native
binaries, so it builds anywhere). Schema: [src/db/schema.ts](./src/db/schema.ts) ·
SQL migrations: [`drizzle/`](./drizzle).

| Table | Holds |
| --- | --- |
| `vacancies` | Job postings (draft/published) |
| `applications` | Candidate applications and their status |
| `application_files` | CV blobs — stored in the DB so they survive Git redeploys |
| `leads` | Contact-form submissions with UTM attribution |
| `stock_items` | Recycled-material catalog |
| `settings` | Editable site settings |
| `admin_users` | Panel accounts (bcrypt hashes) |

Order of operations on a fresh environment:

```bash
# 1. Create the MySQL database in hPanel → Databases
# 2. Set DATABASE_URL and AUTH_SECRET
npm run db:migrate
npm run admin:create -- correo@plasticospimsa.com "contraseña-segura" "Nombre"
```

Changing the schema: edit `src/db/schema.ts` → `npm run db:generate` → commit the
generated SQL → `npm run db:migrate` on each environment.

## Environment variables

All documented in [.env.example](./.env.example). Set them in hPanel for production —
**never commit secrets**.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | For panel/job board | `mysql://user:pass@host:3306/db` |
| `AUTH_SECRET` | For panel | Session signing key (32 random bytes, base64url) |
| `SUPER_ADMIN_EMAILS` | No | Comma-separated super-admins |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL — metadata, sitemap, JSON-LD |
| `NEXT_PUBLIC_GTM_ID` | No | GTM container; loads only after cookie consent |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | No | Lead email delivery |
| `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM` | No | Lead recipients and sender |

Generate `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Project structure

```
src/
├── app/
│   ├── (marketing)/      # Public site route group
│   ├── admin/            # login/ + (panel)/ — server-guarded
│   ├── api/              # contact, applications, admin CV download
│   └── sitemap.ts robots.ts manifest.ts opengraph-image.tsx
├── components/
│   ├── ui/               # Design-system primitives (Button, Card, Accordion…)
│   ├── layout/           # Header, Footer, WhatsApp FAB, sticky mobile CTA
│   ├── sections/         # Page sections (Hero, ProcessLoop, StatsBand…)
│   ├── admin/            # Panel-only components
│   ├── marketing/        # Consent banner, GTM loader, UTM capture
│   └── seo/              # JSON-LD renderer
├── content/              # Structured content in Spanish (services, FAQs, company…)
├── db/                   # Drizzle schema + queries
├── lib/                  # auth, session, seo, structured-data, mailer, rate-limit…
├── styles/tokens.css     # Design tokens (Tailwind v4 @theme)
└── types/                # Shared content types
```

**Principles** (PLAN.md §4 · DESIGN.md §9)

- Server Components by default; `"use client"` only where interactivity requires it.
- Content lives in `src/content/`, separated from presentation — a CMS migration
  later is a data-source swap, not a refactor.
- Semantic design tokens in `src/styles/tokens.css` — a rebrand is a token change.
- Every page owns its metadata through the shared SEO helper (`src/lib/seo.ts`).

## Security & compliance

- **Rate limiting + honeypot** on the contact and application endpoints
  (`src/lib/rate-limit.ts`).
- **Upload validation**: CVs restricted to PDF/Word, ≤ 5 MB (`src/lib/uploads.ts`).
- **Zod validation** on every form payload, server-side.
- **Cookie consent** gates all non-essential tags (GTM/GA4) — LFPDPPP-friendly.
- CV downloads go through an authenticated route (`/api/admin/cv/[id]`), never a
  public URL.

## Quality standards

- **Accessibility**: WCAG 2.1 AA — palette pre-validated for contrast, visible focus
  rings, full keyboard navigation, landmarks and skip-link, `prefers-reduced-motion`
  honored globally.
- **Performance**: Lighthouse ≥ 95 mobile, < 130 kB JS on marketing pages, CLS < 0.05.
  Self-hosted variable fonts, AVIF/WebP via `next/image`, no animation libraries.
- **SEO**: JSON-LD (`Organization`, `LocalBusiness`, `Service`, `FAQPage`,
  `BreadcrumbList`), canonical URLs, per-page OG images.

## Deployment

Hostinger Node.js Web Apps, auto-deploying from `main`.

| Setting | Value |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start` (respects `$PORT`) |
| Node | 22 LTS (20 minimum) |

Run `npm run db:migrate` after any deploy that adds migrations. CI
([.github/workflows/ci.yml](./.github/workflows/ci.yml)) runs lint + typecheck + build
on every push and PR.

## Conventions

- Code, comments and commit messages in **English**; site content in **Spanish**.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`).
- `main` is production and auto-deploys — work on `feat/…` or `fix/…` branches and
  open a PR.
- Definition of done: builds clean, lint and typecheck pass, metadata + JSON-LD
  present, responsive 360 px → 1440 px, Lighthouse spot-check.
- Content pending Marketing material is marked `TODO(marketing)`.

---

© Plásticos de Ingeniería Mexicanos, S.A. de C.V. — private repository, all rights reserved.
