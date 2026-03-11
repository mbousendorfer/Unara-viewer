import "server-only";

import { cookies } from "next/headers";
export {
  authenticateUser,
  createSessionCookieValue,
  getSessionCookieName,
  isAuthEnabled,
  verifySessionToken,
} from "@/lib/auth";
import { getSessionCookieName, isAuthEnabled, verifySessionToken } from "@/lib/auth";

export async function isAuthenticated() {
  if (!isAuthEnabled()) {
    return true;
  }

  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(getSessionCookieName())?.value);
}
