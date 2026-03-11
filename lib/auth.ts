import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "unara_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function getAuthConfig() {
  const username = process.env.AUTH_USERNAME?.trim() ?? "";
  const password = process.env.AUTH_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? password;

  return {
    username,
    password,
    secret,
  };
}

export function isAuthEnabled() {
  const config = getAuthConfig();
  return config.username.length > 0 && config.password.length > 0;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signSessionPayload(username: string, expiresAt: number) {
  const { secret } = getAuthConfig();

  return createHmac("sha256", secret)
    .update(`${username}:${expiresAt}`)
    .digest("base64url");
}

function buildSessionToken(username: string, expiresAt: number) {
  const encodedUsername = Buffer.from(username, "utf8").toString("base64url");
  const signature = signSessionPayload(username, expiresAt);

  return `${encodedUsername}.${expiresAt}.${signature}`;
}

function parseSessionToken(token: string) {
  const [encodedUsername, expiresAtRaw, signature] = token.split(".");

  if (!encodedUsername || !expiresAtRaw || !signature) {
    return null;
  }

  const username = Buffer.from(encodedUsername, "base64url").toString("utf8");
  const expiresAt = Number.parseInt(expiresAtRaw, 10);

  if (!Number.isFinite(expiresAt)) {
    return null;
  }

  return {
    username,
    expiresAt,
    signature,
  };
}

export function authenticateUser(username: string, password: string) {
  const config = getAuthConfig();

  if (!isAuthEnabled()) {
    return true;
  }

  return safeEqual(username, config.username) && safeEqual(password, config.password);
}

export function createSessionCookieValue(username: string) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  return {
    value: buildSessionToken(username, expiresAt),
    expiresAt,
  };
}

export function verifySessionToken(token: string | undefined | null) {
  if (!isAuthEnabled()) {
    return true;
  }

  if (!token) {
    return false;
  }

  const parsed = parseSessionToken(token);
  if (!parsed) {
    return false;
  }

  if (parsed.expiresAt <= Date.now()) {
    return false;
  }

  const { username } = getAuthConfig();
  const expectedSignature = signSessionPayload(parsed.username, parsed.expiresAt);

  return safeEqual(parsed.username, username) && safeEqual(parsed.signature, expectedSignature);
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
