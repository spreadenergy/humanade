import { headers } from "next/headers";
import { en, type Dict } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { LOCALE_HEADER, PATH_HEADER } from "../proxy";

export type Locale = "en" | "es";
export const LOCALES: Locale[] = ["es", "en"];
/** Served unprefixed. Spanish, because that is who Humanade is for. */
export const DEFAULT_LOCALE: Locale = "es";

const dictionaries: Record<Locale, Dict> = { en, es };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? es;
}

/**
 * The URL decides the language: /en/… is English, everything else is
 * Spanish. It used to be a cookie, which meant one address served both
 * languages — invisible to search engines and impossible to link to.
 */
export async function getLocale(): Promise<Locale> {
  const store = await headers();
  return store.get(LOCALE_HEADER) === "en" ? "en" : "es";
}

/** The current path with no locale prefix, e.g. "/browse". */
export async function getBarePath(): Promise<string> {
  const store = await headers();
  return store.get(PATH_HEADER) || "/";
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, d: getDict(locale) };
}

/**
 * Builds an internal href for a locale. Every `<Link>` goes through this,
 * so an English reader never falls back into Spanish by following the
 * site's own navigation.
 */
export function lp(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}
