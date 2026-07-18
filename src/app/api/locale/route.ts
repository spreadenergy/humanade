import { NextRequest, NextResponse } from "next/server";

/**
 * No-JS language switcher: GET /api/locale?lang=es&to=/browse
 * sets the locale cookie and redirects back.
 */
export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  const to = request.nextUrl.searchParams.get("to") ?? "/";
  // Only allow same-site redirect targets.
  const safeTo = to.startsWith("/") && !to.startsWith("//") ? to : "/";
  const response = NextResponse.redirect(new URL(safeTo, request.url));
  if (lang === "es" || lang === "en") {
    response.cookies.set("locale", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}
