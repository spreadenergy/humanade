import Link from "next/link";
import type { Metadata } from "next";
import { FilterBar } from "@/components/FilterBar";
import { MapView } from "@/components/MapView";
import { getI18n, lp } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-metadata";
import { getMappableListings, normalizeFilters } from "@/lib/listings";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, d } = await getI18n();
  return pageMetadata({
    title: d.map.title,
    description: d.map.metaDescription,
    path: "/map",
    locale,
  });
}
export const dynamic = "force-dynamic";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { locale, d } = await getI18n();
  const filters = normalizeFilters(params);
  const listings = await getMappableListings(filters);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-navy">{d.map.title}</h1>
        <p className="text-sm text-slate-500">
          <span className="me-3 inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-blue" />{" "}
            {d.map.needs}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-green" />{" "}
            {d.map.offers}
          </span>
        </p>
      </div>

      <FilterBar filters={filters} d={d} action={lp(locale, "/map")} />

      <MapView
        listings={listings}
        listingBase={lp(locale, "/").replace(/\/$/, "")}
        labels={{
          need: d.map.need,
          offer: d.map.offer,
          viewListing: d.map.viewListing,
          ariaLabel: d.map.title,
        }}
      />

      <p className="text-sm text-slate-500">
        {d.map.showing} {listings.length}{" "}
        {listings.length === 1 ? d.map.pinnedListing : d.map.pinnedListings}.{" "}
        {d.map.unpinnedNote}{" "}
        <Link href={lp(locale, "/browse")} className="underline hover:text-navy">
          {d.map.browseWord}
        </Link>
        .
      </p>
    </div>
  );
}
