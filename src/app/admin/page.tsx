import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StatusBadge, TypeBadge, UrgencyBadge } from "@/components/Badges";
import { timeAgo } from "@/components/ListingCard";
import { adminKeyOk } from "@/lib/admin";
import { adminDelete, toggleHidden } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (!adminKeyOk(key)) {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-8 text-center">
        <h1 className="text-2xl font-extrabold text-navy">Moderation</h1>
        <p className="text-sm text-slate-500">
          Enter the admin key configured in the <code>ADMIN_KEY</code>{" "}
          environment variable.
        </p>
        <form method="get" action="/admin" className="flex gap-2">
          <input
            type="password"
            name="key"
            placeholder="Admin key"
            className="field"
            autoFocus
          />
          <button type="submit" className="btn btn-navy">
            Enter
          </button>
        </form>
      </div>
    );
  }

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">
        Moderation — {listings.length} listing{listings.length === 1 ? "" : "s"}
      </h1>
      <div className="space-y-2">
        {listings.map((l) => (
          <div
            key={l.id}
            className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 ${
              l.hidden ? "border-red-300 opacity-70" : "border-slate-200"
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <TypeBadge type={l.type} />
                <StatusBadge status={l.status} />
                <UrgencyBadge urgency={l.urgency} />
                {l.hidden && (
                  <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Hidden
                  </span>
                )}
              </div>
              <Link
                href={`/listing/${l.id}`}
                className="mt-1 block truncate font-semibold text-navy hover:underline"
              >
                {l.title}
              </Link>
              <p className="truncate text-xs text-slate-500">
                📍 {l.locationName} · {l.contactName}
                {l.orgName ? ` (${l.orgName})` : ""} · {timeAgo(l.createdAt)} ·{" "}
                {[l.phone, l.whatsapp, l.email].filter(Boolean).join(" · ")}
              </p>
            </div>
            <form action={toggleHidden}>
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={l.id} />
              <button type="submit" className="btn btn-outline !py-1.5 text-sm">
                {l.hidden ? "Unhide" : "Hide"}
              </button>
            </form>
            <form action={adminDelete}>
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={l.id} />
              <button
                type="submit"
                className="btn !bg-red-600 !py-1.5 text-sm text-white hover:!bg-red-700"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
