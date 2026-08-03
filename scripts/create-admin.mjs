/**
 * Creates (or updates the password of) an admin panel user.
 * Usage: node scripts/create-admin.mjs <email> [name] [role]
 *   role: admin (whole panel, default) | marketing | rrhh
 * The password is read from the ADMIN_PASSWORD env var or prompted
 * interactively (hidden input) — never passed as an argv, so it doesn't
 * land in the shell history or the process list.
 * Requires DATABASE_URL. Run migrations first.
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

config({ path: ".env.local" });
config();

const ROLES = ["admin", "marketing", "rrhh"];
const [email, name = "Administrador", role = "admin"] = process.argv.slice(2);

if (!email) {
  console.error("Usage: node scripts/create-admin.mjs <email> [name] [role]");
  console.error(`Roles: ${ROLES.join(" | ")} (default: admin)`);
  console.error("Password: set ADMIN_PASSWORD or type it at the hidden prompt.");
  process.exit(1);
}
if (!ROLES.includes(role)) {
  console.error(`Invalid role "${role}". Use one of: ${ROLES.join(", ")}`);
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (see .env.example)");
  process.exit(1);
}

const ENTER = ["\r", "\n"];
const CTRL_C = String.fromCharCode(3);
const BACKSPACE = [String.fromCharCode(127), String.fromCharCode(8)];

/** Hidden-input prompt (no echo). */
function promptHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const { stdin } = process;
    stdin.resume();
    stdin.setRawMode?.(true);
    let value = "";
    const onData = (char) => {
      const c = String(char);
      if (ENTER.includes(c)) {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (c === CTRL_C) {
        process.stdout.write("\n");
        process.exit(130);
      } else if (BACKSPACE.includes(c)) {
        value = value.slice(0, -1);
      } else {
        value += c;
      }
    };
    stdin.on("data", onData);
  });
}

const password = process.env.ADMIN_PASSWORD || (await promptHidden("Contraseña (oculta): "));

if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });
const passwordHash = await bcrypt.hash(password, 12);

await connection.execute(
  `INSERT INTO admin_users (email, name, password_hash, role)
   VALUES (?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role)`,
  [email.toLowerCase(), name, passwordHash, role],
);

console.log(`Admin user ready: ${email.toLowerCase()} (${role})`);
await connection.end();
