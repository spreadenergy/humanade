import Link from "next/link";
import type { Metadata } from "next";

import { getI18n, lp } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, d } = await getI18n();
  return pageMetadata({
    title: d.privacy.title,
    description: d.privacy.metaDescription,
    path: "/privacy",
    locale,
  });
}

export const dynamic = "force-dynamic";

/**
 * The site collects names, phone numbers and locations from people in a
 * disaster area and publishes them, and said nothing anywhere about what
 * happens to any of it. This page describes what the code actually does —
 * no more, so it stays true.
 */
export default async function PrivacyPage() {
  const { locale, d } = await getI18n();
  const t = d.privacy;

  const sections: [string, string[]][] = [
    [t.h1, [t.p1]],
    [t.publicTitle, [t.publicIntro, t.publicList, t.publicNote]],
    [t.privateTitle, [t.privateBody]],
    [t.keepTitle, [t.keepBody]],
    [t.removeTitle, [t.removeBody]],
    [t.measureTitle, [t.measureBody]],
    [t.safetyTitle, [t.safetyBody]],
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{t.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.updated}</p>
      </div>

      {sections.map(([heading, paragraphs]) => (
        <section key={heading} className="space-y-3">
          <h2 className="text-xl font-bold text-navy">{heading}</h2>
          {paragraphs.map((p) => (
            <p key={p} className="leading-relaxed text-slate-700">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold text-navy">{t.contactTitle}</h2>
        <p className="leading-relaxed text-slate-700">
          {t.contactBody}{" "}
          <a href="mailto:help@humanade.org" className="underline">
            help@humanade.org
          </a>
          .
        </p>
        <p className="text-sm text-slate-500">
          <Link href={lp(locale, "/about")} className="underline hover:text-navy">
            {t.aboutLink}
          </Link>
        </p>
      </section>
    </div>
  );
}
