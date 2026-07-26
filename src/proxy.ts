import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * One address per language.
 *
 * Both languages used to share a single URL and were chosen by cookie, so
 * Google could only ever index one of them and there was no address to
 * hand anyone for "the English version".
 *
 * Spanish stays unprefixed because that is who this is for, and because
 * it means every link already shared — every listing pasted into a
 * WhatsApp group — keeps working and keeps meaning the same thing.
 * English moves to /en, rewritten internally to the same route with a
 * header the app reads. The URL decides the language; nothing else does.
 */
export const LOCALE_HEADER = "x-humanade-locale";
/** The locale-free path, so a page can link to its own translation. */
export const PATH_HEADER = "x-humanade-path";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const bare = isEnglish ? pathname.slice(3) || "/" : pathname;

  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, isEnglish ? "en" : "es");
  headers.set(PATH_HEADER, bare);

  if (!isEnglish) return NextResponse.next({ request: { headers } });

  const url = request.nextUrl.clone();
  url.pathname = bare;
  url.search = search;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Everything except Next's own assets, the API, and the files that must
  // be served from the root whatever the language.
  matcher: [
    "/((?!_next/|api/|favicon|icon|apple-icon|manifest\\.webmanifest|og\\.png|robots\\.txt|sitemap\\.xml).*)",
  ],
};
