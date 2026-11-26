// Server-only. The /admin login: one password (ADMIN_PASSWORD), remembered in a signed, httpOnly cookie.
// The cookie holds an expiry time and an HMAC of it keyed on the password, so changing ADMIN_PASSWORD logs everyone out.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "arbor_admin";
export const ADMIN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days, in seconds

const sha256 = (s: string) => createHash("sha256").update(s).digest();

function signingKey() {
  const password = process.env.ADMIN_PASSWORD;
  return password ? sha256(`arbor-admin-session:${password}`) : null;
}

const signature = (key: Buffer, expires: string) => createHmac("sha256", key).update(expires).digest("base64url");

/** True when ADMIN_PASSWORD is set. Without it nobody can log in. */
export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordMatches(given: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compare fixed-length hashes so the check takes the same time whatever was typed.
  return timingSafeEqual(sha256(given), sha256(password));
}

/** Cookie value for a session that ends at `expiresMs`. */
export function sessionValue(expiresMs: number) {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const expires = String(Math.floor(expiresMs));
  return `${expires}.${signature(key, expires)}`;
}

export function validSession(value: string | undefined) {
  const key = signingKey();
  if (!key || !value) return false;
  const [expires, sig] = value.split(".");
  if (!expires || !sig || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  const expected = Buffer.from(signature(key, expires));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Is the person viewing this page logged in to /admin? */
export async function isAdmin() {
  return validSession((await cookies()).get(ADMIN_COOKIE)?.value);
}
