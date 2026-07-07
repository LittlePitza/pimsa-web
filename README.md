# PIMSA Web

Corporate website for [plasticospimsa.com](https://plasticospimsa.com) — Plásticos de Ingeniería Mexicanos, S.A. de C.V.

Built with Next.js (App Router) + TypeScript + Tailwind CSS. Deployed to Hostinger Node.js Web Apps via GitHub auto-deploy.

📋 See [PLAN.md](./PLAN.md) for the full project plan, architecture, SEO strategy, and roadmap.
🎨 See [DESIGN.md](./DESIGN.md) for the design system and art direction.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev
```

The site runs without any env vars in development (the contact form logs
leads to the console instead of sending email, and analytics stay off).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (respects `$PORT`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run format` | Prettier write |
| `npm run db:generate` | Generate SQL migrations from `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations (uses `DATABASE_URL`) |
| `npm run admin:create` | Create/update an admin panel user |

## Project structure

```
src/
├── app/                  # App Router: (marketing) route group, api/, SEO files
├── components/
│   ├── ui/               # Design-system primitives (Button, Card, Accordion…)
│   ├── layout/           # Header, Footer, WhatsApp FAB, sticky mobile CTA
│   ├── sections/         # Page sections (Hero, ProcessLoop, StatsBand…)
│   ├── marketing/        # Consent banner, GTM loader, UTM capture
│   └── seo/              # JSON-LD renderer
├── content/              # Structured content in Spanish (services, FAQs, stock…)
├── lib/                  # SEO helpers, schema.org builders, rate limit, utils
├── styles/tokens.css     # Design tokens (Tailwind v4 @theme)
└── types/                # Shared content types
```

Key principles (from PLAN.md §4): Server Components by default, content
separated from presentation in `src/content/`, semantic design tokens, every
page owns its metadata via the shared SEO helper.

## Backend (MySQL on Hostinger)

- **ORM**: Drizzle + `mysql2` (pure JS — no native binaries). Schema in
  [src/db/schema.ts](./src/db/schema.ts); SQL migrations in `./drizzle`.
- **Job board**: `/vacantes` lists open vacancies; applications (with CV,
  PDF/Word ≤ 5 MB) are stored in the database — CV blobs survive Git
  redeploys — and optionally e-mailed to HR.
- **Admin panel**: `/admin` (login with email + password, bcrypt + signed
  session cookie, 8 h). Manage vacancies (CRUD/publish), review applications
  (status + CV download) and contact leads.
- **Setup order**: create the MySQL DB in hPanel → set `DATABASE_URL` and
  `AUTH_SECRET` → `npm run db:migrate` → `npm run admin:create -- <email> <password> [name]`.

## Environment variables

Documented in [.env.example](./.env.example). Configure them in hPanel for
production; never commit secrets.

## Deployment (Hostinger Node.js Web Apps)

- Build command: `npm run build` · Start: `npm run start` · Node 22 LTS.
- `main` auto-deploys to production. CI (lint + typecheck + build) runs on
  every push and PR via GitHub Actions.

## Conventions

- All code, comments, and commit messages in **English**; site content in Spanish.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- `main` auto-deploys to production — work on feature branches and open a PR.
- Content placeholders pending Marketing material are marked with
  `TODO(marketing)` (see [docs/marketing-material-request.md](./docs/marketing-material-request.md)).
