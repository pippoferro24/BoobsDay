"use client";

import { useEffect, useState } from "react";
import type { Film } from "@/types";
import { COVER_CHANGED_EVENT, coverStorageKey, type CoverChangedDetail } from "@/lib/local-covers";

type Props = {
  film: Film;
  demoMode: boolean;
  initialHasCustomCover: boolean;
};

/**
 * Etichetta "In copertina: personaggio — attrice" sotto il titolo: ha senso
 * solo finché la copertina è quella di default. Si nasconde da sola appena
 * qualcuno promuove un'immagine caricata, incluso in modalità demo dove
 * quella scelta vive solo in localStorage (vedi CoverArt).
 */
export function CoverCaption({ film, demoMode, initialHasCustomCover }: Props) {
  const [hasCustomCover, setHasCustomCover] = useState(initialHasCustomCover);

  useEffect(() => {
    if (!demoMode) return;
    try {
      if (localStorage.getItem(coverStorageKey(film.slug))) setHasCustomCover(true);
    } catch {
      /* localStorage non disponibile: resta l'etichetta di default. */
    }
  }, [demoMode, film.slug]);

  useEffect(() => {
    function onCoverChanged(e: Event) {
      const { slug } = (e as CustomEvent<CoverChangedDetail>).detail;
      if (slug === film.slug) setHasCustomCover(true);
    }
    window.addEventListener(COVER_CHANGED_EVENT, onCoverChanged);
    return () => window.removeEventListener(COVER_CHANGED_EVENT, onCoverChanged);
  }, [film.slug]);

  if (hasCustomCover) return null;

  return (
    <p className="mt-1 text-sm text-white/60">
      In copertina: {film.lead.character} — <span className="text-white/80">{film.lead.actress}</span>
    </p>
  );
}
