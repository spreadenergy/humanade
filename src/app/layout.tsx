import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
};

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="Humanade home">
          <LogoMark className="h-9 w-9" />
          <span className="flex flex-col leading-tight">
            <LogoWordmark className="text-xl" />
            <span className="hidden text-[11px] text-slate-500 sm:block">
              {SITE_TAGLINE}
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/browse" className="hover:text-navy">
            Browse
          </Link>
          <Link href="/map" className="hover:text-navy">
            Map
          </Link>
          <Link href="/about" className="hover:text-navy">
            About
          </Link>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <Link href="/post?type=NEED" className="btn btn-blue !px-3.5 !py-2 text-sm">
            I Need Help
          </Link>
          <Link href="/post?type=OFFER" className="btn btn-green !px-3.5 !py-2 text-sm">
            I Can Help
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-navy">Humanade</span> —{" "}
          {SITE_TAGLINE}
        </p>
        <p>
          A platform of the{" "}
          <a
            href="https://ihe.institute"
            className="underline hover:text-navy"
            rel="noopener"
          >
            Institute for Human Evolution
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
