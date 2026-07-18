import Link from "next/link";
import type { Metadata } from "next";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { getI18n } from "@/lib/i18n";
import { normalizeFilters, searchListings } from "@/lib/listings";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.browse.title };
}
export const dynamic = "force-dynamic";

function pageHref(
  params: { [key: string]: string | string[] | undefined },
  page: number,
) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "string" && v !== "" && k !== "page") sp.set(k, v);
  }
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `/browse${qs ? `?${qs}` : ""}`;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { d } = await getI18n();
  const filters = normalizeFilters(params);
  const { items, total, page, pageCount } = await searchListings(filters);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-navy">{d.browse.title}</h1>
        <p className="text-sm text-slate-500">
          {total} {total === 1 ? d.browse.result : d.browse.results} ·{" "}
          <Link href="/map" className="underline hover:text-navy">
            {d.browse.viewOnMap}
          </Link>
        </p>
      </div>

      <FilterBar filters={filters} d={d} />

      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p>{d.browse.noMatch}</p>
          <p className="mt-2">
            <Link href="/post" className="underline hover:text-navy">
              {d.browse.postCta}
            </Link>{" "}
            {d.browse.postCtaPost}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} d={d} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-4 pt-2 text-sm">
          {page > 1 ? (
            <Link
              href={pageHref(params, page - 1)}
              className="btn btn-outline !py-1.5"
            >
              {d.browse.prev}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-slate-500">
            {d.browse.pageWord} {page} {d.browse.ofWord} {pageCount}
          </span>
          {page < pageCount && (
            <Link
              href={pageHref(params, page + 1)}
              className="btn btn-outline !py-1.5"
            >
              {d.browse.next}
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
