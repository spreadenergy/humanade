import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORY_ICONS, CATEGORY_KEYS } from "@/lib/constants";
import { getI18n } from "@/lib/i18n";
import { ListingCard } from "@/components/ListingCard";
import { LogoMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { d } = await getI18n();
  const [urgent, recent, openNeeds, openOffers] = await Promise.all([
    prisma.listing.findMany({
      where: { hidden: false, status: "OPEN", urgency: "CRITICAL" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.listing.findMany({
      where: { hidden: false, status: { in: ["OPEN", "ASSIGNED"] } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.listing.count({
      where: { hidden: false, status: "OPEN", type: "NEED" },
    }),
    prisma.listing.count({
      where: { hidden: false, status: "OPEN", type: "OFFER" },
    }),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-4 text-center">
        <LogoMark className="mx-auto h-20 w-20" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          {d.siteTagline.replace(/\.$/, "")}
        </h1>
        <p className="mt-3 text-lg text-slate-600">{d.home.heroSub}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/post?type=NEED"
            className="rounded-xl bg-brand-blue p-6 text-white shadow transition-colors hover:bg-brand-blue-dark"
          >
            <span className="block text-2xl font-extrabold">{d.cta.need}</span>
            <span className="mt-1 block text-sm text-blue-50">
              {d.home.needDesc}
            </span>
          </Link>
          <Link
            href="/post?type=OFFER"
            className="rounded-xl bg-brand-green p-6 text-white shadow transition-colors hover:bg-brand-green-dark"
          >
            <span className="block text-2xl font-extrabold">{d.cta.offer}</span>
            <span className="mt-1 block text-sm text-green-50">
              {d.home.offerDesc}
            </span>
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          {openNeeds}{" "}
          {openNeeds === 1 ? d.home.openRequest : d.home.openRequests} ·{" "}
          {openOffers} {openOffers === 1 ? d.home.openOffer : d.home.openOffers}{" "}
          ·{" "}
          <Link href="/browse" className="underline hover:text-navy">
            {d.home.browseAllInline}
          </Link>{" "}
          {d.home.orWord}{" "}
          <Link href="/map" className="underline hover:text-navy">
            {d.home.viewMapInline}
          </Link>
        </p>
      </section>

      {/* Critical needs */}
      {urgent.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-navy">{d.home.criticalNow}</h2>
            <Link
              href="/browse?urgency=CRITICAL"
              className="text-sm text-slate-500 underline hover:text-navy"
            >
              {d.home.seeAllCritical}
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {urgent.map((l) => (
              <ListingCard key={l.id} listing={l} d={d} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold text-navy">{d.home.byCategory}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_KEYS.map((k) => (
            <Link
              key={k}
              href={`/browse?category=${k}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy transition-shadow hover:shadow"
            >
              <span className="text-xl" aria-hidden="true">
                {CATEGORY_ICONS[k]}
              </span>
              {d.categories[k].label}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-navy">{d.home.latest}</h2>
          <Link
            href="/browse"
            className="text-sm text-slate-500 underline hover:text-navy"
          >
            {d.home.browseAll}
          </Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((l) => (
            <ListingCard key={l.id} listing={l} d={d} />
          ))}
        </div>
        {recent.length === 0 && (
          <p className="mt-3 text-slate-500">
            {d.home.emptyPre}{" "}
            <Link href="/post" className="underline">
              {d.home.emptyLink}
            </Link>
            .
          </p>
        )}
      </section>

      {/* How it works */}
      <section className="rounded-xl bg-navy p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold">{d.home.howTitle}</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {(
            [
              [d.home.how1t, d.home.how1d],
              [d.home.how2t, d.home.how2d],
              [d.home.how3t, d.home.how3d],
            ] as const
          ).map(([t, desc], i) => (
            <li key={t}>
              <span className="text-2xl font-extrabold text-sun">{i + 1}</span>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-sm text-slate-300">{desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
