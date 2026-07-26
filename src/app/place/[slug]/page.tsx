import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ListingCard } from "@/components/ListingCard";
import { getI18n, getLocale, lp } from "@/lib/i18n";
import { searchListings } from "@/lib/listings";
import { pageMetadata } from "@/lib/page-metadata";
import { activePlaces, findPlace } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const { d } = await getI18n();
  const place = await findPlace(slug);
  if (!place) return { title: "Not found" };

  return pageMetadata({
    title: d.place.title.replace("{place}", place.name),
    description: d.place.metaDescription.replace("{place}", place.name),
    path: `/place/${slug}`,
    locale,
  });
}

/**
 * One page per place people have actually posted from. This is the shape
 * of the search that matters here — "refugio Vargas", "medicinas Catia La
 * Mar" — and nothing on the site could answer it before.
 */
export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, d } = await getI18n();
  const place = await findPlace(slug);
  if (!place) notFound();

  const { items, total } = await searchListings({ q: place.name });
  const others = (await activePlaces())
    .filter((p) => p.slug !== slug)
    .slice(0, 12);

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <p className="text-sm">
          <Link
            href={lp(locale, "/browse")}
            className="text-slate-500 underline hover:text-navy"
          >
            {d.listing.back}
          </Link>
        </p>
        <h1 className="text-3xl font-extrabold text-navy">
          📍 {d.place.title.replace("{place}", place.name)}
        </h1>
        <p className="text-slate-600">
          {total} {total === 1 ? d.browse.result : d.browse.results} ·{" "}
          <Link href={lp(locale, "/map")} className="underline hover:text-navy">
            {d.browse.viewOnMap}
          </Link>
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p>{d.browse.noMatch}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} d={d} locale={locale} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <nav className="space-y-2 border-t border-slate-200 pt-5">
          <h2 className="text-sm font-semibold text-navy">
            {d.place.otherPlaces}
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={lp(locale, `/place/${p.slug}`)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-600 hover:border-navy hover:text-navy"
              >
                {p.name} ({p.count})
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
