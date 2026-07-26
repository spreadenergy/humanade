import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "humanade_admin";

/** Constant-time so a wrong key reveals nothing by how long it took. */
function matches(given: string, configured: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminKeyOk(key: string | undefined | null) {
  const configured = process.env.ADMIN_KEY;
  if (!configured || configured === "change-me") return false;
  return typeof key === "string" && matches(key, configured);
}

/**
 * The key used to arrive as `?key=...`, which left the password in the
 * browser history, in the address bar, in any screenshot of the panel and
 * in server logs — and this panel shows the name and phone number of
 * everyone who has posted. It is now sent by POST once and kept in an
 * httpOnly cookie the page reads instead.
 */
export async function adminSessionOk(): Promise<boolean> {
  const store = await cookies();
  return adminKeyOk(store.get(ADMIN_COOKIE)?.value);
}
