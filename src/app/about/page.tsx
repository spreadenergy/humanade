import Link from "next/link";
import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <LogoMark className="mx-auto h-16 w-16" />
        <h1 className="mt-3 text-3xl font-extrabold text-navy">
          About Humanade
        </h1>
      </div>

      <div className="space-y-4 text-base leading-relaxed text-slate-700">
        <p>
          <strong className="text-navy">
            Humanade is the simplest way to ask for help or offer help.
          </strong>{" "}
          It connects people who need something — water, food, medicine,
          shelter, transport, a professional, a volunteer — with people,
          organizations, and businesses who can provide it.
        </p>
        <p>
          There are no accounts, no feeds, and no fundraising campaigns. You
          post what you need or what you can give, people contact you directly
          by phone, WhatsApp, or email, and you close the listing when
          it&apos;s resolved. Think of it as practical infrastructure:
          a public noticeboard for human needs and human solutions.
        </p>
        <p>
          Humanade is built to work where it&apos;s needed most — disaster
          zones, underserved communities, and places with weak or unstable
          internet. Pages are lightweight, browsing works on basic phones, and
          nothing requires an app store.
        </p>
        <p>
          Humanade is a platform of the{" "}
          <a
            href="https://ihe.institute"
            className="underline hover:text-navy"
            rel="noopener"
          >
            Institute for Human Evolution
          </a>
          , a nonprofit organization. The platform is free to use, for
          everyone, everywhere.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-navy">Safety guidelines</h2>
        <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-slate-600">
          <li>Meet in public places when exchanging goods where possible.</li>
          <li>Never send money to someone you cannot verify.</li>
          <li>Don&apos;t share more personal information than needed.</li>
          <li>
            Report suspicious listings to{" "}
            <a href="mailto:help@humanade.org" className="underline">
              help@humanade.org
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Link href="/post" className="btn btn-navy">
          Post a need or an offer
        </Link>
      </div>
    </div>
  );
}
