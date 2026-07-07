import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * MySQL connection pool (Hostinger database in production, local MariaDB in
 * development). Kept on globalThis so Next.js dev HMR reuses one pool.
 */

const globalForDb = globalThis as unknown as { pimsaPool?: mysql.Pool };

function createPool(): mysql.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set (see .env.example)");
  }
  return mysql.createPool({
    uri: url,
    connectionLimit: 5,
    maxIdle: 5,
    enableKeepAlive: true,
  });
}

const pool = globalForDb.pimsaPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.pimsaPool = pool;

export const db = drizzle(pool, { schema, mode: "default" });
