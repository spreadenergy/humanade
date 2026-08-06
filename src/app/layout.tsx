import type { Metadata } from "next";
// Cookieless and without personal data, so the site needs no cookie
// notice — which matters for people who reach it on a borrowed phone.
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import "./globals.css";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getBarePath, getI18n, lp } from "@/lib/i18n";
import { OG_IMAGE, OG_IMAGE_ALT } from "@/lib/page-metadata";
import {
  jsonLdScript,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  const title = `${SITE_NAME} — ${d.siteTagline}`;
  const images = [
    { url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT },
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description: d.siteDescription,
    alternates: { canonical: SITE_URL },
    openGraph: {
      siteName: SITE_NAME,
      title,
      description: d.siteDescription,
      url: SITE_URL,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: d.siteDescription,
      images,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, d } = await getI18n();
  const barePath = await getBarePath();

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript([
              organizationJsonLd(d.siteDescription),
              webSiteJsonLd(),
            ]),
          }}
        />
        <Analytics />
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
            <Link
              href={lp(locale, "/")}
              className="flex items-center gap-2"
              aria-label="Humanade"
            >
              <LogoMark className="h-9 w-9" />
              <span className="flex flex-col leading-tight">
                <LogoWordmark className="text-xl" />
                <span className="hidden text-[11px] text-slate-500 sm:block">
                  {d.siteTagline}
                </span>
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link href={lp(locale, "/browse")} className="hover:text-navy">
                {d.nav.browse}
              </Link>
              <Link href={lp(locale, "/map")} className="hover:text-navy">
                {d.nav.map}
              </Link>
              <Link href={lp(locale, "/about")} className="hover:text-navy">
                {d.nav.about}
              </Link>
              {/* Points at this same page in the other language, so
                  switching never dumps anyone back on the home page. */}
              <Link
                href={lp(locale === "es" ? "en" : "es", barePath)}
                hrefLang={d.lang.switchCode}
                className="rounded border border-slate-300 px-1.5 py-0.5 text-xs uppercase hover:text-navy"
              >
                {d.lang.switchTo}
              </Link>
            </nav>
            <div className="ms-auto flex items-center gap-2">
              <Link
                href={lp(locale, "/post?type=NEED")}
                className="btn btn-blue !px-3.5 !py-2 text-sm"
              >
                {d.cta.need}
              </Link>
              <Link
                href={lp(locale, "/post?type=OFFER")}
                className="btn btn-green !px-3.5 !py-2 text-sm"
              >
                {d.cta.offer}
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-navy">Humanade</span> —{" "}
              {d.siteTagline}
            </p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link href={lp(locale, "/alerts")} className="underline hover:text-navy">
                🔔 {d.alerts.footerLink}
              </Link>
              <Link href={lp(locale, "/privacy")} className="underline hover:text-navy">
                {d.privacy.title}
              </Link>
            </p>
            <p>
              {d.footer.platformOf}{" "}
              <a
                href="https://ihe.institute"
                className="underline hover:text-navy"
                rel="noopener"
              >
                {d.footer.org}
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
