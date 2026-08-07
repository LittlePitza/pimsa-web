import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/**
 * Symmetric encryption for the one secret the panel is allowed to store: the
 * SMTP password.
 *
 * Letting an admin change the sending mailbox without a redeploy means that
 * password has to live in the database, and a plaintext column would hand it
 * to anyone who ever reads a backup or a `mysqldump`. AES-256-GCM with a key
 * derived from AUTH_SECRET keeps the ciphertext useless on its own: an
 * attacker needs both the database and the server's environment.
 *
 * That coupling is the deliberate trade-off — rotating AUTH_SECRET makes the
 * stored password unreadable. `decryptSecret` returns null rather than
 * throwing in that case, so the panel falls back to the environment SMTP
 * variables and reports the password as "no configurada" instead of taking
 * the site's email down.
 */

const ALGORITHM = "aes-256-gcm";
/** Prefix + version, so a future key-derivation change stays distinguishable. */
const PREFIX = "v1";
const IV_BYTES = 12;
const SALT = "pimsa-smtp-secret";

function encryptionKey(): Buffer | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return scryptSync(secret, SALT, 32);
}

/** True when the server can store secrets at all (AUTH_SECRET is present). */
export function canStoreSecrets(): boolean {
  return Boolean(process.env.AUTH_SECRET);
}

/** Throws when AUTH_SECRET is missing — the caller is an admin form. */
export function encryptSecret(plain: string): string {
  const key = encryptionKey();
  if (!key) {
    throw new Error("AUTH_SECRET no está configurado en el servidor.");
  }

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);

  return [
    PREFIX,
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

/** Null for anything that doesn't decrypt cleanly — see the module note. */
export function decryptSecret(value: string): string | null {
  const key = encryptionKey();
  if (!key) return null;

  const [prefix, ivPart, tagPart, dataPart] = value.split(".");
  if (prefix !== PREFIX || !ivPart || !tagPart || !dataPart) return null;

  try {
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivPart, "base64"));
    decipher.setAuthTag(Buffer.from(tagPart, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataPart, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    // Wrong key or tampered ciphertext. Both mean "we don't have a password".
    return null;
  }
}
