import Link from "next/link";
import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.about.title };
}
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { d } = await getI18n();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <LogoMark className="mx-auto h-16 w-16" />
        <h1 className="mt-3 text-3xl font-extrabold text-navy">
          {d.about.title}
        </h1>
      </div>

      <div className="space-y-4 text-base leading-relaxed text-slate-700">
        <p>
          <strong className="text-navy">{d.about.p1strong}</strong>{" "}
          {d.about.p1}
        </p>
        <p>{d.about.p2}</p>
        <p>{d.about.p3}</p>
        <p>
          {d.about.p4pre}{" "}
          <a
            href="https://ihe.institute"
            className="underline hover:text-navy"
            rel="noopener"
          >
            {d.footer.org}
          </a>
          {d.about.p4post}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-navy">{d.about.safetyTitle}</h2>
        <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-slate-600">
          <li>{d.about.safety1}</li>
          <li>{d.about.safety2}</li>
          <li>{d.about.safety3}</li>
          <li>
            {d.about.safety4pre}{" "}
            <a href="mailto:help@humanade.org" className="underline">
              help@humanade.org
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Link href="/post" className="btn btn-navy">
          {d.about.cta}
        </Link>
      </div>
    </div>
  );
}
