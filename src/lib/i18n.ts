import { cookies, headers } from "next/headers";
import { en, type Dict } from "./dictionaries/en";
import { es } from "./dictionaries/es";

export type Locale = "en" | "es";

const dictionaries: Record<Locale, Dict> = { en, es };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}

/**
 * Locale resolution: explicit cookie (set by the language switcher) wins;
 * otherwise any Spanish preference in Accept-Language gets Spanish.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get("locale")?.value;
  if (saved === "es" || saved === "en") return saved;

  const headerStore = await headers();
  const accept = headerStore.get("accept-language") ?? "";
  if (/(^|,|;|\s)es\b/i.test(accept)) return "es";
  return "en";
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, d: getDict(locale) };
}
