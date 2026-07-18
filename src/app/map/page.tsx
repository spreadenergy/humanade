import Link from "next/link";
import type { Metadata } from "next";
import { FilterBar } from "@/components/FilterBar";
import { MapView } from "@/components/MapView";
import { getMappableListings, normalizeFilters } from "@/lib/listings";

export const metadata: Metadata = { title: "Map" };
export const dynamic = "force-dynamic";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = normalizeFilters(params);
  const listings = await getMappableListings(filters);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-navy">
          Needs &amp; offers map
        </h1>
        <p className="text-sm text-slate-500">
          <span className="me-3 inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-blue" />{" "}
            Needs
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-green" />{" "}
            Offers
          </span>
        </p>
      </div>

      <FilterBar filters={filters} action="/map" />

      <MapView listings={listings} />

      <p className="text-sm text-slate-500">
        Showing {listings.length} pinned listing
        {listings.length === 1 ? "" : "s"}. Listings without a map pin appear
        only in{" "}
        <Link href="/browse" className="underline hover:text-navy">
          browse
        </Link>
        .
      </p>
    </div>
  );
}
