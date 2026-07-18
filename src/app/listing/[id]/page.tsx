import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  CategoryBadge,
  StatusBadge,
  TypeBadge,
  UrgencyBadge,
} from "@/components/Badges";
import { ContactButtons } from "@/components/ContactButtons";
import { timeAgo } from "@/components/ListingCard";

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
  if (!listing) return { title: "Listing not found" };
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
  const listing = await getListing(id);
  if (!listing) notFound();

  const resolved = listing.status === "FULFILLED" || listing.status === "CLOSED";

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm">
        <Link href="/browse" className="text-slate-500 underline hover:text-navy">
          ← Back to browse
        </Link>
      </p>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <TypeBadge type={listing.type} />
          <CategoryBadge category={listing.category} />
          <UrgencyBadge urgency={listing.urgency} />
          <StatusBadge status={listing.status} />
        </div>
        <h1 className="text-3xl font-extrabold text-navy">{listing.title}</h1>
        <p className="text-sm text-slate-500">
          📍 {listing.locationName} · Posted {timeAgo(listing.createdAt)}
          {listing.orgName ? ` · ${listing.orgName}` : ""}
        </p>
      </header>

      {resolved && (
        <div className="rounded-lg border border-slate-300 bg-slate-100 p-4 text-slate-700">
          This listing has been marked{" "}
          <strong>{listing.status.toLowerCase()}</strong> and is no longer
          active.{" "}
          <Link href="/browse" className="underline">
            Browse active listings
          </Link>
          .
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {listing.description}
        </p>
        {listing.quantity && (
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-semibold text-navy">Quantity / scale:</span>{" "}
            {listing.quantity}
          </p>
        )}
      </div>

      {!resolved && (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-navy">
            Contact {listing.contactName}
          </h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            Reach out directly — Humanade doesn&apos;t sit in the middle.
          </p>
          <ContactButtons listing={listing} />
        </section>
      )}

      {listing.lat != null && listing.lng != null && (
        <p className="text-sm text-slate-500">
          Pinned location:{" "}
          <a
            className="underline hover:text-navy"
            href={`https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lng}#map=13/${listing.lat}/${listing.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            open in OpenStreetMap
          </a>{" "}
          ·{" "}
          <Link href="/map" className="underline hover:text-navy">
            see all on Humanade map
          </Link>
        </p>
      )}

      <p className="text-xs text-slate-400">
        Posted something yourself? Use the private management link you received
        to update or close your listing. Stay safe: meet in public places when
        possible and never send money to people you cannot verify.
      </p>
    </article>
  );
}
