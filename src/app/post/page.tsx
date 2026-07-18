import Link from "next/link";
import type { Metadata } from "next";
import { PostForm } from "@/components/PostForm";
import { TYPE_KEYS, type ListingType } from "@/lib/constants";

export const metadata: Metadata = { title: "Post a need or offer" };

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const valid = TYPE_KEYS.includes(type as ListingType)
    ? (type as ListingType)
    : null;

  if (!valid) {
    return (
      <div className="mx-auto max-w-2xl pt-8 text-center">
        <h1 className="text-3xl font-extrabold text-navy">
          What would you like to post?
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/post?type=NEED"
            className="rounded-xl bg-brand-blue p-8 text-white shadow transition-colors hover:bg-brand-blue-dark"
          >
            <span className="block text-2xl font-extrabold">I Need Help</span>
            <span className="mt-1 block text-sm text-blue-50">
              Post a request for yourself, your family, or your community.
            </span>
          </Link>
          <Link
            href="/post?type=OFFER"
            className="rounded-xl bg-brand-green p-8 text-white shadow transition-colors hover:bg-brand-green-dark"
          >
            <span className="block text-2xl font-extrabold">I Can Help</span>
            <span className="mt-1 block text-sm text-green-50">
              Offer supplies, skills, space, transport, or time.
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link href="/post" className="text-slate-500 underline hover:text-navy">
          ← Change type
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-navy">
        {valid === "NEED" ? "I Need Help" : "I Can Help"}
      </h1>
      <p className="mb-6 mt-1 text-slate-600">
        {valid === "NEED"
          ? "Describe what you need. Keep it concrete so helpers know exactly how to respond."
          : "Describe what you can provide. Keep it concrete so people know exactly what to ask for."}
      </p>
      <PostForm type={valid} />
    </div>
  );
}
