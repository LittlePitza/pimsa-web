# PIMSA Web — Design Plan

> Art direction and design system for plasticospimsa.com.
> Companion to [PLAN.md](./PLAN.md) · Status: **Approved direction, pre-build** · Last updated: 2026-07-03
> This document doubles as a design brief and can be handed to any designer as-is.

---

## 1. Design Concept — "Engineered Circularity"

PIMSA is not a generic "green" recycling company — it is an **engineering** company that transforms industrial scrap into certified raw material. The design leans into that tension and owns it:

> **The precision of an engineering datasheet + the story of material transformation.**

Two ideas drive every visual decision:

1. **Technical/editorial aesthetic** — the site looks like a beautifully typeset engineering document: monospace data labels, thin ruled lines, section indices (`01 / SERVICIOS`), annotated imagery, generous whitespace. This is distinctive (almost no industrial SMB in Mexico looks like this), signals seriousness to automotive/white-goods buyers, and is cheap to render (type + lines, not heavy graphics).
2. **The material cycle as narrative** — the home page *tells* the transformation: scrap → collection → grinding → pelletizing → engineered polymer. Scroll is the machine: as the user moves, the material advances through the process. The circle/loop is the signature geometric motif, used with restraint (never clip-art eco leaves).

**Personality**: precise, industrial, confident, quietly sustainable. **Not**: playful, startup-y, eco-cliché, template-corporate.

## 2. Brand Palette (extracted from current identity)

Source of truth: PIMSA logo SVG (navy `#2A476B`, green `#84A33F`) + Elementor global palette of the current site.

### Core tokens

| Token | Hex | Role |
|---|---|---|
| `navy-900` | `#0E1B2E` | Near-black navy — dark section backgrounds, footer |
| `navy-700` | `#1D3552` | Deep surfaces, cards on dark |
| `navy-500` | `#294466` | **Brand primary** (logo navy) — headings, primary buttons |
| `blue-600` | `#064D79` | Deep blue — links, hover states |
| `blue-400` | `#517AAD` | Muted blue — secondary UI, icons, borders on dark |
| `green-600` | `#5F7A2C` | **Accessible green** — green text on light backgrounds (AA-safe) |
| `green-500` | `#7F9D41` | **Brand accent** (logo green) — CTAs on dark, highlights, large graphics |
| `green-300` | `#B0CD75` | Light green — accents on navy, data viz, tags |
| `forest-800` | `#003F2E` | Dark forest — optional deep accent for sustainability blocks |
| `paper` | `#F7F8F5` | Warm off-white — default page background (not pure white) |
| `surface` | `#FFFFFF` | Cards, elevated surfaces |
| `ink` | `#16202C` | Body text (navy-tinted, softer than #000) |
| `ink-muted` | `#5A6878` | Secondary text, captions |
| `line` | `#D8DEE4` | Hairline rules, dividers, technical grid lines |

### Usage rules

- **60/30/10**: paper + surface dominate; navy structures (header, hero, footer, alternating bands); green is scarce — reserved for CTAs, key numbers, and the "material" in illustrations. Scarcity keeps it powerful.
- **Contrast (WCAG AA, non-negotiable)**: `green-500` NEVER as text on white (fails AA) — use `green-600` for light-bg text, `green-300`/`green-500` only on navy. `navy-500`+ on paper for all body text.
- Dark sections use `navy-900` (not pure black) with `paper` text at 90% and `green-300` accents — this is where the brand feels most premium.

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display / headings | **Space Grotesk** (self-hosted, `next/font`) | Technical grotesque with personality; tight tracking on display sizes |
| Body / UI | **Inter** | Neutral, extremely legible, variable font |
| Data / labels | **IBM Plex Mono** | THE signature detail: section indices, stats units, form labels, image annotations — all mono, uppercase, letter-spaced |

- Fluid type scale via `clamp()`: display ~`clamp(2.5rem, 6vw, 5.5rem)`, h2 ~`clamp(1.9rem, 3.5vw, 3rem)`, body `1rem/1.7`.
- Spanish-first typesetting: generous line-height, max ~68ch measure, no hyphenation hacks.
- Mono labels pattern: `01 — RECOLECCIÓN DE SCRAP` · `ISO 9001:2015` · `CAP. 500 TON/MES`. Used as eyebrows above every heading — this alone kills the "default template" look.

## 4. Signature Visual Elements

1. **Technical grid & rules** — hairline `line`-color rules framing sections; a faint 12-col grid visible in hero backgrounds (CSS gradient, zero assets). Feels like drafting paper.
2. **Section indices** — every major section numbered in mono (`02 / PROCESO`), echoing engineering docs and aiding scanability.
3. **Pellet motif** — a dot-matrix/granule pattern (inline SVG, one asset) used as texture in hero corners and dividers; dots in `green-300`/`blue-400` at low opacity. Abstracts the product (pellets) without stock photos.
4. **The loop** — a single continuous circular stroke used in the process diagram and as a background flourish; animates `stroke-dashoffset` on scroll (pure CSS/SVG, respects `prefers-reduced-motion`).
5. **Annotated photography** — real plant/material photos treated editorially: navy duotone or desaturated grade, with mono-type callouts and hairline pointer lines ("HDPE post-industrial", "Molino #3"). Turns ordinary industrial photos into brand assets. Photos as content, never as full-bleed text backdrops.
6. **Oversized data** — key numbers (years operating, tons processed, industries served) set in Space Grotesk at display sizes with mono units; counters animate on first view.

## 5. Motion & Interaction (performance-budgeted)

- **Philosophy**: motion communicates process (material moving through stages), never decoration for its own sake. Total motion JS budget ≤ ~8 kB — CSS scroll-driven animations and `IntersectionObserver`; **no GSAP/Framer on marketing pages**.
- Scroll-reveal: sections fade/rise 12px once (subtle, 300ms, `ease-out`).
- Process timeline (home): sticky-scroll sequence where each stage pins briefly; the loop stroke draws forward as you advance. Degrades to a static vertical timeline without JS / with reduced motion.
- Micro-interactions: buttons with 150ms color/arrow-nudge hover; card lift 2px + shadow; nav underline slides. All GPU-friendly (`transform`/`opacity` only).
- `prefers-reduced-motion: reduce` disables all non-essential motion globally — implemented in tokens, not per-component.

## 6. Layout System

- **Asymmetric editorial grid**: 12-col, max-width 1200–1280px, but content deliberately off-center — heroes split ~7/5, alternating text/media sides per section. Avoids the centered-everything template rhythm.
- **Alternating bands**: paper → navy → paper creates rhythm and makes green accents pop on dark. Home uses 2 navy bands max.
- **Bento stats block**: mixed-size cards (1 large + 4 small) for certifications/stats instead of 4 equal columns.
- Mobile-first: single column, indices and rules retained (they scale beautifully), sticky bottom CTA bar (Cotizar / WhatsApp) on service pages.

## 7. Page Art Direction (Phase 1)

| Page | Direction |
|---|---|
| **Home** | Full-height hero on `navy-900`: technical grid bg, pellet motif corner, display headline ("Ingeniería en reciclaje de plásticos" direction), mono eyebrow with location + ISO, dual CTA (Cotizar → green / Servicios → outline). Then: client-industries strip (mono logos), scroll-driven process loop, services bento, oversized stats band (navy), certifications, FAQ teaser, closing CTA. |
| **Servicios hub** | Index-style list: each service a full-width row with big index number, name, one-liner, arrow — hover expands a photo. Feels like a table of contents, unmistakably non-template. |
| **Service detail ×4** | Consistent template: annotated hero photo, "Especificaciones" block in mono (capacities, materials, presentation), process steps, related services, quote CTA. Datasheet energy. |
| **Nosotros** | Timeline (2008 → today) along a vertical rule with mono year markers; certifications as embossed badge cards; leadership grid with duotone portraits. |
| **Stock** | Built as a **catalog from day one** (filterable cards: material, form, color, availability) even while content is static — Phase 3 only swaps the data source. |
| **Contacto** | Split layout: form left (mono labels, generous fields, UTM capture), right column with map (static image → interactive on click, saves ~200 kB), NAP data, WhatsApp. |
| **FAQ** | Accordion with mono index numbers; `FAQPage` JSON-LD. |
| **404** | Loop motif broken + "Este material se extravió" — small brand moment, link home. |

## 8. Component Inventory (build order)

**Primitives (`components/ui/`)**: Button (primary green-on-dark / navy-on-light, outline, ghost) · Eyebrow (mono label) · SectionHeading (index + title + intro) · Card · Badge/Tag · Accordion · Input/Textarea/Select · Stat.

**Layout**: Header (transparent-over-hero → solid `paper` on scroll, quote CTA always visible) · Footer (navy-900: sitemap, NAP, certifications, social) · WhatsAppFab · ConsentBanner · StickyMobileCta.

**Sections**: Hero · ProcessLoop · ServicesBento · ServiceRow · StatsBand · CertGrid · IndustriesStrip · Timeline · TeamGrid · FaqAccordion · ContactSplit · CtaBand — every section = one self-contained component consuming `src/content/` data → **new landing pages are composition, not design work** (the Marketing scalability promise from PLAN.md §7).

## 9. Design Tokens → Code

Single source of truth in `src/styles/tokens.css` (Tailwind v4 `@theme`): every color above as `--color-*`, fluid type scale, spacing (4px base), radii (`sm` 4px / `md` 8px / `lg` 16px), shadows (2 levels, navy-tinted), motion durations/easings. Components consume **semantic** tokens (`--color-surface`, `--color-accent`) — a future rebrand or dark mode is a token swap, not a refactor.

## 10. Asset & Performance Guardrails

- Hero LCP element is always text or a `priority` optimized image ≤ 180 kB (AVIF).
- Textures/motifs = inline SVG or CSS gradients (bytes, not requests). Duotone via CSS filter, not pre-baked images.
- Fonts: 3 families, variable, `latin` subset, self-hosted via `next/font` — zero CLS.
- Icons: Lucide, tree-shaken, stroke 1.5 to match hairline aesthetic.
- Targets (from PLAN.md): Lighthouse ≥ 95 mobile, < 130 kB JS marketing pages, CLS < 0.05.

## 11. Accessibility

WCAG 2.1 AA: palette pre-validated (see §2 rules) · visible focus rings (`green-300` on dark, `blue-600` on light) · full keyboard nav (accordion, mobile menu) · landmarks + skip-link · alt text as content requirement, enforced by typed content schema.

---

**Next step**: implement §9 tokens + `ui` primitives in the Phase-0 scaffold, then build Home hero + one service page as the visual proof-of-concept before rolling out remaining pages.
