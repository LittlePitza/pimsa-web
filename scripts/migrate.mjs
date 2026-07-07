/**
 * Applies pending Drizzle migrations from ./drizzle.
 * Usage: npm run db:migrate  (requires DATABASE_URL)
 * On Hostinger, run once after each deploy that includes new migrations.
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";

config({ path: ".env.local" });
config();
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (see .env.example)");
  process.exit(1);
}

const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });
const db = drizzle(connection);

console.log("Applying migrations…");
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied ✔");

await connection.end();
