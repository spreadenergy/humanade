import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ListingCard } from "@/components/ListingCard";
import { CATEGORY_ICONS, CATEGORY_KEYS, type Category } from "@/lib/constants";
import { getI18n, getLocale, lp } from "@/lib/i18n";
import { searchListings } from "@/lib/listings";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

/** "HEALTH" ↔ "health": the stored keys are shouted, URLs are not. */
function toCategory(slug: string): Category | null {
  const upper = slug.toUpperCase();
  return CATEGORY_KEYS.includes(upper as Category) ? (upper as Category) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const { d } = await getI18n();
  const category = toCategory(slug);
  if (!category) return { title: "Not found" };

  const label = d.categories[category].label;
  return pageMetadata({
    title: d.category.title.replace("{category}", label),
    description: d.category.metaDescription.replace("{category}", label),
    path: `/category/${slug}`,
    locale,
  });
}

/**
 * One page per category, with an address of its own. Filtering used to
 * happen entirely in query strings that all declared /browse as their
 * canonical, so no filtered view could ever be indexed.
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, d } = await getI18n();
  const category = toCategory(slug);
  if (!category) notFound();

  const { items, total } = await searchListings({ category });
  const label = d.categories[category].label;

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
          {CATEGORY_ICONS[category]}{" "}
          {d.category.title.replace("{category}", label)}
        </h1>
        <p className="text-slate-600">
          {total} {total === 1 ? d.browse.result : d.browse.results}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p>{d.browse.noMatch}</p>
          <p className="mt-2">
            <Link
              href={lp(locale, "/post")}
              className="underline hover:text-navy"
            >
              {d.browse.postCta}
            </Link>{" "}
            {d.browse.postCtaPost}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} d={d} locale={locale} />
          ))}
        </div>
      )}

      <nav className="flex flex-wrap gap-2 border-t border-slate-200 pt-5">
        {CATEGORY_KEYS.filter((k) => k !== category).map((k) => (
          <Link
            key={k}
            href={lp(locale, `/category/${k.toLowerCase()}`)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-600 hover:border-navy hover:text-navy"
          >
            {CATEGORY_ICONS[k]} {d.categories[k].short}
          </Link>
        ))}
      </nav>
    </div>
  );
}
