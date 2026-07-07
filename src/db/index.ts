import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * MySQL connection pool (Hostinger database in production, local MariaDB in
 * development). The pool is created lazily on the first query, so importing
 * this module never throws — `next build` (and CI) works without
 * DATABASE_URL, and DB-backed pages simply catch the error and render empty.
 * Kept on globalThis so Next.js dev HMR reuses one pool.
 */

type Database = MySql2Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  pimsaPool?: mysql.Pool;
  pimsaDb?: Database;
};

function initDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set (see .env.example)");
  }
  const pool =
    globalForDb.pimsaPool ??
    mysql.createPool({ uri: url, connectionLimit: 5, maxIdle: 5, enableKeepAlive: true });
  if (process.env.NODE_ENV !== "production") globalForDb.pimsaPool = pool;
  return drizzle(pool, { schema, mode: "default" });
}

function getDb(): Database {
  return (globalForDb.pimsaDb ??= initDb());
}

/**
 * Lazy proxy: the connection is established only on first property access
 * (the first query), inside the caller's try/catch. Keeps module import
 * side-effect free.
 */
export const db = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop, receiver) as unknown;
    return typeof value === "function" ? value.bind(real) : value;
  },
});
