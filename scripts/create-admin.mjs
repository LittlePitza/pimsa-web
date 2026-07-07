/**
 * Creates (or updates the password of) an admin panel user.
 * Usage: node scripts/create-admin.mjs <email> <password> [name]
 * Requires DATABASE_URL. Run migrations first.
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

config({ path: ".env.local" });
config();

const [email, password, name = "Administrador"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [name]");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (see .env.example)");
  process.exit(1);
}

const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });
const passwordHash = await bcrypt.hash(password, 12);

await connection.execute(
  `INSERT INTO admin_users (email, name, password_hash)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)`,
  [email.toLowerCase(), name, passwordHash],
);

console.log(`Admin user ready: ${email.toLowerCase()}`);
await connection.end();
