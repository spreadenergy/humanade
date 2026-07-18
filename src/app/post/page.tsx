import Link from "next/link";
import type { Metadata } from "next";
import { PostForm } from "@/components/PostForm";
import { TYPE_KEYS, type ListingType } from "@/lib/constants";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.post.chooseTitle };
}

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const { d } = await getI18n();
  const valid = TYPE_KEYS.includes(type as ListingType)
    ? (type as ListingType)
    : null;
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
    /[^\d]/g,
    "",
  );

  if (!valid) {
    return (
      <div className="mx-auto max-w-2xl pt-8 text-center">
        <h1 className="text-3xl font-extrabold text-navy">
          {d.post.chooseTitle}
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/post?type=NEED"
            className="rounded-xl bg-brand-blue p-8 text-white shadow transition-colors hover:bg-brand-blue-dark"
          >
            <span className="block text-2xl font-extrabold">{d.cta.need}</span>
            <span className="mt-1 block text-sm text-blue-50">
              {d.post.needCardDesc}
            </span>
          </Link>
          <Link
            href="/post?type=OFFER"
            className="rounded-xl bg-brand-green p-8 text-white shadow transition-colors hover:bg-brand-green-dark"
          >
            <span className="block text-2xl font-extrabold">{d.cta.offer}</span>
            <span className="mt-1 block text-sm text-green-50">
              {d.post.offerCardDesc}
            </span>
          </Link>
        </div>
        {waNumber && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-navy">
              {d.post.whatsappTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{d.post.whatsappDesc}</p>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent("NECESITO ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green mt-4"
            >
              {d.post.whatsappBtn}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link href="/post" className="text-slate-500 underline hover:text-navy">
          {d.post.changeType}
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-navy">
        {valid === "NEED" ? d.cta.need : d.cta.offer}
      </h1>
      <p className="mb-6 mt-1 text-slate-600">
        {valid === "NEED" ? d.post.needIntro : d.post.offerIntro}
      </p>
      <PostForm type={valid} d={d} />
    </div>
  );
}
