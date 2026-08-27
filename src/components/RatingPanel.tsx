"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { CATEGORIES, type CategoryId, type FilmStat } from "@/types";
import { submitVote } from "@/lib/ratings";

type Props = {
  filmSlug: string;
  initialStats: FilmStat[];
  initialMyVotes: Partial<Record<CategoryId, number>>;
  isAuthed: boolean;
  demoMode: boolean;
};

const storageKey = (slug: string) => `doomsday-prep:votes:${slug}`;

/**
 * Ricalcola la media come se il voto fosse già registrato, così la barra
 * si muove subito. Il valore reale arriva al refresh successivo.
 */
function applyVote(stat: FilmStat, previous: number | undefined, next: number): FilmStat {
  const total = stat.average * stat.votes;
  if (previous === undefined) {
    const votes = stat.votes + 1;
    return { ...stat, votes, average: Math.round(((total + next) / votes) * 10) / 10 };
  }
  const votes = Math.max(stat.votes, 1);
  return {
    ...stat,
    votes,
    average: Math.round(((total - previous + next) / votes) * 10) / 10,
  };
}

export function RatingPanel({
  filmSlug,
  initialStats,
  initialMyVotes,
  isAuthed,
  demoMode,
}: Props) {
  const [stats, setStats] = useState(initialStats);
  const [myVotes, setMyVotes] = useState(initialMyVotes);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // In demo i voti vivono solo nel browser di chi guarda.
  useEffect(() => {
    if (!demoMode) return;
    try {
      const raw = localStorage.getItem(storageKey(filmSlug));
      if (raw) setMyVotes(JSON.parse(raw));
    } catch {
      /* localStorage non disponibile: si vota comunque, senza persistenza. */
    }
  }, [demoMode, filmSlug]);

  function vote(category: CategoryId, score: number) {
    setError(null);
    const previous = myVotes[category];
    if (previous === score) return;

    setStats((prev) =>
      prev.map((s) => (s.category === category ? applyVote(s, previous, score) : s))
    );
    const nextVotes = { ...myVotes, [category]: score };
    setMyVotes(nextVotes);

    if (demoMode) {
      try {
        localStorage.setItem(storageKey(filmSlug), JSON.stringify(nextVotes));
      } catch {
        /* ignorato */
      }
      return;
    }

    startTransition(async () => {
      const res = await submitVote(filmSlug, category, score);
      if (!res.ok) {
        setError(res.error);
        setStats(initialStats);
        setMyVotes(myVotes);
      }
    });
  }

  const locked = !demoMode && !isAuthed;

  return (
    <section aria-labelledby="statistiche" className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="statistiche" className="font-display text-3xl font-extrabold uppercase text-white">
          Statistiche
        </h2>
        <p className="text-xs uppercase tracking-widest text-white/40">
          {demoMode ? "modalità demo · voti locali" : "un voto per categoria, modificabile"}
        </p>
      </div>

      {locked && (
        <p className="mt-4 border-l-2 border-marvel bg-white/5 px-4 py-3 text-sm text-white/70">
          <Link href="/login" className="font-semibold text-white underline">
            Accedi
          </Link>{" "}
          per votare. Le medie qui sotto restano visibili a tutti.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-amber-400 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {CATEGORIES.map((category) => {
          const stat = stats.find((s) => s.category === category.id) ?? {
            category: category.id,
            average: 0,
            votes: 0,
          };
          const mine = myVotes[category.id];

          return (
            <div key={category.id} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white">
                    {category.label}
                  </h3>
                  <p className="text-xs text-white/40">{category.hint}</p>
                </div>
                <p className="text-sm text-white/50">
                  <span className="font-display text-2xl font-extrabold text-white">
                    {stat.average ? stat.average.toFixed(1) : "—"}
                  </span>
                  <span className="ml-1">/10</span>
                  <span className="ml-2 text-xs">({stat.votes} voti)</span>
                </p>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden bg-white/10">
                <div
                  className="h-full bg-marvel transition-[width] duration-500"
                  style={{ width: `${(stat.average / 10) * 100}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => {
                  const active = mine === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      disabled={locked || pending}
                      onClick={() => vote(category.id, score)}
                      aria-label={`${category.label}: vota ${score} su 10`}
                      aria-pressed={active}
                      className={[
                        "font-display h-9 w-9 text-sm font-bold transition",
                        active
                          ? "bg-marvel text-white"
                          : "bg-white/8 text-white/60 hover:bg-white/20 hover:text-white",
                        locked ? "cursor-not-allowed opacity-40" : "",
                      ].join(" ")}
                    >
                      {score}
                    </button>
                  );
                })}
                {mine !== undefined && (
                  <span className="ml-2 self-center text-xs uppercase tracking-widest text-white/40">
                    il tuo voto: {mine}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
