import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORIES, CATEGORY_KEYS, SITE_TAGLINE } from "@/lib/constants";
import { ListingCard } from "@/components/ListingCard";
import { LogoMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function Home() {
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
    prisma.listing.count({ where: { hidden: false, status: "OPEN", type: "NEED" } }),
    prisma.listing.count({ where: { hidden: false, status: "OPEN", type: "OFFER" } }),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-4 text-center">
        <LogoMark className="mx-auto h-20 w-20" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          {SITE_TAGLINE.replace(/\.$/, "")}
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Humanade is the simplest way to ask for help or offer help. No
          account needed. Post in under a minute.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/post?type=NEED"
            className="rounded-xl bg-brand-blue p-6 text-white shadow transition-colors hover:bg-brand-blue-dark"
          >
            <span className="block text-2xl font-extrabold">I Need Help</span>
            <span className="mt-1 block text-sm text-blue-50">
              Post a request — water, food, medicine, shelter, transport…
            </span>
          </Link>
          <Link
            href="/post?type=OFFER"
            className="rounded-xl bg-brand-green p-6 text-white shadow transition-colors hover:bg-brand-green-dark"
          >
            <span className="block text-2xl font-extrabold">I Can Help</span>
            <span className="mt-1 block text-sm text-green-50">
              Offer supplies, skills, space, transport, or your time.
            </span>
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          {openNeeds} open request{openNeeds === 1 ? "" : "s"} ·{" "}
          {openOffers} open offer{openOffers === 1 ? "" : "s"} ·{" "}
          <Link href="/browse" className="underline hover:text-navy">
            browse all
          </Link>{" "}
          or{" "}
          <Link href="/map" className="underline hover:text-navy">
            view the map
          </Link>
        </p>
      </section>

      {/* Critical needs */}
      {urgent.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-navy">Critical right now</h2>
            <Link
              href="/browse?urgency=CRITICAL"
              className="text-sm text-slate-500 underline hover:text-navy"
            >
              See all critical
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {urgent.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold text-navy">Browse by category</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_KEYS.map((k) => (
            <Link
              key={k}
              href={`/browse?category=${k}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy transition-shadow hover:shadow"
            >
              <span className="text-xl" aria-hidden="true">
                {CATEGORIES[k].icon}
              </span>
              {CATEGORIES[k].label}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-navy">Latest listings</h2>
          <Link
            href="/browse"
            className="text-sm text-slate-500 underline hover:text-navy"
          >
            Browse all
          </Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
        {recent.length === 0 && (
          <p className="mt-3 text-slate-500">
            No listings yet. Be the first to{" "}
            <Link href="/post" className="underline">
              post a need or an offer
            </Link>
            .
          </p>
        )}
      </section>

      {/* How it works */}
      <section className="rounded-xl bg-navy p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold">How Humanade works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          <li>
            <span className="text-2xl font-extrabold text-sun">1</span>
            <p className="mt-1 font-semibold">Post</p>
            <p className="text-sm text-slate-300">
              Describe what you need or what you can give, and where. No
              account, no forms beyond the essentials.
            </p>
          </li>
          <li>
            <span className="text-2xl font-extrabold text-sun">2</span>
            <p className="mt-1 font-semibold">Connect</p>
            <p className="text-sm text-slate-300">
              People reach you directly by phone, WhatsApp, or email — no
              middleman, no waiting.
            </p>
          </li>
          <li>
            <span className="text-2xl font-extrabold text-sun">3</span>
            <p className="mt-1 font-semibold">Resolve</p>
            <p className="text-sm text-slate-300">
              Mark your listing assigned or fulfilled with your private
              management link so effort goes where it&apos;s still needed.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
