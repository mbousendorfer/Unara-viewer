import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE_PATTERN = /\.[^/]+$/;
const SESSION_COOKIE_NAME = "unara_session";

function isAuthEnabled() {
  return Boolean(process.env.AUTH_USERNAME?.trim() && process.env.AUTH_PASSWORD);
}

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/apple-icon") ||
    PUBLIC_FILE_PATTERN.test(pathname)
  );
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = atob(`${normalized}${padding}`);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

async function verifySessionToken(token: string | undefined) {
  if (!isAuthEnabled()) {
    return true;
  }

  if (!token) {
    return false;
  }

  const [encodedUsername, expiresAtRaw, signature] = token.split(".");
  if (!encodedUsername || !expiresAtRaw || !signature) {
    return false;
  }

  const username = new TextDecoder().decode(fromBase64Url(encodedUsername));
  const expiresAt = Number.parseInt(expiresAtRaw, 10);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  if (username !== process.env.AUTH_USERNAME?.trim()) {
    return false;
  }

  const secret = process.env.AUTH_SECRET ?? process.env.AUTH_PASSWORD ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${username}:${expiresAt}`),
  );

  const expectedSignature = new Uint8Array(signed);
  const actualSignature = fromBase64Url(signature);

  return timingSafeEqual(actualSignature, expectedSignature);
}

export async function middleware(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (
    isPublicPath(pathname) ||
    pathname === "/login" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/logout"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authenticated = await verifySessionToken(sessionCookie);

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
