"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { FilmTrivia } from "@/types";
import { addTrivia } from "@/lib/trivia";
import { readLocalTrivia, writeLocalTrivia } from "@/lib/local-trivia";

type Props = {
  filmSlug: string;
  title: string;
  /** Scritte a mano in films.ts: sempre presenti, in testa. */
  staticItems: string[];
  initialUserTrivia: FilmTrivia[];
  isAuthed: boolean;
  demoMode: boolean;
};

/**
 * Curiosità sul film che salgono come i titoli di coda: quelle scritte a
 * mano in films.ts, seguite da quelle aggiunte dagli utenti. Si ferma al
 * passaggio del mouse, col focus da tastiera o dal bottone.
 */
export function CreditsScroll({
  filmSlug,
  title,
  staticItems,
  initialUserTrivia,
  isAuthed,
  demoMode,
}: Props) {
  const [paused, setPaused] = useState(false);
  const [userTrivia, setUserTrivia] = useState(initialUserTrivia);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!demoMode) return;
    const local = readLocalTrivia(filmSlug);
    if (local.length) setUserTrivia(local);
  }, [demoMode, filmSlug]);

  const items = [...staticItems, ...userTrivia.map((t) => t.text)];
  const duration = Math.max(18, items.length * 7);
  const locked = !demoMode && !isAuthed;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = text.trim();
    if (!trimmed) {
      setError("La curiosità non può essere vuota");
      return;
    }
    if (trimmed.length > 240) {
      setError("Massimo 240 caratteri");
      return;
    }

    if (demoMode) {
      const trivia: FilmTrivia = {
        id: crypto.randomUUID(),
        text: trimmed,
        createdAt: new Date().toISOString(),
      };
      const next = [...userTrivia, trivia];
      setUserTrivia(next);
      writeLocalTrivia(filmSlug, next);
      setText("");
      return;
    }

    startTransition(async () => {
      const res = await addTrivia(filmSlug, trimmed);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setUserTrivia((prev) => [...prev, res.trivia]);
      setText("");
    });
  }

  return (
    <section aria-labelledby="curiosita" className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="curiosita" className="font-display text-3xl font-extrabold uppercase text-white">
          Curiosità
        </h2>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="font-display text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white"
        >
          {paused ? "▶ riprendi" : "❚❚ pausa"}
        </button>
      </div>

      <div
        className={`relative mt-6 h-80 overflow-hidden border border-white/10 bg-gradient-to-b from-black to-ink-2 ${
          paused ? "credits-paused" : ""
        }`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        tabIndex={0}
        role="region"
        aria-label={`Curiosità su ${title}`}
      >
        <div
          className="credits-roll flex flex-col items-center gap-10 px-6 text-center"
          style={{ ["--credits-duration" as string]: `${duration}s` }}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.5em] text-marvel">
            {title}
          </p>
          {items.map((item, i) => (
            <p key={i} className="max-w-xl text-[15px] leading-relaxed text-white/80">
              {item}
            </p>
          ))}
          <p className="font-display text-xs font-bold uppercase tracking-[0.5em] text-white/30">
            fine
          </p>
        </div>

        {/* Sfumature sopra e sotto, come in sala. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink-2 to-transparent" />
      </div>

      {/* Stesso contenuto, leggibile senza animazione e dai lettori di schermo. */}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs uppercase tracking-widest text-white/40 hover:text-white">
          Leggi tutte le curiosità
        </summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </details>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-amber-400 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      {locked ? (
        <p className="mt-4 text-sm text-white/50">
          <Link href="/login" className="font-semibold text-white underline">
            Accedi
          </Link>{" "}
          per aggiungere una curiosità.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label
            htmlFor="new-trivia"
            className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50"
          >
            Aggiungi una curiosità — su produzione e carriera, non sulla vita privata degli
            interpreti
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              id="new-trivia"
              type="text"
              maxLength={240}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="es. Il film è stato girato in sei mesi tra Londra e Atlanta"
              className="min-w-[240px] flex-1 border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-marvel"
            />
            <button
              type="submit"
              disabled={pending || !text.trim()}
              className="skew-slab bg-marvel px-5 py-2.5 transition hover:bg-marvel-dark disabled:opacity-50"
            >
              <span className="font-display block text-sm font-bold uppercase tracking-wider text-white">
                Aggiungi
              </span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
