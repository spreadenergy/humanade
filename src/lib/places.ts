import { prisma } from "@/lib/db";

/**
 * People do not search for "browse listings". They search for "medicinas
 * Catia La Mar" or "refugio Vargas" — a thing, in a place. The site had
 * no page that could answer that: filtering produced query strings that
 * all pointed back at /browse as their canonical, so no filtered view
 * could ever rank for anything.
 *
 * Places come from what people actually typed as their location, so the
 * set grows on its own as the platform is used.
 */

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents: "Maiquetía" → "Maiquetia"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export interface Place {
  name: string;
  slug: string;
  count: number;
}

/** Distinct places with at least one listing people can still act on. */
export async function activePlaces(): Promise<Place[]> {
  const rows = await prisma.listing.groupBy({
    by: ["locationName"],
    where: { hidden: false, status: { in: ["OPEN", "ASSIGNED"] } },
    _count: { _all: true },
  });

  // Two spellings of the same place ("Catia la Mar", "Catia La Mar") slug
  // identically and should be one page, not two competing for it.
  const merged = new Map<string, Place>();
  for (const row of rows) {
    const slug = slugify(row.locationName);
    if (!slug) continue;
    const existing = merged.get(slug);
    if (existing) {
      existing.count += row._count._all;
    } else {
      merged.set(slug, {
        name: row.locationName,
        slug,
        count: row._count._all,
      });
    }
  }

  return [...merged.values()].sort((a, b) => b.count - a.count);
}

export async function findPlace(slug: string): Promise<Place | null> {
  const places = await activePlaces();
  return places.find((p) => p.slug === slug) ?? null;
}
