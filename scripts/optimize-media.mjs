/**
 * Promotes curated photographs from the staging library into public/media.
 *
 * The staging library (`media-src/`, git-ignored) holds untouched originals
 * copied from the marketing OneDrive — 2992x2000 frames of 2-3 MB each. This
 * script is the only path from there into the repository, so every published
 * photograph goes through the same three guarantees:
 *
 *   1. `rotate()` bakes the EXIF orientation into the pixels. 13 of the
 *      originals are portrait frames stored landscape with an orientation
 *      tag; stripping metadata without rotating first is exactly how
 *      `corporate/logistica-unidad.jpg` ended up sideways on the About page.
 *   2. The long edge is capped at 2000 px. The widest slot on the site asks
 *      for 45vw, so at 2x DPR on a 1920 viewport nothing needs more than
 *      ~1730 px — beyond that we would be shipping bytes next/image discards.
 *   3. Metadata is dropped (sharp's default), which removes the GPS tags the
 *      camera wrote into every frame.
 *
 * A fourth rule is not enforceable in code and has to hold at selection time:
 * nothing published here may show a recognisable face or a readable licence
 * plate. Employees at work are still people whose image needs their consent,
 * and the library is full of frames that fail this — check every candidate at
 * 100%, including the background, before adding it to the table below.
 *
 * Usage: node scripts/optimize-media.mjs [--check]
 *   --check  report what would change without writing anything
 */
import sharp from "sharp";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "media-src");
const OUT = join(ROOT, "public", "media");

/**
 * `_NIKON/` holds the December 2024 card: 24 MP frames, and the only ones in
 * the whole archive shot with any intent rather than as a record that
 * something exists. Prefer them.
 */

const MAX_EDGE = 2000;
const QUALITY = 82;

/**
 * Published photograph -> staging original.
 *
 * One entry per slot on the site: the whole point of the exercise is that no
 * two sections share a photograph, so a duplicated source path here is a bug.
 */
const MEDIA = [
  // Home · ProcessLoop — the four documented stages
  ["corporate/entrada-scrap.jpg", "collection/scrap-cromado.jpg"],
  ["corporate/molienda-molido.jpg", "grinding/molido-montana.jpg"],
  ["corporate/peletizado-tina.jpg", "pelletizing/tina-hilos.jpg"],
  ["corporate/laboratorio-flama.jpg", "lab/prueba-flama.jpg"],

  // Home · StatsBand + CircularityManifesto
  ["corporate/almacen-pasillo.jpg", "plant/almacen-pasillo.jpg"],
  // The scrap pile that lived here was, two frames apart, the same photograph
  // as services/molienda-molino.jpg. This is the recovered material itself,
  // in someone's hand — the whole argument of the section in one frame.
  ["corporate/pellet-mano.jpg", "_NIKON/DSC_0172.JPG"],

  // Nosotros · PlantShowcase (entrada -> transformación -> verificación -> salida)
  ["corporate/patio-recepcion.jpg", "plant/patio-sacos.jpg"],
  ["corporate/peletizado-extrusor.jpg", "pelletizing/linea-peletizado.jpg"],
  // A benchtop scale on a cluttered desk was standing in for "verificación".
  // This is product being checked by hand as it comes off the screen.
  ["corporate/inspeccion-pellet.jpg", "_NIKON/DSC_0166.JPG"],
  ["corporate/producto-terminado.jpg", "logistics/producto-terminado.jpg"],

  // Nosotros · StatsBand (distinta a la de Home a propósito)
  ["corporate/almacen-nave.jpg", "plant/almacen-nave.jpg"],

  // Vacantes · JobsHero, WorkAtPimsa, WorkLocation
  // The mill-hall frame would suit this better but the library only holds it
  // as a 589x332 web export. This is the Vegil warehouse — no other published
  // photograph comes from that plant, so it does not echo anything.
  ["corporate/nave-produccion.jpg", "plant/almacen-vegil.jpg"],
  ["corporate/operador-molino.jpg", "grinding/molino-alimentacion-2.jpg"],
  // The three head-on façade frames in the library are 1280x960 web exports;
  // this is the only full-resolution exterior, and the approach from the road
  // is the view a candidate actually arrives to.
  ["corporate/fachada-planta.jpg", "plant/perimetro-reja.jpg"],

  // Servicios · relevos de las dos fotos que mostraban rostros
  ["services/recoleccion-gaylords.jpg", "plant/patio-gaylords.jpg"],
  ["services/molienda-criba.jpg", "pelletizing/pellet-criba.jpg"],
];

/**
 * Already-published files that only need re-encoding — they came from the
 * same originals but were committed at full camera size.
 */
const RECOMPRESS = ["corporate/peletizado-linea.jpg", "hero-polimero.jpg"];

const check = process.argv.includes("--check");
const kb = (n) => `${Math.round(n / 1024)} KB`;

async function encode(input, outputPath) {
  const before = Buffer.isBuffer(input) ? input.length : (await stat(input)).size;
  const buf = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  const { width, height } = await sharp(buf).metadata();
  if (!check) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, buf);
  }
  return { before, after: buf.length, width, height };
}

let totalBefore = 0;
let totalAfter = 0;

for (const [dest, src] of MEDIA) {
  const { before, after, width, height } = await encode(join(SRC, src), join(OUT, dest));
  totalBefore += before;
  totalAfter += after;
  console.log(
    `${dest.padEnd(34)} ${String(width).padStart(4)}x${height}  ${kb(before)} -> ${kb(after)}`,
  );
}

for (const rel of RECOMPRESS) {
  const path = join(OUT, rel);
  // Read into memory first: sharp streams its input lazily, so encoding
  // straight back over the same path races the write.
  const { before, after, width, height } = await encode(await readFile(path), path);
  totalBefore += before;
  totalAfter += after;
  console.log(
    `${rel.padEnd(34)} ${String(width).padStart(4)}x${height}  ${kb(before)} -> ${kb(after)}`,
  );
}

console.log(
  `\n${MEDIA.length + RECOMPRESS.length} files · ${kb(totalBefore)} -> ${kb(totalAfter)} ` +
    `(-${Math.round((1 - totalAfter / totalBefore) * 100)}%)${check ? "  [--check: dry run]" : ""}`,
);
