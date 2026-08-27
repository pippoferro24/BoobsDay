"use client";

import { useState } from "react";

/**
 * Curiosità sul film che salgono come i titoli di coda.
 * Si ferma al passaggio del mouse, col focus da tastiera o dal bottone.
 */
export function CreditsScroll({ items, title }: { items: string[]; title: string }) {
  const [paused, setPaused] = useState(false);
  const duration = Math.max(18, items.length * 7);

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
          {items.map((item) => (
            <p key={item} className="max-w-xl text-[15px] leading-relaxed text-white/80">
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
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
