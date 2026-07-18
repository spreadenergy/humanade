import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL, STATUS_KEYS } from "@/lib/constants";
import { getI18n } from "@/lib/i18n";
import { StatusBadge, TypeBadge } from "@/components/Badges";
import { CopyButton } from "@/components/CopyButton";
import { ManageEditForm } from "@/components/ManageEditForm";
import { deleteListing, updateStatus } from "./actions";

export const metadata: Metadata = {
  title: "Manage",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ManagePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const { d } = await getI18n();
  const listing = await prisma.listing.findUnique({
    where: { manageToken: token },
  });
  if (!listing) notFound();

  const manageUrl = `${SITE_URL}/manage/${token}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {sp.created && (
        <div className="rounded-lg border border-brand-green bg-green-50 p-4">
          <h2 className="text-lg font-bold text-brand-green-dark">
            {d.manage.createdTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{d.manage.createdNote}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="break-all rounded bg-white px-2 py-1 text-xs text-navy">
              {manageUrl}
            </code>
            <CopyButton
              text={manageUrl}
              label={d.manage.copyLink}
              copiedLabel={d.manage.copied}
            />
          </div>
        </div>
      )}
      {sp.saved && (
        <div className="rounded-lg border border-brand-green bg-green-50 p-3 text-sm text-brand-green-dark">
          {d.manage.saved}
        </div>
      )}
      {sp.error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {d.manage.invalid}
        </div>
      )}
      {sp.confirmDelete && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {d.manage.confirmDelete}
        </div>
      )}

      <header>
        <p className="text-sm text-slate-500">{d.manage.managing}</p>
        <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-extrabold text-navy">
          {listing.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <TypeBadge type={listing.type} d={d} />
          <StatusBadge status={listing.status} d={d} />
        </div>
        <p className="mt-2 text-sm">
          <Link
            href={`/listing/${listing.id}`}
            className="text-slate-500 underline hover:text-navy"
          >
            {d.manage.viewPublic}
          </Link>
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-navy">{d.manage.statusTitle}</h2>
        <p className="mb-3 mt-1 text-sm text-slate-500">{d.manage.statusSub}</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_KEYS.map((s) => (
            <form key={s} action={updateStatus}>
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                disabled={listing.status === s}
                className={`btn !py-1.5 text-sm ${
                  listing.status === s ? "btn-outline opacity-50" : "btn-navy"
                }`}
              >
                {d.statuses[s]}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-navy">{d.manage.editTitle}</h2>
        <div className="mt-3">
          <ManageEditForm listing={listing} token={token} d={d} />
        </div>
      </section>

      <section className="rounded-lg border border-red-200 bg-white p-5">
        <h2 className="font-bold text-red-700">{d.manage.deleteTitle}</h2>
        <p className="mb-3 mt-1 text-sm text-slate-500">{d.manage.deleteSub}</p>
        <form
          action={deleteListing}
          className="flex flex-wrap items-center gap-3"
        >
          <input type="hidden" name="token" value={token} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="confirm" className="h-4 w-4" />
            {d.manage.imSure}
          </label>
          <button
            type="submit"
            className="btn !bg-red-600 !py-1.5 text-sm text-white hover:!bg-red-700"
          >
            {d.manage.deleteBtn}
          </button>
        </form>
      </section>

      <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        <p className="font-semibold text-navy">{d.manage.privateLink}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <code className="break-all rounded bg-white px-2 py-1 text-xs">
            {manageUrl}
          </code>
          <CopyButton
            text={manageUrl}
            label={d.manage.copyLink}
            copiedLabel={d.manage.copied}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">{d.manage.privateLinkNote}</p>
      </div>
    </div>
  );
}
