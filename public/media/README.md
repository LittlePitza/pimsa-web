# Media assets

Every photograph here is produced by `scripts/optimize-media.mjs` from the
curated staging library in `media-src/` (git-ignored). **Do not drop camera
files straight into this folder** — the script is what caps the long edge at
2000 px, bakes EXIF orientation into the pixels and strips the GPS tags.

```bash
node scripts/optimize-media.mjs --check   # ver qué cambiaría
node scripts/optimize-media.mjs           # escribir
```

The rule the layout depends on: **one photograph, one slot.** Before adding an
entry, check it is not already published under another name — the site
previously reused five frames across fifteen slots and read as one page
repeated. See [docs/fotografia-plan.md](../../docs/fotografia-plan.md).

## Hero

- `hero-polimero.jpg` — square inset inside the home hero.
- `corporate/peletizado-linea.jpg` — main hero frame (pellet leaving the
  cyclone). Stored 1337x2000; it is a portrait photograph, despite the older
  code comments that described it as 3:2 landscape.

## corporate/

Institutional and process photography, selected from the internal library
`Marketing - FOTOGRAFIAS Y VIDEOS PIMSA`. One file per section:

| Archivo | Dónde se usa |
| --- | --- |
| `entrada-scrap.jpg` | Home · ProcessLoop 01 — materia de entrada |
| `molienda-molido.jpg` | Home · ProcessLoop 02 — reducción de tamaño |
| `peletizado-tina.jpg` | Home · ProcessLoop 03 — peletizado |
| `laboratorio-flama.jpg` | Home · ProcessLoop 04 — laboratorio |
| `almacen-pasillo.jpg` | Home · StatsBand (fondo bajo overlay 88 %) |
| `valorizacion-scrap.jpg` | Home · CircularityManifesto |
| `patio-recepcion.jpg` | Nosotros · PlantShowcase Fig. 01 |
| `peletizado-extrusor.jpg` | Nosotros · PlantShowcase Fig. 02 |
| `laboratorio-tecnico.jpg` | Nosotros · PlantShowcase Fig. 03 |
| `camion-entrega.jpg` | Nosotros · PlantShowcase Fig. 04 |
| `almacen-nave.jpg` | Nosotros · StatsBand (fondo) |
| `equipo-planta.jpg` | Vacantes · JobsHero (fondo) |
| `equipo-envasado.jpg` | Vacantes · WorkAtPimsa |
| `fachada-planta.jpg` | Vacantes · WorkLocation + JSON-LD LocalBusiness |

## servicios/

Service-page photography and the studio resin close-ups, referenced by path
from `src/content/services.ts`. Still at their original 1600 px — they predate
the pipeline and are already within budget.

## Antes de publicar una foto nueva

Keep the OneDrive originals unchanged, and check the frame for:

- **Placas de vehículos** y rótulos de clientes.
- **Rostros identificables.** `laboratorio-tecnico.jpg`, `equipo-envasado.jpg`
  y `valorizacion-scrap.jpg` muestran personal de PIMSA en su puesto; se
  publican como fotografía corporativa de la propia empresa. Confirmar con
  RRHH que existe consentimiento de imagen antes de sumar más retratos.
- **Orientación.** Si `sharp(f).metadata()` reporta `orientation` distinto de
  1, el archivo es una foto vertical guardada como horizontal. El script lo
  resuelve; copiarla a mano no.
