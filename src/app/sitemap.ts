import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { LOCALES, lp } from "@/lib/i18n";

export const dynamic = "force-dynamic";

/**
 * Both languages, each entry declaring the other as its alternate.
 * Without this Google sees `/browse` and `/en/browse` as two unrelated
 * pages carrying the same content and quietly picks one.
 */
function entry(
  path: string,
  extra: Partial<MetadataRoute.Sitemap[number]> = {},
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}${lp(locale, path)}`]),
  );
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${lp(locale, path)}`,
    alternates: { languages },
    ...extra,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { hidden: false, status: { in: ["OPEN", "ASSIGNED"] } },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  return [
    ...entry("/", { changeFrequency: "hourly", priority: 1 }),
    ...entry("/browse", { changeFrequency: "hourly", priority: 0.9 }),
    ...entry("/map", { changeFrequency: "hourly", priority: 0.7 }),
    ...entry("/about", { changeFrequency: "monthly", priority: 0.5 }),
    ...entry("/privacy", { changeFrequency: "yearly", priority: 0.3 }),
    ...listings.flatMap((l) =>
      entry(`/listing/${l.id}`, { lastModified: l.updatedAt }),
    ),
  ];
}
