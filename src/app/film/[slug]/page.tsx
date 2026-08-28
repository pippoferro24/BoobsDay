import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FILMS, getFilm } from "@/data/films";
import { posterFor, stillFor } from "@/lib/assets";
import { getFilmStats, getMyVotes } from "@/lib/ratings";
import { getFilmImages } from "@/lib/images";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { RatingPanel } from "@/components/RatingPanel";
import { CreditsScroll } from "@/components/CreditsScroll";
import { CoverGallery } from "@/components/CoverGallery";
import { CoverCaption } from "@/components/CoverCaption";
import { SITE_NAME } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FILMS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const film = getFilm((await params).slug);
  if (!film) return {};
  return {
    title: `${film.title} (${film.year}) — ${SITE_NAME}`,
    description: film.synopsis,
  };
}

export default async function FilmPage({ params }: Params) {
  const { slug } = await params;
  const film = getFilm(slug);
  if (!film) notFound();

  const [stats, myVotes, user, images] = await Promise.all([
    getFilmStats(slug),
    getMyVotes(slug),
    getUser(),
    getFilmImages(slug),
  ]);

  const demoMode = !isSupabaseConfigured;
  const hasCustomCover = images.some((img) => img.isCover);
  const coverSrc = images.find((img) => img.isCover)?.url ?? posterFor(slug);

  const still = stillFor(slug);
  const index = FILMS.findIndex((f) => f.slug === slug);
  const prev = FILMS[index - 1];
  const next = FILMS[index + 1];

  const releaseLabel = new Date(film.releaseDate).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="bg-ink pb-24">
      {/* ---------- TESTATA ---------- */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {still ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={still} alt="" className="h-full w-full object-cover object-center" />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(120deg, ${film.accent[0]} 0%, ${film.accent[1]} 70%)`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-10">
          <Link
            href="/"
            className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/50 hover:text-white"
          >
            ← Watchlist
          </Link>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end">
            <div
              className="w-40 shrink-0 overflow-hidden shadow-2xl ring-1 ring-white/15"
              style={{ aspectRatio: "2 / 3" }}
            >
              <CoverGallery
                film={film}
                initialSrc={coverSrc}
                initialImages={images}
                isAuthed={Boolean(user)}
                demoMode={demoMode}
                priority
              />
            </div>

            <div>
              <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-marvel">
                {film.kind === "serie" ? "Serie · Disney+" : "Film"}
              </span>
              <h1 className="font-display mt-2 text-4xl font-extrabold uppercase leading-[0.95] text-white sm:text-5xl">
                {film.title}
              </h1>
              <p className="mt-4 text-sm text-white/60">
                <strong className="font-semibold text-white">{releaseLabel}</strong> · {film.duration}
              </p>
              <CoverCaption film={film} demoMode={demoMode} initialHasCustomCover={hasCustomCover} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <p className="text-lg leading-relaxed text-white/80">{film.synopsis}</p>

        <div className="mt-6 border-l-2 border-marvel bg-white/5 px-5 py-4">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-marvel">
            Perché è in lista
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/75">{film.whyDoomsday}</p>
        </div>

        <RatingPanel
          filmSlug={film.slug}
          initialStats={stats}
          initialMyVotes={myVotes}
          isAuthed={Boolean(user)}
          demoMode={demoMode}
        />

        <CreditsScroll items={film.trivia} title={film.title} />

        {/* ---------- NAVIGAZIONE ---------- */}
        <nav className="mt-16 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/film/${prev.slug}`} className="group">
              <span className="text-xs uppercase tracking-widest text-white/40">Precedente</span>
              <span className="font-display block text-lg font-bold uppercase text-white group-hover:text-marvel">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/film/${next.slug}`} className="group sm:text-right">
              <span className="text-xs uppercase tracking-widest text-white/40">Successivo</span>
              <span className="font-display block text-lg font-bold uppercase text-white group-hover:text-marvel">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
