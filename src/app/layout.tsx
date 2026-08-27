import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { getUser } from "@/lib/supabase/server";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — la watchlist prima di Avengers: Doomsday`,
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ink">
        <SiteHeader userEmail={user?.email ?? null} />
        {children}
        <footer className="border-t border-white/10 bg-ink px-6 py-10 text-sm text-white/40">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Progetto fan-made non affiliato a Marvel Studios o The Walt Disney Company.
              Titoli e personaggi appartengono ai rispettivi proprietari.
            </p>
            <Link href="/" className="hover:text-white">
              {SITE_NAME}
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
