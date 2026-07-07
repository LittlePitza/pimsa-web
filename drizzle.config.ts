import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config();

/**
 * Drizzle Kit config — generates SQL migrations into ./drizzle from the
 * schema. Apply with `npm run db:migrate` (see scripts/migrate.mjs).
 */
export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
