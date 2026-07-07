/**
 * Seeds the initial stock catalog. Idempotent: skips when the table already
 * has rows (safe to run once per environment).
 * Usage: node scripts/seed-stock.mjs
 */
import { config } from "dotenv";
import mysql from "mysql2/promise";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (see .env.example)");
  process.exit(1);
}

const items = [
  ["ABS", "Molido", "Natural", "Consultar", ""],
  ["ABS", "Pellet", "Negro", "Consultar", ""],
  ["PC (Policarbonato)", "Molido", "Cristal", "Consultar", ""],
  ["PC/ABS", "Pellet", "Gris", "Consultar", ""],
  ["PA6 (Nylon 6)", "Molido", "Negro", "Consultar", "Disponible con y sin fibra de vidrio"],
  ["PP (Polipropileno)", "Pellet", "Varios", "Consultar", ""],
  ["HDPE (Polietileno AD)", "Molido", "Varios", "Consultar", ""],
  ["HIPS", "Molido", "Blanco", "Consultar", ""],
];

const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });

const [[{ total }]] = await connection.query("SELECT COUNT(*) AS total FROM stock_items");
if (total > 0) {
  console.log(`stock_items already has ${total} rows — skipping seed.`);
} else {
  await connection.query(
    "INSERT INTO stock_items (material, form, color, availability, notes) VALUES ?",
    [items],
  );
  console.log(`Seeded ${items.length} stock items ✔`);
}

await connection.end();
