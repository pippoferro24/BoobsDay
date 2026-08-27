import Link from "next/link";
import { FILMS, DOOMSDAY_RELEASE } from "@/data/films";
import { posterFor } from "@/lib/assets";
import { getFilmCovers } from "@/lib/images";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE_NAME } from "@/lib/site";
import { FilmCard } from "@/components/FilmCard";
import { FilmCarousel } from "@/components/FilmCarousel";
import { PosterFan } from "@/components/PosterFan";
import { Countdown } from "@/components/Countdown";

const RELEASE_LABEL = new Date(DOOMSDAY_RELEASE).toLocaleDateString("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function HomePage() {
  const demoMode = !isSupabaseConfigured;
  const uploadedCovers = demoMode ? {} : await getFilmCovers();
  const covers = Object.fromEntries(
    FILMS.map((f) => [f.slug, uploadedCovers[f.slug] ?? posterFor(f.slug)])
  );

  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-ink">
        <div
          className="starfield absolute inset-y-0 right-0 hidden w-[68%] lg:block"
          style={{ clipPath: "polygon(26% 0, 100% 0, 100% 72%, 0 100%)" }}
        />
        <div className="starfield absolute inset-0 opacity-60 lg:hidden" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 lg:grid-cols-[minmax(0,460px)_1fr] lg:py-24">
          <div>
            <span className="skew-slab inline-block bg-marvel px-3 py-1">
              <span className="font-display block text-lg font-extrabold uppercase tracking-wider text-white">
                {SITE_NAME}
              </span>
            </span>

            <p className="font-display mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
              Disponibile ora
            </p>
            <h1 className="font-display mt-3 text-5xl font-extrabold uppercase leading-[0.92] text-white sm:text-6xl">
              Guarda tutto
              <br />
              prima di Doomsday
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
              I 15 titoli della watchlist ufficiale Marvel da recuperare prima di{" "}
              <em className="not-italic text-white">Avengers: Doomsday</em>, in sala il{" "}
              {RELEASE_LABEL}. Mancano <Countdown />.
            </p>

            <Link
              href={`/film/${FILMS[0].slug}`}
              className="skew-slab mt-8 inline-block bg-marvel px-7 py-3 transition hover:bg-marvel-dark"
            >
              <span className="font-display block text-base font-bold uppercase tracking-wider text-white">
                Inizia la maratona
              </span>
            </Link>
          </div>

          <PosterFan films={FILMS.slice(0, 5)} covers={covers} demoMode={demoMode} />
        </div>
      </section>

      {/* ---------- CAROSELLO ---------- */}
      <section className="relative bg-ink pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="-mt-10 bg-paper px-6 pb-10 pt-8 shadow-2xl sm:px-10"
            style={{ clipPath: "polygon(0 22px, 42px 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-display text-2xl font-extrabold uppercase text-ink">
                La watchlist ufficiale
              </h2>
              <p className="text-xs uppercase tracking-widest text-ink/50">
                {FILMS.length} titoli · ordine cronologico
              </p>
            </div>

            <FilmCarousel>
              {FILMS.map((film) => (
                <FilmCard
                  key={film.slug}
                  film={film}
                  coverSrc={covers[film.slug]}
                  demoMode={demoMode}
                />
              ))}
            </FilmCarousel>
          </div>

          {/* ---------- STRISCIA DATI ---------- */}
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden bg-white/10 sm:grid-cols-4">
            {[
              ["15", "titoli in lista"],
              ["3", "universi in collisione"],
              ["1", "Dottor Destino"],
              ["18.12.26", "uscita in sala"],
            ].map(([value, label]) => (
              <div key={label} className="bg-ink px-5 py-6">
                <dt className="font-display text-3xl font-extrabold text-white">{value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-white/45">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
