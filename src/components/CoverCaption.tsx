"use client";

import { useEffect, useState } from "react";
import type { Film } from "@/types";
import {
  COVER_CHANGED_EVENT,
  OPEN_GALLERY_EVENT,
  coverStorageKey,
  type CoverChangedDetail,
} from "@/lib/local-covers";

type Props = {
  film: Film;
  demoMode: boolean;
  initialHasCustomCover: boolean;
};

/**
 * Etichetta "In copertina: personaggio — attrice" sotto il titolo: cliccabile,
 * apre la galleria (CoverGallery) tramite OPEN_GALLERY_EVENT esattamente
 * come il click sul poster. Una volta impostata una copertina personalizzata
 * mostra invece "Cambia copertina", restando comunque un punto d'ingresso
 * alla galleria — incluso in modalità demo dove quella scelta vive solo in
 * localStorage (vedi CoverArt).
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

  function openGallery() {
    window.dispatchEvent(
      new CustomEvent<{ slug: string }>(OPEN_GALLERY_EVENT, { detail: { slug: film.slug } })
    );
  }

  return (
    <button
      type="button"
      onClick={openGallery}
      className="mt-1 block text-left text-sm text-white/60 underline decoration-white/25 underline-offset-2 hover:text-white hover:decoration-white/60"
    >
      {hasCustomCover ? (
        "Cambia copertina"
      ) : (
        <>
          In copertina: {film.lead.character} —{" "}
          <span className="text-white/80">{film.lead.actress}</span>
        </>
      )}
    </button>
  );
}
