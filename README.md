<p align="center">
  <img src=".github/banner.svg" alt="PIMSA Web. Corporate website and admin panel for Plásticos PIMSA." width="100%">
</p>

<p align="center">
  <a href="https://github.com/LittlePitza/pimsa-web/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/LittlePitza/pimsa-web/ci.yml?branch=main&style=flat-square&labelColor=0e1b2e&color=7f9d41&label=CI"></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-0e1b2e?style=flat-square&labelColor=0e1b2e&color=5d86b9">
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-0e1b2e?style=flat-square&labelColor=0e1b2e&color=5d86b9">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-v4-0e1b2e?style=flat-square&labelColor=0e1b2e&color=b0cd75">
  <img alt="Drizzle ORM and MySQL" src="https://img.shields.io/badge/data-Drizzle%20%2B%20MySQL-0e1b2e?style=flat-square&labelColor=0e1b2e&color=7f9d41">
  <img alt="WCAG 2.1 AA" src="https://img.shields.io/badge/a11y-WCAG%202.1%20AA-0e1b2e?style=flat-square&labelColor=0e1b2e&color=b0cd75">
</p>

<p align="center">
  The corporate website and internal admin panel of Plásticos de Ingeniería Mexicanos.<br>
  Recycled engineering polymers, a job board, lead capture and two operating areas.
</p>

<p align="center">
  <a href="https://plasticospimsa.com">plasticospimsa.com</a> &nbsp; / &nbsp;
  <a href="docs/PLAN.md">Plan</a> &nbsp; / &nbsp;
  <a href="docs/DESIGN.md">Design</a> &nbsp; / &nbsp;
  <a href="#authentication-and-areas">Admin panel</a> &nbsp; / &nbsp;
  <a href="#documentation">Documentation</a>
</p>

<br>

## The site

**[plasticospimsa.com](https://plasticospimsa.com)** is the public face of Plásticos de
Ingeniería Mexicanos, S.A. de C.V.: an engineering company that turns industrial scrap
into certified recycled polymers (ABS, PC, PA, POM and more). The site presents the
process and the services, publishes the available stock, takes job applications and
captures contact requests as leads.

Behind it sits an admin panel with two operating areas. Marketing works the leads and
the stock catalog; RRHH works vacancies and applications. Each area sees only its own
data. One Next.js application and one database serve both, and content lives in typed
files under `src/content/` rather than in a CMS, so a later CMS is a data-source swap.

> [!NOTE]
> The site and the panel are in **Spanish**; code, comments, commit messages and this
> documentation are in **English**. The marketing and photography briefs under `docs/` are
> written in Spanish.

<br>

## What is inside

<table>
  <tr>
    <td width="33%" valign="top">
      <strong>Public site</strong><br>
      Home, company, a services hub with four service pages, the stock catalog, FAQ and privacy notice. Server Components by default, structured content in <code>src/content/</code> and a design system built from tokens.
    </td>
    <td width="33%" valign="top">
      <strong>Careers and job board</strong><br>
      Published vacancies at <code>/jobs</code>, each with its own page and an application form that takes a CV (PDF or Word, up to 5 MB). Open vacancies are also exposed as an XML feed at <code>/jobs.xml</code> for job boards.
    </td>
    <td width="33%" valign="top">
      <strong>Contact and leads</strong><br>
      A contact form with a honeypot, per-IP rate limiting and server-side Zod validation. Every lead is stored with its UTM attribution before anything is emailed, so a mail failure never costs an enquiry.
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <strong>Admin panel</strong><br>
      A dashboard with per-area metrics, stock and vacancy CRUD, application status workflow, CV download and account management. Roles are enforced in every page, server action and API route, with a night mode for the panel.
    </td>
    <td width="33%" valign="top">
      <strong>Email centre</strong><br>
      SMTP status, per-flow recipients, test sends with the real templates and a delivery log of every attempt, sent, failed or skipped. It is configured from the panel and applies immediately, with no redeploy.
    </td>
    <td width="33%" valign="top">
      <strong>SEO and analytics</strong><br>
      JSON-LD (<code>Organization</code>, <code>LocalBusiness</code>, <code>Service</code>, <code>FAQPage</code>, <code>BreadcrumbList</code>), sitemap, robots, manifest and generated Open Graph images. GTM and GA4 load only after cookie consent.
    </td>
  </tr>
</table>

<br>

## Architecture

```mermaid
flowchart LR
  classDef surface fill:#f7f8f5,stroke:#0e1b2e,color:#16202c
  classDef app fill:#294466,stroke:#0e1b2e,color:#ffffff
  classDef data fill:#e8edf4,stroke:#5d86b9,color:#16202c
  classDef ext fill:#7f9d41,stroke:#0e1b2e,color:#ffffff

  Visitor["Visitor"]:::surface
  Staff["Marketing / RRHH / admin"]:::surface
  Site["Public site<br/>(marketing) route group"]:::app
  Api["/api/contact<br/>/api/applications"]:::app
  Proxy["proxy.ts<br/>canonical host + session gate"]:::app
  Panel["Admin panel<br/>requireArea · requireAdmin"]:::app
  Mail["lib/email<br/>single send door"]:::app
  DB[("MySQL<br/>Drizzle ORM")]:::data
  Smtp["SMTP mailbox"]:::ext
  Gtm["GTM / GA4<br/>after consent"]:::ext

  Visitor --> Site
  Site --> Api --> DB
  Site -->|"stock, vacancies"| DB
  Site -.-> Gtm
  Staff --> Proxy --> Panel --> DB
  Api --> Mail
  Panel -->|"settings, test sends"| Mail
  Mail --> Smtp
  Mail -->|"email_log"| DB
```

The application is one Next.js App Router project. Pages compose sections that read
structured content, route handlers and server actions own validation and writes, and
`src/db/` holds the Drizzle schema and queries. A lead or an application is written
to the database first and emailed second, so a failed send never loses the record and
every attempt is logged.

```text
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
├── proxy.ts              # Canonical-host redirect and the admin session gate
├── styles/tokens.css     # Design tokens (Tailwind v4 @theme)
└── types/                # Shared content types

drizzle/                  # Generated SQL migrations
scripts/                  # migrate, create-admin, seed-stock, optimize-media
public/media/             # Optimised photography and brand assets
docs/                     # Plan, design system, marketing and photography briefs
```

**Principles** (PLAN.md §4 · DESIGN.md §9)

- Server Components by default; `"use client"` only where interactivity requires it.
- Content lives in `src/content/`, separated from presentation — a CMS migration
  later is a data-source swap, not a refactor.
- Semantic design tokens in `src/styles/tokens.css` — a rebrand is a token change.
- Every page owns its metadata through the shared SEO helper (`src/lib/seo.ts`).

<br>

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19 | Server Components, route handlers, server actions and the metadata API |
| Language | TypeScript, strict mode | Typed content, schema and form payloads |
| Styling | Tailwind CSS v4 | Design tokens through `@theme`; the default palette is reset on purpose |
| Data | Drizzle ORM, `mysql2`, MySQL | Pure-JS driver with no native binaries, so it builds anywhere |
| Authentication | `bcryptjs`, `jose` | Hashed passwords and signed JWT session cookies |
| Validation | Zod 4 | Server-side validation of every form payload |
| Email | Nodemailer | Notifications and acknowledgements through one send door |
| Icons and type | Lucide, `next/font` | Space Grotesk, Inter and IBM Plex Mono, self-hosted |
| Checks | ESLint, Prettier, `tsc` | Lint, formatting and type checks; CI also builds |
| Hosting | Hostinger Node.js Web Apps | Auto-deploy from `main` |

<br>

## Quick start

Requires Node 20 or newer (CI runs 22).

```bash
npm install
cp .env.example .env.local   # fill in only what you need
npm run dev                  # http://localhost:3000
```

The **public site runs with zero configuration**: without SMTP the contact form still
accepts submissions (they are stored, and the panel's log records that nothing was
sent), and without `NEXT_PUBLIC_GTM_ID` analytics stay off. The **admin panel and job
board need a database** — see [Database setup](#database-setup).

### Scripts

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

<br>

## Routes

### Public site — `src/app/(marketing)/`

| Route | Page |
| --- | --- |
| `/` | Home — hero, process loop, services, stats, certifications, FAQ teaser |
| `/about` | Company history, certifications, team |
| `/services` | Services hub |
| `/services/[slug]` | Polímeros · Molienda y peletizado · Recolección de scrap · Contenedores |
| `/stock` | Filterable catalog of available recycled material |
| `/jobs` · `/jobs/[slug]` | Job board — apply with CV (PDF/Word, ≤ 5 MB) |
| `/contact` | Contact form + NAP + map |
| `/faq` | FAQ accordion (`FAQPage` JSON-LD) |
| `/privacy` | Privacy notice (LFPDPPP) |

SEO files are generated at the app root: `sitemap.ts`, `robots.ts`, `manifest.ts`,
`opengraph-image.tsx`, `icon.svg`, `apple-icon.png`. The job feed for external boards
is served at `/jobs.xml`.

### Admin panel — `src/app/admin/`

> [!IMPORTANT]
> **Login URL: [`/admin/login`](https://plasticospimsa.com/admin/login)**
> (`/admin` redirects there when there is no valid session).

| Route | Section | Area |
| --- | --- | --- |
| `/admin` | Dashboard with per-area metrics | Whole panel |
| `/admin/marketing` | Marketing area overview | Marketing |
| `/admin/leads` | Contact-form leads with UTM source | Marketing |
| `/admin/stock` · `/new` · `/[id]` | Stock catalog CRUD | Marketing |
| `/admin/hr` | HR area overview | RRHH |
| `/admin/vacancies` · `/new` · `/[id]` | Vacancy CRUD and publishing | RRHH |
| `/admin/applications` | Applications — status workflow + CV download | RRHH |
| `/admin/settings` | Email centre — recipients, test sends and delivery log | Both |
| `/admin/accounts` | Account management — **super-admins only** | Super-admin |

The panel is `noindex, nofollow` and every page is guarded server-side.

<br>

## Authentication and areas

- Email + password, hashed with **bcrypt**; sessions are **signed JWT cookies**
  (`jose`) — `httpOnly`, `sameSite=lax`, `secure` in production, valid **8 hours**.
- Every account has a **role** (`admin_users.role`): `marketing`, `rrhh` or `admin`
  (whole panel — the default, so pre-existing accounts keep full access).
  Marketing and RRHH log straight into their own portal and never see the other's
  nav, pages, data, CVs or email settings. Area definitions live in one place:
  [src/lib/roles.ts](./src/lib/roles.ts).
- Guards live in [src/lib/auth.ts](./src/lib/auth.ts): `requireAdmin()` for any panel
  page, `requireArea("marketing" | "rrhh")` for area pages and their mutations,
  `requireFullPanel()` for the general dashboard, `requireSuperAdmin()` for account
  management. Hidden nav links are cosmetic — **the guards run in each page, each
  server action and the CV route**. A user sent to a page outside their area lands
  back on their own portal.
- The role is **not** in the session token: it is read from the database on every
  request, so moving someone between areas takes effect immediately instead of
  waiting out their 8-hour session.
- Sessions carry a password-version claim, so **deleting an account or resetting its
  password immediately revokes its open sessions**.
- Login is throttled **per IP** (5 / 15 min) *and* **per account** (10 failures /
  15 min), so spreading the same guesses across a botnet no longer slips past a
  limit that only ever saw one address. Successful sign-ins cost nothing.
- The public API routes (`/api/contact`, `/api/applications`) reject requests a
  browser sent from another origin. Server actions get that check from Next;
  route handlers do not, and multipart uploads are a "simple" request that no
  preflight would have stopped.
- **Super-admins** (from `SUPER_ADMIN_EMAILS`, default `sistemas@plasticospimsa.com`)
  always keep the whole panel and manage users, areas and passwords from
  `/admin/accounts`.

Create a user (the password comes from `ADMIN_PASSWORD` or a hidden prompt — never
argv):

```bash
npm run admin:create -- correo@plasticospimsa.com "Nombre" marketing
```

<br>

## Email

Everything about outgoing mail is configured from **`/admin/settings`** and
applies immediately — no redeploy. The `SMTP_*` and `*_EMAIL_TO` variables are the
fallback the site uses before the panel is configured, and if the settings rows are
ever lost.

> [!IMPORTANT]
> **Two different things are called "the contact email", so keep them apart.** The
> address the site *shows* the public — footer, `/contact`, privacy notice,
> `LocalBusiness` JSON-LD — is `contacto@plasticospimsa.com` and lives in
> [src/content/company.ts](./src/content/company.ts) as part of the NAP. Where a
> submitted form is *delivered* is a separate, per-flow setting in the panel: leads
> go to Marketing, applications to RRHH. Changing one never changes the other.

The screen is read top to bottom:

1. **Estado del servicio** — SMTP account in use, last successful send, failures in
   the last 24 h, and a live **Probar conexión** that authenticates without sending.
2. **Avisos por formulario** — per flow (leads · applications): on/off, `To`, `CC`,
   `BCC`, a subject tag for inbox rules, and an optional acknowledgement to whoever
   submitted the form. Recipients render as chips so pasted lists are visibly parsed.
3. **Probar el envío** — sends the *real* template to the saved recipients or to any
   address typed in, so a mailbox can be verified before it goes live.
4. **Bitácora** — every attempt: sent, failed **or skipped**, with the reason.

Scoping follows the rest of the panel: Marketing configures the contact leads, RRHH
the applications, and the **SMTP account is super-admin only** — it changes how the
whole site sends, and it is the one screen that writes a password to the database
(AES-256-GCM, keyed from `AUTH_SECRET`, never rendered back).

Code: [src/lib/email/](./src/lib/email) — `config.ts` resolves panel → env → default,
`send.ts` is the single door every message goes through, `templates.ts` holds the HTML
and plain-text bodies.

> [!NOTE]
> **Delivery is best-effort by design.** A lead or application is stored before
> anything is emailed, so a bounced SMTP call never costs the enquiry — which is
> exactly why the log exists: without it, a failed delivery leaves no trace anyone can
> act on.

<br>

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
| `email_log` | Delivery log of every outgoing message — sent, failed or skipped |
| `admin_users` | Panel accounts (bcrypt hashes + area role) |

Order of operations on a fresh environment:

```bash
# 1. Create the MySQL database in hPanel → Databases
# 2. Set DATABASE_URL and AUTH_SECRET
npm run db:migrate
npm run admin:create -- correo@plasticospimsa.com "Nombre" admin   # prompts for the password
```

Changing the schema: edit `src/db/schema.ts` → `npm run db:generate` → commit the
generated SQL → `npm run db:migrate` on each environment.

<br>

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
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | No | Sending mailbox — **fallback** for `/admin/settings` |
| `CONTACT_EMAIL_TO` | No | Lead recipients (Marketing) — fallback |
| `APPLICATIONS_EMAIL_TO` | No | Application recipients — RRHH only, CVs never go to the general inbox — fallback |
| `CONTACT_EMAIL_FROM` | No | Sender address on outgoing mail — fallback |

Every `SMTP_*` / `*_EMAIL_*` variable above is a **fallback**. Email is configured
from the panel — see [Email](#email).

Generate `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

<br>

## Security and compliance

- **Rate limiting + honeypot** on the contact and application endpoints
  (`src/lib/rate-limit.ts`).
- **Upload validation**: CVs restricted to PDF/Word, ≤ 5 MB (`src/lib/uploads.ts`).
- **Zod validation** on every form payload, server-side.
- **Cookie consent** gates all non-essential tags (GTM/GA4) — LFPDPPP-friendly.
- CV downloads go through an authenticated route (`/api/admin/cv/[id]`), never a
  public URL.
- **Security headers** on every response: a Content-Security-Policy, HSTS,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and a restrictive
  `Permissions-Policy` (`next.config.ts`).

<br>

## Quality standards

These are the targets every change is held to; CI enforces lint, build and types.

- **Accessibility**: WCAG 2.1 AA — palette pre-validated for contrast, visible focus
  rings, full keyboard navigation, landmarks and skip-link, `prefers-reduced-motion`
  honored globally.
- **Performance**: Lighthouse ≥ 95 mobile, < 130 kB JS on marketing pages, CLS < 0.05.
  Self-hosted variable fonts, AVIF/WebP via `next/image`, no animation libraries.
- **SEO**: JSON-LD (`Organization`, `LocalBusiness`, `Service`, `FAQPage`,
  `BreadcrumbList`), canonical URLs, per-page OG images.

<br>

## Deployment

Hostinger Node.js Web Apps, auto-deploying from `main`.

| Setting | Value |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start` (respects `$PORT`) |
| Node | 22 LTS (20 minimum) |

> [!WARNING]
> Run `npm run db:migrate` after any deploy that adds migrations. `main` is
> production and deploys on every push.

CI ([.github/workflows/ci.yml](./.github/workflows/ci.yml)) runs lint, build and
typecheck on every push to `main` and on every PR. The build runs before the
typecheck because `next build` generates the route types the typecheck needs on a
fresh checkout.

<br>

## Conventions

- Code, comments and commit messages in **English**; site content in **Spanish**.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`).
- `main` is production and auto-deploys — work on `feat/…` or `fix/…` branches and
  open a PR.
- Definition of done: builds clean, lint and typecheck pass, metadata + JSON-LD
  present, responsive 360 px → 1440 px, Lighthouse spot-check.
- Content pending Marketing material is marked `TODO(marketing)`.

<br>

## Documentation

| Document | Contents |
| --- | --- |
| [docs/PLAN.md](./docs/PLAN.md) | Project goals, architecture, SEO strategy, roadmap |
| [docs/DESIGN.md](./docs/DESIGN.md) | Design system, art direction, component inventory |
| [docs/marketing-material-request.md](./docs/marketing-material-request.md) | Pending material from Marketing (`TODO(marketing)` markers) |
| [public/media/README.md](./public/media/README.md) | Rules for the optimised media library and `scripts/optimize-media.mjs` |
| [.env.example](./.env.example) | Every environment variable, with defaults |

<br>

<p align="center">
  <sub>© Plásticos de Ingeniería Mexicanos, S.A. de C.V. All rights reserved.</sub>
</p>
