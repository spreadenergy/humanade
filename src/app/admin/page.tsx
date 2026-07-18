import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getI18n } from "@/lib/i18n";
import { StatusBadge, TypeBadge, UrgencyBadge } from "@/components/Badges";
import { timeAgo } from "@/components/ListingCard";
import { adminKeyOk } from "@/lib/admin";
import { adminDelete, dismissReports, toggleHidden } from "./actions";

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
  const { d } = await getI18n();

  if (!adminKeyOk(key)) {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-8 text-center">
        <h1 className="text-2xl font-extrabold text-navy">{d.admin.title}</h1>
        <p className="text-sm text-slate-500">{d.admin.enterNote}</p>
        <form method="get" action="/admin" className="flex gap-2">
          <input
            type="password"
            name="key"
            placeholder={d.admin.keyPh}
            className="field"
            autoFocus
          />
          <button type="submit" className="btn btn-navy">
            {d.admin.enter}
          </button>
        </form>
      </div>
    );
  }

  const [listings, reported] = await Promise.all([
    prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.listing.findMany({
      where: { reports: { some: {} } },
      include: {
        reports: { orderBy: { createdAt: "desc" }, take: 10 },
        _count: { select: { reports: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy">
        {d.admin.title} — {listings.length}{" "}
        {listings.length === 1 ? d.admin.listing : d.admin.listings}
      </h1>

      <section className="rounded-lg border border-sun bg-white p-4">
        <h2 className="font-bold text-navy">
          ⚑ {d.admin.reportedSection} ({reported.length})
        </h2>
        {reported.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{d.admin.noReports}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {reported.map((l) => (
              <div
                key={l.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/listing/${l.id}`}
                    className="block truncate font-semibold text-navy hover:underline"
                  >
                    {l.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {l._count.reports}{" "}
                    {l._count.reports === 1
                      ? d.admin.reportWord
                      : d.admin.reportsWord}
                    {l.hidden ? ` · ${d.admin.hidden}` : ""} ·{" "}
                    {l.reports
                      .map(
                        (r) =>
                          d.report.reasons[
                            r.reason as keyof typeof d.report.reasons
                          ] + (r.comment ? ` («${r.comment}»)` : ""),
                      )
                      .join(" · ")}
                  </p>
                </div>
                <form action={toggleHidden}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={l.id} />
                  <button
                    type="submit"
                    className="btn btn-outline !py-1.5 text-sm"
                  >
                    {l.hidden ? d.admin.unhide : d.admin.hide}
                  </button>
                </form>
                <form action={dismissReports}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className="btn btn-navy !py-1.5 text-sm">
                    {d.admin.dismissReports}
                  </button>
                </form>
                <form action={adminDelete}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={l.id} />
                  <button
                    type="submit"
                    className="btn !bg-red-600 !py-1.5 text-sm text-white hover:!bg-red-700"
                  >
                    {d.admin.delete}
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
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
                <TypeBadge type={l.type} d={d} />
                <StatusBadge status={l.status} d={d} />
                <UrgencyBadge urgency={l.urgency} d={d} />
                {l.hidden && (
                  <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    {d.admin.hidden}
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
                {l.orgName ? ` (${l.orgName})` : ""} ·{" "}
                {timeAgo(l.createdAt, d.time)} ·{" "}
                {[l.phone, l.whatsapp, l.email].filter(Boolean).join(" · ")}
              </p>
            </div>
            <form action={toggleHidden}>
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={l.id} />
              <button type="submit" className="btn btn-outline !py-1.5 text-sm">
                {l.hidden ? d.admin.unhide : d.admin.hide}
              </button>
            </form>
            <form action={adminDelete}>
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={l.id} />
              <button
                type="submit"
                className="btn !bg-red-600 !py-1.5 text-sm text-white hover:!bg-red-700"
              >
                {d.admin.delete}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
