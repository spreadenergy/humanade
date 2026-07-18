import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL, STATUSES, STATUS_KEYS } from "@/lib/constants";
import { StatusBadge, TypeBadge } from "@/components/Badges";
import { CopyButton } from "@/components/CopyButton";
import { ManageEditForm } from "@/components/ManageEditForm";
import { deleteListing, updateStatus } from "./actions";

export const metadata: Metadata = {
  title: "Manage your listing",
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
            🎉 Your listing is live!
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            <strong>Save this private link.</strong> It&apos;s the only way to
            edit, mark fulfilled, or close your listing later — there are no
            accounts or passwords on Humanade.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="break-all rounded bg-white px-2 py-1 text-xs text-navy">
              {manageUrl}
            </code>
            <CopyButton text={manageUrl} />
          </div>
        </div>
      )}
      {sp.saved && (
        <div className="rounded-lg border border-brand-green bg-green-50 p-3 text-sm text-brand-green-dark">
          ✓ Changes saved.
        </div>
      )}
      {sp.error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Some fields were invalid and the update was not saved. Check the form
          below — every listing needs a title, details, location, your name,
          and at least one contact channel.
        </div>
      )}
      {sp.confirmDelete && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          To delete, tick the confirmation box next to the delete button.
        </div>
      )}

      <header>
        <p className="text-sm text-slate-500">Managing your listing</p>
        <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-extrabold text-navy">
          {listing.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <TypeBadge type={listing.type} />
          <StatusBadge status={listing.status} />
        </div>
        <p className="mt-2 text-sm">
          <Link
            href={`/listing/${listing.id}`}
            className="text-slate-500 underline hover:text-navy"
          >
            View public listing →
          </Link>
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-navy">Update status</h2>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Keeping status current sends helpers where they&apos;re still needed.
        </p>
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
                {STATUSES[s].label}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-navy">Edit listing</h2>
        <div className="mt-3">
          <ManageEditForm listing={listing} token={token} />
        </div>
      </section>

      <section className="rounded-lg border border-red-200 bg-white p-5">
        <h2 className="font-bold text-red-700">Delete listing</h2>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Permanently removes the listing. If the need was met, prefer marking
          it <strong>Fulfilled</strong> instead.
        </p>
        <form action={deleteListing} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="token" value={token} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="confirm" className="h-4 w-4" />
            I&apos;m sure
          </label>
          <button
            type="submit"
            className="btn !bg-red-600 !py-1.5 text-sm text-white hover:!bg-red-700"
          >
            Delete permanently
          </button>
        </form>
      </section>

      <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        <p className="font-semibold text-navy">Your private link</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <code className="break-all rounded bg-white px-2 py-1 text-xs">
            {manageUrl}
          </code>
          <CopyButton text={manageUrl} />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Anyone with this link can manage this listing. Don&apos;t share it
          publicly.
        </p>
      </div>
    </div>
  );
}
