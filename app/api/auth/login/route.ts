import { NextResponse } from "next/server";

import {
  authenticateUser,
  createSessionCookieValue,
  getSessionCookieName,
  isAuthEnabled,
} from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAuthEnabled()) {
    return NextResponse.json({ ok: true, disabled: true });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        username?: string;
        password?: string;
      }
    | null;

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  if (!authenticateUser(username, password)) {
    return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
  }

  const session = createSessionCookieValue(username);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: getSessionCookieName(),
    value: session.value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });

  return response;
}
