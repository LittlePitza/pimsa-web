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

"Another name" includes **another frame of the same scene**: `scrap-recuperado`
lasted exactly one commit because it was, two shots apart, the same photograph
as `services/molienda-molino`. Compare by opening both, never by filename.

The second rule is harder to check and matters more: **the photograph has to be
a photograph.** Much of the archive is record-keeping — someone raised a camera
to establish that a thing exists. That serves an inventory, not a page. A
benchtop scale on a cluttered desk shipped here as "control de calidad" and had
to be pulled. If a frame does not decide where to stand and what to show, leave
the slot on the old image until the good one exists; the shot list is in
[docs/guion-fotografia-video.md](../../docs/guion-fotografia-video.md).

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
| `pellet-mano.jpg` | Home · CircularityManifesto |
| `patio-recepcion.jpg` | Nosotros · PlantShowcase Fig. 01 |
| `peletizado-extrusor.jpg` | Nosotros · PlantShowcase Fig. 02 |
| `inspeccion-pellet.jpg` | Nosotros · PlantShowcase Fig. 03 |
| `producto-terminado.jpg` | Nosotros · PlantShowcase Fig. 04 |
| `almacen-nave.jpg` | Nosotros · StatsBand (fondo) |
| `nave-produccion.jpg` | Vacantes · JobsHero (fondo) |
| `operador-molino.jpg` | Vacantes · WorkAtPimsa |
| `fachada-planta.jpg` | Vacantes · WorkLocation + JSON-LD LocalBusiness |

## services/

Service-page photography and the studio resin close-ups, referenced by path
from `src/content/services.ts`. Still at their original 1600 px — they predate
the pipeline and are already within budget.

## Antes de publicar una foto nueva

Keep the OneDrive originals unchanged, and check the frame at 100 % — incluido
el fondo — para:

- **Rostros identificables.** Ninguna foto publicada aquí muestra una cara
  reconocible. La regla es que un empleado en su puesto sigue siendo una
  persona cuya imagen requiere su consentimiento, y la librería está llena de
  tomas que no lo cumplen. Sí se aceptan personas **de espaldas, a contraluz o
  a distancia sin rasgos resolubles**: `almacen-pasillo.jpg` y
  `producto-terminado.jpg` tienen figuras al fondo de espaldas, y
  `operador-molino.jpg` muestra a un operador visto por detrás.
  Para publicar retratos hace falta la carta de consentimiento de uso de
  imagen firmada — ver el bloque A de
  [guion-fotografia-video.md](../../docs/guion-fotografia-video.md).
- **Placas de vehículos** y rótulos de clientes. Toda la serie de camiones de
  la librería tiene la placa legible; por eso el sitio no publica ninguna hoy.
- **Orientación.** Si `sharp(f).metadata()` reporta `orientation` distinto de
  1, el archivo es una foto vertical guardada como horizontal. El script lo
  resuelve; copiarla a mano no.
- **Resolución real.** Varios archivos de la librería son exports web
  disfrazados de original (`pele3.jpg` mide 589x332). Verificar antes de
  asignar un slot.
