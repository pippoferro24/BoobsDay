import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE_NAME_BADGE, SITE_NAME_REST } from "@/lib/site";
import { SignOutButton } from "./SignOutButton";

export function SiteHeader({ userEmail }: { userEmail: string | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="skew-slab bg-marvel px-2 py-1">
            <span className="font-display block text-sm font-extrabold uppercase tracking-wider text-white">
              {SITE_NAME_BADGE}
            </span>
          </span>
          {SITE_NAME_REST && (
            <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              {SITE_NAME_REST}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!isSupabaseConfigured && (
            <span className="hidden rounded-full border border-amber-400/40 px-3 py-1 text-xs text-amber-300 sm:inline">
              modalità demo
            </span>
          )}
          {userEmail ? (
            <>
              <span className="hidden max-w-[180px] truncate text-white/60 sm:inline">
                {userEmail}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="font-display font-semibold uppercase tracking-wide text-white/80 hover:text-white"
            >
              Accedi / Registrati
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
