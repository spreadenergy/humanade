import Link from "next/link";
import type { Metadata } from "next";

import { RecoverForm } from "@/components/RecoverForm";
import { emailEnabled } from "@/lib/email";
import { getI18n, lp } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, d } = await getI18n();
  return {
    ...pageMetadata({
      title: d.recover.title,
      description: d.recover.metaDescription,
      path: "/manage/recover",
    locale,
    }),
    // Nothing under /manage belongs in an index.
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function RecoverPage() {
  const { locale, d } = await getI18n();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{d.recover.title}</h1>
        <p className="mt-2 leading-relaxed text-slate-600">{d.recover.intro}</p>
      </div>

      {emailEnabled() ? (
        <RecoverForm d={d} />
      ) : (
        <div className="rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
          {d.recover.unavailable}{" "}
          <a href="mailto:help@humanade.org" className="underline">
            help@humanade.org
          </a>
          .
        </div>
      )}

      <p className="text-sm text-slate-500">{d.recover.onlyEmail}</p>

      <p className="text-sm">
        <Link href={lp(locale, "/browse")} className="underline hover:text-navy">
          {d.listing.back}
        </Link>
      </p>
    </div>
  );
}
