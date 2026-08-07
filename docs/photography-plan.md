# Plan de fotografía del sitio — auditoría de la librería de Marketing

> Revisión de `Marketing - FOTOGRAFIAS Y VIDEOS PIMSA` (OneDrive corporativo),
> selección de material publicable y plan para eliminar la repetición de fotos
> entre páginas.
> Fecha: 2026-08-06 · Contacto: sistemas@plasticospimsa.com
> Complementa [marketing-material-request.md](marketing-material-request.md).

---

## 1. Diagnóstico: por qué "en todas las páginas tenemos las mismas"

Porque literalmente es así. Hoy el sitio tiene **6 fotos de ambiente** para
cubrir 3 páginas y 8 secciones, y varias se repiten 3 o 4 veces:

| Foto | Veces | Dónde aparece hoy |
| --- | --- | --- |
| `corporate/peletizado-linea.jpg` | **4** | Home (hero) · Home (proceso, "Peletizado") · Nosotros (Fig. 02) · Vacantes (Trabaja en PIMSA) |
| `corporate/planta-la-estancia.jpg` | **4** | Home (stats) · Nosotros (stats) · Vacantes (hero) · Vacantes (ubicación) · + JSON-LD |
| `corporate/scrap-industrial.jpg` | **3** | Home (proceso, "Materia de entrada") · Home (manifiesto circular) · Nosotros (Fig. 01) |
| `corporate/laboratorio-calidad.jpg` | **2** | Home (proceso, "Laboratorio") · Nosotros (Fig. 03) |
| `services/molienda-alimentacion.jpg` | **2** | Home (proceso, "Reducción de tamaño") · Servicio molienda (galería) |
| `corporate/logistica-unidad.jpg` | 1 | Nosotros (Fig. 04) |

El caso más visible es la **Home**: `ProcessLoop` usa 4 imágenes, y 3 de ellas
vuelven a salir en la misma página en `StatsBand` y `CircularityManifesto`.

### Dos defectos que encontré de paso

1. **`corporate/logistica-unidad.jpg` está girada 90°.** El camión sale
   acostado en la página Nosotros (Fig. 04 — "Logística de entrega"). El
   archivo no trae etiqueta EXIF de orientación, así que ningún navegador la
   corrige. Además tiene **placas legibles** (SW-2751-C / SU-0536-B), justo lo
   que advierte `public/media/README.md`.
2. **Peso de los archivos.** Las 5 fotos de `corporate/` pesan entre 2.3 y
   3.2 MB cada una (2992×2000 sin optimizar). Next las reescala en build, pero
   el repositorio carga ~12 MB innecesarios y cada `git clone` los arrastra.

---

## 2. Qué hay en la librería de Marketing

**2 622 archivos** (2 324 JPG, 196 PNG, 106 JPEG, 121 videos). Revisé carpeta
por carpeta con hojas de contacto. El resumen honesto:

### Sirve, y es mucho mejor de lo que está publicado

| Carpeta | Archivos | Qué tiene |
| --- | --- | --- |
| `PLANTA LA ESTANCIA` (raíz) | 117 | **La mina de oro.** Fachada, patio, almacén, molienda, peletizado, envasado, camiones, gente trabajando. Sesión profesional con réflex, 2992×2000. |
| `PLANTA LA ESTANCIA/PELETIZADORA` | 32 | Línea de peletizado completa: extrusor, tina de enfriamiento, dado de hilos, corte. |
| `PLANTA LA ESTANCIA/LABORATORIO` | 22 | Mufla, balanza analítica, plastómetro de índice de fluidez, máquina universal de tensión, técnicos operando. |
| `PLANTA VEGIL` | 62 | Almacén, patio de contenedores, montacargas y —clave— **separación e inspección manual de piezas**. |
| `CONTENEDORES COLAPSABLES` | 35 | Producto en todos sus ángulos: negro y gris, abierto y colapsado, más patios de estiba. |
| `FOTOGRAFIAS DE PLASTICOS/PLASTA-PURGA` | 25 | Purgas fotografiadas **en estudio** sobre fondo negro y blanco. Rojo, blanco, negro, crema. Calidad de catálogo. |
| `SERVICIOS/RECOLECCION DE SCRAP` | 4 | Contenedores con scrap cromado y micas rojas. Muy buen color. |
| `AREA LOGISTICA` | 7 | Choferes posando frente a cada unidad de la flota. |

### No sirve para el sitio

| Carpeta | Por qué |
| --- | --- |
| `PLANTA LA ESTANCIA/LA ESTANCIA - ALREDEDORES` (55) | Levantamiento del terreno perimetral: lotes baldíos, tierra, maleza. Es documentación de propiedad, no fotografía comercial. |
| `PLANTA LA ESTANCIA/FOTOS PARA PROYECTO DE REMODELACIÓN` (61) | Interiores de oficina subexpuestos, tomados para un proyecto de obra. Gente en su escritorio sin preparación. |
| `PLANTA VEGIL/Planta Vegil/Vegil marilu` (34) | Fotos de celular: interiores de contenedores, bodegas, oficinas. Documentación interna. |
| `FOTOGRAFIAS DE PLASTICOS` (resto, ~1 900) | Catálogo por SKU (`2ABSSCMDOMCSCR`, etc.). Sirve para Mercado Libre y fichas de producto, **no** para páginas institucionales. Vale la pena minarlo aparte si se amplía el catálogo de stock. |
| `EXPO`, `VIDEOS FORMATO HISTORIAS`, `SERVICIOS/MAQUILA *` | Casi todo video (algunos de 264 MB). Material para redes; para el sitio requeriría edición y compresión. |

### Faltantes reales

- **No hay retratos ni fotos de equipo preparadas.** Lo más cercano son
  operadores de espaldas o con cubrebocas (fotos de época COVID).
- **No hay fotos de oficina presentables** — las únicas son las del proyecto de
  remodelación.
- **No hay tomas verticales** pensadas para móvil; casi todo es 3:2 horizontal.

---

## 3. Selección: 77 fotos separadas y listas

Están copiadas en **`media-src/`** (fuera de Git, con `SELECCION.csv` que mapea
cada archivo a su original en OneDrive):

| Carpeta | Fotos | Para qué |
| --- | --- | --- |
| `plant/` | 13 | Fachada, perímetro, naves de almacén, patio con super sacos |
| `pelletizing/` | 12 | Extrusor, hilos, criba, descarga de pellet, envasado |
| `grinding/` | 10 | Alimentación de molino, molido a granel, nave de molinos |
| `containers/` | 8 | Producto en todos sus ángulos + patios de estiba |
| `lab/` | 8 | Balanza, índice de fluidez, tensión, mufla, **prueba de flama** |
| `logistics/` | 7 | Camiones PIMSA, montacargas con operador, producto terminado |
| `materials/` | 7 | Purgas de estudio (rojo, blanco, negro, crema) |
| `collection/` | 4 | Scrap cromado y micas rojas en contenedor |
| `sorting/` | 4 | Separación e inspección manual — **servicio que hoy no tiene ni una foto** |
| `team/` | 4 | Gente trabajando con uniforme y casco |

Tres hallazgos que valen por sí solos:

- **`lab/prueba-flama.jpg`** — la prueba de flama para identificar
  resina. Es la foto más distintiva de toda la librería y nadie la ha usado.
- **`sorting/*`** — cubre el hueco del servicio de separación e inspección.
- **`plant/almacen-pasillo.jpg`** — pasillo completo de gaylords estibados.
  Es la mejor prueba visual de capacidad que existe, y vale más que cualquier
  cifra en la sección de stats.

**Advertencia sobre `plant/fachada-cielo.png`**: es preciosa pero es un export
web de 1076×960 con el logotipo degradado (el texto del rótulo salió ilegible,
parece re-escalada). Úsese solo en tarjeta pequeña (≤1000 px) o pídase el
original a Marketing.

---

## 4. Plan de implementación

### Fase 0 — Correcciones (antes que nada, ~30 min)

1. Reemplazar `corporate/logistica-unidad.jpg` por `logistics/camion-frontal.jpg`
   (`DSC_1761`), que sale derecha y no tiene placa al frente.
2. Optimizar las 5 fotos de `corporate/` a 2000 px de ancho y JPEG q80. Bajan
   de ~12 MB a ~1.5 MB en total.
3. Revisar placas y rostros en todo lo que se publique, como pide
   `public/media/README.md`.

### Fase 1 — Romper la repetición (el objetivo del encargo)

Una foto, un lugar. Asignación propuesta:

| Sección | Página | Hoy | Propuesta |
| --- | --- | --- | --- |
| `Hero` | Home | `peletizado-linea` | `pelletizing/pellet-descarga-2.jpg` |
| `ProcessLoop` — entrada | Home | `scrap-industrial` | `collection/scrap-cromado.jpg` |
| `ProcessLoop` — molienda | Home | `molienda-alimentacion` | `grinding/molido-montana.jpg` |
| `ProcessLoop` — peletizado | Home | `peletizado-linea` | `pelletizing/extrusor-hilos.jpg` |
| `ProcessLoop` — laboratorio | Home | `laboratorio-calidad` | `lab/prueba-flama.jpg` |
| `StatsBand` | Home | `planta-la-estancia` | `plant/almacen-pasillo.jpg` |
| `CircularityManifesto` | Home | `scrap-industrial` | `materials/purga-negra.jpg` |
| `PlantShowcase` Fig. 01 | Nosotros | `scrap-industrial` | `plant/patio-sacos.jpg` |
| `PlantShowcase` Fig. 02 | Nosotros | `peletizado-linea` | `pelletizing/linea-peletizado.jpg` |
| `PlantShowcase` Fig. 03 | Nosotros | `laboratorio-calidad` | `lab/tecnico-mufla.jpg` |
| `PlantShowcase` Fig. 04 | Nosotros | `logistica-unidad` (girada) | `logistics/camion-frontal.jpg` |
| `StatsBand` | Nosotros | `planta-la-estancia` | `plant/almacen-nave.jpg` |
| `JobsHero` | Vacantes | `planta-la-estancia` | `team/equipo-tambores.jpg` |
| `WorkAtPimsa` | Vacantes | `peletizado-linea` | `team/equipo-envasado.jpg` |
| `WorkLocation` | Vacantes | `planta-la-estancia` | `plant/fachada-lateral.jpg` |

Resultado: **15 slots, 15 fotos distintas.** Cero repeticiones entre páginas.

`StatsBand` aparece en dos páginas con la misma foto porque el componente la
tiene hardcodeada. Hay que subir la imagen a prop (`<StatsBand image={...} />`)
para poder darle una distinta a cada página — es el único cambio estructural de
esta fase.

### Fase 2 — Servicios

- **Separación e inspección**: hoy no existe como página con fotos. Con
  `sorting/*` ya hay galería completa.
- **Molienda**: sustituir la galería por `grinding/nave-molinos.jpg` +
  `grinding/molino-alimentacion.jpg` + `grinding/molido-pala.jpg`.
- **Recolección**: `collection/scrap-cromado*.jpg` tienen mucho más color que
  las actuales; `logistics/camion-caja.jpg` para el encabezado.
- **Contenedores**: la galería actual es correcta, pero `containers/contenedores-estiba.jpg`
  y `contenedores-patio.jpg` comunican inventario mucho mejor.

### Fase 3 — Encargo a Marketing

Lo que la librería no puede dar y hay que producir:

1. **Retratos de equipo** — operadores, laboratorio, oficina. Sin cubrebocas,
   con consentimiento firmado para uso web.
2. **Oficinas presentables** — el sitio no tiene ni una foto del área
   administrativa que se pueda publicar.
3. **Verticales para móvil** — 4:5 o 9:16 de las escenas clave.
4. **Fachada en alta resolución** — la buena (`PLANTA-LA-ESTANCIA.png`) está
   re-escalada y con el logo degradado.

### Convención técnica al publicar

- Destino `public/media/<categoría>/<nombre>.jpg`, 2000 px de ancho máximo,
  JPEG q80. Objetivo: ≤ 350 KB por archivo.
- Nombres en minúsculas con guiones, en español, descriptivos del contenido y
  no del número de disparo.
- Registrar en `public/media/README.md` el origen de cada foto nueva.
- Los originales se quedan en `media-src/` (ignorado por Git) y en OneDrive sin
  modificar.
