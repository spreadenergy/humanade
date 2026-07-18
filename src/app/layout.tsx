import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${d.siteTagline}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: d.siteDescription,
    openGraph: {
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${d.siteTagline}`,
      description: d.siteDescription,
      url: SITE_URL,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, d } = await getI18n();

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
            <Link
              href="/"
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
              <Link href="/browse" className="hover:text-navy">
                {d.nav.browse}
              </Link>
              <Link href="/map" className="hover:text-navy">
                {d.nav.map}
              </Link>
              <Link href="/about" className="hover:text-navy">
                {d.nav.about}
              </Link>
              <a
                href={`/api/locale?lang=${d.lang.switchCode}`}
                className="rounded border border-slate-300 px-1.5 py-0.5 text-xs uppercase hover:text-navy"
              >
                {d.lang.switchTo}
              </a>
            </nav>
            <div className="ms-auto flex items-center gap-2">
              <Link
                href="/post?type=NEED"
                className="btn btn-blue !px-3.5 !py-2 text-sm"
              >
                {d.cta.need}
              </Link>
              <Link
                href="/post?type=OFFER"
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
