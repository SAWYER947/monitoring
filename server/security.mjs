import { createCipheriv, createDecipheriv, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "bluehaven.sid";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const SCRYPT_OPTIONS = { N: 32_768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const activeSessions = new Map();

function pruneExpiredSessions(now = Date.now()) {
  for (const [id, session] of activeSessions) {
    if (session.expiresAt <= now) activeSessions.delete(id);
  }
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const digest = await scrypt(password, salt, 64, SCRYPT_OPTIONS);
  return `scrypt$32768$8$1$${salt.toString("base64url")}$${Buffer.from(digest).toString("base64url")}`;
}

export async function verifyPassword(password, encoded) {
  const [algorithm, n, r, p, saltText, digestText] = String(encoded).split("$");
  if (algorithm !== "scrypt" || n !== "32768" || r !== "8" || p !== "1" || !saltText || !digestText) return false;
  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(digestText, "base64url");
    if (salt.length !== 16 || expected.length !== 64) return false;
    const actual = Buffer.from(await scrypt(password, salt, expected.length, SCRYPT_OPTIONS));
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function issueSession(username, key) {
  pruneExpiredSessions();
  const session = {
    id: randomBytes(32).toString("base64url"),
    username,
    csrfToken: randomBytes(24).toString("base64url"),
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  activeSessions.set(session.id, session);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const value = Buffer.concat([iv, tag, ciphertext]).toString("base64url");
  return { session, cookie: serializeCookie(value, SESSION_MAX_AGE_SECONDS) };
}

export function readSession(request, key) {
  const value = getCookie(request.headers.cookie, SESSION_COOKIE);
  if (!value) return null;
  try {
    const decoded = Buffer.from(value, "base64url");
    if (decoded.length < 29) return null;
    const iv = decoded.subarray(0, 12);
    const tag = decoded.subarray(12, 28);
    const ciphertext = decoded.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    const session = JSON.parse(plaintext);
    pruneExpiredSessions();
    const active = activeSessions.get(session.id);
    if (typeof session.username !== "string" || typeof session.csrfToken !== "string" || session.expiresAt < Date.now() || !active) return null;
    return session;
  } catch {
    return null;
  }
}

export function revokeSession(request, key) {
  const session = readSession(request, key);
  if (session?.id) activeSessions.delete(session.id);
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isSecureDeployment() ? "; Secure" : ""}`;
}

function serializeCookie(value, maxAge) {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${isSecureDeployment() ? "; Secure" : ""}`;
}

function isSecureDeployment() {
  return process.env.NODE_ENV === "production";
}

function getCookie(header, name) {
  if (!header) return "";
  for (const part of header.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=");
  }
  return "";
}

