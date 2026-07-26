import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { DEFAULT_LOCALE, LOCALES, lp, type Locale } from "@/lib/i18n";

/** Social card artwork. Static file, no query string: some scrapers refuse
 *  querystringed og:image URLs, and a share should not cost a render. */
export const OG_IMAGE = "/og.png";
export const OG_IMAGE_ALT =
  "Humanade — Conectando Necesidades Humanas con Soluciones Humanas";

/**
 * Trims a listing's own words down to card length. Cuts on a space rather
 * than a character count so the preview never ends mid-word, the way
 * "…y mat" did.
 */
export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-–—]$/, "")}…`;
}

interface PageMetadataInput {
  /** Shown in the tab and as the headline of the shared card. */
  title: string;
  description: string;
  /** Locale-free path of this page, e.g. `/listing/abc`. Becomes og:url,
   *  which is how WhatsApp and Facebook tell one shared link from
   *  another. */
  path: string;
  /** Which language this rendering is. Spanish is unprefixed. */
  locale: Locale;
  type?: "website" | "article";
}

/**
 * Tells search engines that the Spanish page at `/browse` and the English
 * one at `/en/browse` are the same page, so neither is read as a
 * duplicate of the other. `x-default` points at Spanish, which is who
 * this is for.
 */
export function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of LOCALES) {
    alternates[locale] = new URL(lp(locale, path), SITE_URL).toString();
  }
  alternates["x-default"] = new URL(lp(DEFAULT_LOCALE, path), SITE_URL).toString();
  return alternates;
}

/**
 * Next inherits the root layout's whole `openGraph` block whenever a page
 * omits its own; a page's plain `title`/`description` never reach it. Pages
 * that only set `title` therefore shared as the site's generic tagline, and
 * every listing produced an identical card pointing at the home page.
 * Building both halves here keeps them from drifting apart again.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = new URL(lp(locale, path), SITE_URL).toString();
  const images = [
    { url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT },
  ];

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { siteName: SITE_NAME, title, description, url, type, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
