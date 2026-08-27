"use client";

import { useEffect, useState } from "react";
import type { Film } from "@/types";
import { PosterArt } from "./PosterArt";
import { COVER_CHANGED_EVENT, coverStorageKey, type CoverChangedDetail } from "@/lib/local-covers";

type Props = {
  film: Film;
  /** Copertina già risolta lato server: poster caricato in public/ o quello promosso su Supabase. */
  initialSrc: string | null;
  demoMode: boolean;
  priority?: boolean;
};

/**
 * Poster del film che si aggiorna quando qualcuno imposta una nuova copertina
 * dalla galleria di FilmGallery, senza aspettare un refresh della pagina.
 * In modalità demo la copertina vive solo nel browser: la legge da
 * localStorage dopo il render server, come fa RatingPanel per i voti.
 */
export function CoverArt({ film, initialSrc, demoMode, priority }: Props) {
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    if (!demoMode) return;
    try {
      const stored = localStorage.getItem(coverStorageKey(film.slug));
      if (stored) setSrc(stored);
    } catch {
      /* localStorage non disponibile: resta la copertina server. */
    }
  }, [demoMode, film.slug]);

  useEffect(() => {
    function onCoverChanged(e: Event) {
      const { slug, url } = (e as CustomEvent<CoverChangedDetail>).detail;
      if (slug === film.slug) setSrc(url);
    }
    window.addEventListener(COVER_CHANGED_EVENT, onCoverChanged);
    return () => window.removeEventListener(COVER_CHANGED_EVENT, onCoverChanged);
  }, [film.slug]);

  return <PosterArt film={film} src={src} priority={priority} />;
}
