import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getI18n } from "@/lib/i18n";
import {
  CategoryBadge,
  StatusBadge,
  TypeBadge,
  UrgencyBadge,
} from "@/components/Badges";
import { ContactButtons } from "@/components/ContactButtons";
import { timeAgo } from "@/components/ListingCard";
import type { Status } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getListing(id: string) {
  return prisma.listing.findFirst({ where: { id, hidden: false } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Not found" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { d } = await getI18n();
  const listing = await getListing(id);
  if (!listing) notFound();

  const resolved =
    listing.status === "FULFILLED" || listing.status === "CLOSED";

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm">
        <Link
          href="/browse"
          className="text-slate-500 underline hover:text-navy"
        >
          {d.listing.back}
        </Link>
      </p>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <TypeBadge type={listing.type} d={d} />
          <CategoryBadge category={listing.category} d={d} />
          <UrgencyBadge urgency={listing.urgency} d={d} />
          <StatusBadge status={listing.status} d={d} />
        </div>
        <h1 className="text-3xl font-extrabold text-navy">{listing.title}</h1>
        <p className="text-sm text-slate-500">
          📍 {listing.locationName} · {d.listing.posted}{" "}
          {timeAgo(listing.createdAt, d.time)}
          {listing.orgName ? ` · ${listing.orgName}` : ""}
        </p>
      </header>

      {resolved && (
        <div className="rounded-lg border border-slate-300 bg-slate-100 p-4 text-slate-700">
          {d.listing.resolvedPre}{" "}
          <strong>{d.statuses[listing.status as Status]}</strong>{" "}
          {d.listing.resolvedPost}{" "}
          <Link href="/browse" className="underline">
            {d.listing.browseActive}
          </Link>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {listing.description}
        </p>
        {listing.quantity && (
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-semibold text-navy">
              {d.listing.quantity}
            </span>{" "}
            {listing.quantity}
          </p>
        )}
      </div>

      {!resolved && (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-navy">
            {d.listing.contact} {listing.contactName}
          </h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            {d.listing.contactSub}
          </p>
          <ContactButtons listing={listing} d={d} />
        </section>
      )}

      {listing.lat != null && listing.lng != null && (
        <p className="text-sm text-slate-500">
          {d.listing.pinned}{" "}
          <a
            className="underline hover:text-navy"
            href={`https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lng}#map=13/${listing.lat}/${listing.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {d.listing.openOSM}
          </a>{" "}
          ·{" "}
          <Link href="/map" className="underline hover:text-navy">
            {d.listing.seeAllMap}
          </Link>
        </p>
      )}

      <p className="text-xs text-slate-400">{d.listing.safety}</p>
    </article>
  );
}
