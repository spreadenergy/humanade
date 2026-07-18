import Link from "next/link";
import type { Listing } from "@prisma/client";
import {
  CategoryBadge,
  StatusBadge,
  TypeBadge,
  UrgencyBadge,
} from "./Badges";

export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function ListingCard({ listing }: { listing: Listing }) {
  const accent =
    listing.type === "NEED" ? "border-l-brand-blue" : "border-l-brand-green";
  return (
    <Link
      href={`/listing/${listing.id}`}
      className={`block rounded-lg border border-slate-200 border-l-4 ${accent} bg-white p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <TypeBadge type={listing.type} />
        <CategoryBadge category={listing.category} />
        <UrgencyBadge urgency={listing.urgency} />
        {listing.status !== "OPEN" && <StatusBadge status={listing.status} />}
      </div>
      <h3 className="mt-2 text-lg font-bold text-navy">{listing.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
        {listing.description}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        📍 {listing.locationName} · {timeAgo(listing.createdAt)}
        {listing.orgName ? ` · ${listing.orgName}` : ""}
      </p>
    </Link>
  );
}
