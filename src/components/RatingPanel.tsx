"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { Category, FilmStat } from "@/types";
import { addCategory, reorderCategory, submitVote } from "@/lib/ratings";
import { slugify } from "@/lib/slug";
import { readLocalCategories, writeLocalCategories } from "@/lib/local-categories";

type Props = {
  filmSlug: string;
  initialStats: FilmStat[];
  initialMyVotes: Partial<Record<string, number>>;
  initialCategories: Category[];
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
  initialCategories,
  isAuthed,
  demoMode,
}: Props) {
  const [stats, setStats] = useState(initialStats);
  const [myVotes, setMyVotes] = useState(initialMyVotes);
  const [categories, setCategories] = useState(initialCategories);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [newLabel, setNewLabel] = useState("");
  const [newHint, setNewHint] = useState("");

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

  // In demo anche le categorie (globali, non per film) vivono nel browser:
  // se qualcuno ne ha già aggiunte o riordinate, sostituiscono quelle di
  // partenza, e per le nuove serve una riga di statistiche vuota.
  useEffect(() => {
    if (!demoMode) return;
    const local = readLocalCategories();
    if (!local || local.length === 0) return;
    setCategories(local);
    setStats((prev) => {
      const missing = local
        .filter((c) => !prev.some((s) => s.category === c.slug))
        .map((c) => ({ category: c.slug, average: 0, votes: 0 }));
      return missing.length ? [...prev, ...missing] : prev;
    });
  }, [demoMode]);

  function vote(category: string, score: number) {
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

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = newLabel.trim();
    if (!trimmed) {
      setError("Il nome della categoria non può essere vuoto");
      return;
    }

    if (demoMode) {
      const slug = slugify(trimmed);
      if (!slug) {
        setError("Nome non valido: usa lettere o numeri");
        return;
      }
      if (categories.some((c) => c.slug === slug)) {
        setError("Esiste già una categoria con questo nome");
        return;
      }
      const nextOrder = categories.reduce((max, c) => Math.max(max, c.sortOrder), 0) + 1;
      const category: Category = {
        slug,
        label: trimmed,
        hint: newHint.trim().slice(0, 80),
        sortOrder: nextOrder,
      };
      const next = [...categories, category];
      setCategories(next);
      setStats((prev) => [...prev, { category: slug, average: 0, votes: 0 }]);
      writeLocalCategories(next);
      setNewLabel("");
      setNewHint("");
      return;
    }

    startTransition(async () => {
      const res = await addCategory(trimmed, newHint);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setCategories((prev) => [...prev, res.category]);
      setStats((prev) => [...prev, { category: res.category.slug, average: 0, votes: 0 }]);
      setNewLabel("");
      setNewHint("");
    });
  }

  function handleReorder(slug: string, direction: "up" | "down") {
    setError(null);
    const idx = categories.findIndex((c) => c.slug === slug);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= categories.length) return;

    const previous = categories;
    const next = [...categories];
    next[idx] = previous[swapIdx];
    next[swapIdx] = previous[idx];
    setCategories(next);

    if (demoMode) {
      writeLocalCategories(next);
      return;
    }

    startTransition(async () => {
      const res = await reorderCategory(slug, previous[swapIdx].slug);
      if (!res.ok) {
        setError(res.error);
        setCategories(previous);
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
        {categories.map((category, index) => {
          const stat = stats.find((s) => s.category === category.slug) ?? {
            category: category.slug,
            average: 0,
            votes: 0,
          };
          const mine = myVotes[category.slug];

          return (
            <div key={category.slug} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex items-start gap-2">
                  {!locked && (
                    <div className="mt-1 flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={pending || index === 0}
                        onClick={() => handleReorder(category.slug, "up")}
                        aria-label={`Sposta ${category.label} più in alto`}
                        className="leading-none text-white/30 hover:text-white disabled:pointer-events-none disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={pending || index === categories.length - 1}
                        onClick={() => handleReorder(category.slug, "down")}
                        aria-label={`Sposta ${category.label} più in basso`}
                        className="leading-none text-white/30 hover:text-white disabled:pointer-events-none disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      {category.label}
                    </h3>
                    {category.hint && <p className="text-xs text-white/40">{category.hint}</p>}
                  </div>
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
                      onClick={() => vote(category.slug, score)}
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

      {!locked && (
        <form onSubmit={handleAddCategory} className="mt-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[160px] flex-1">
            <label
              htmlFor="new-category-label"
              className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50"
            >
              Nuova categoria
            </label>
            <input
              id="new-category-label"
              type="text"
              maxLength={40}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="es. Sceneggiatura"
              className="mt-2 w-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-marvel"
            />
          </div>
          <div className="min-w-[160px] flex-1">
            <label
              htmlFor="new-category-hint"
              className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50"
            >
              Sottotitolo (opzionale)
            </label>
            <input
              id="new-category-hint"
              type="text"
              maxLength={80}
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              placeholder="es. Battute e dialoghi"
              className="mt-2 w-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-marvel"
            />
          </div>
          <button
            type="submit"
            disabled={pending || !newLabel.trim()}
            className="skew-slab bg-marvel px-5 py-2.5 transition hover:bg-marvel-dark disabled:opacity-50"
          >
            <span className="font-display block text-sm font-bold uppercase tracking-wider text-white">
              Aggiungi
            </span>
          </button>
        </form>
      )}
    </section>
  );
}
