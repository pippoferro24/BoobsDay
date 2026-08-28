"use client";

import { useEffect, useState } from "react";
import type { Film, FilmImage } from "@/types";
import { CoverArt } from "./CoverArt";
import { FilmGallery } from "./FilmGallery";
import { OPEN_GALLERY_EVENT, type OpenGalleryDetail } from "@/lib/local-covers";

type Props = {
  film: Film;
  initialSrc: string | null;
  initialImages: FilmImage[];
  isAuthed: boolean;
  demoMode: boolean;
  priority?: boolean;
};

/**
 * Poster cliccabile: apre la galleria immagini in una finestra sopra la
 * pagina, invece di dover scorrere fino alla sezione in fondo. Il click
 * sul nome dell'attrice (CoverCaption) apre la stessa finestra tramite
 * OPEN_GALLERY_EVENT, da un punto diverso della pagina.
 */
export function CoverGallery({
  film,
  initialSrc,
  initialImages,
  isAuthed,
  demoMode,
  priority,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpenGallery(e: Event) {
      const { slug } = (e as CustomEvent<OpenGalleryDetail>).detail;
      if (slug === film.slug) setOpen(true);
    }
    window.addEventListener(OPEN_GALLERY_EVENT, onOpenGallery);
    return () => window.removeEventListener(OPEN_GALLERY_EVENT, onOpenGallery);
  }, [film.slug]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group relative block h-full w-full text-left"
      >
        <CoverArt film={film} initialSrc={initialSrc} demoMode={demoMode} priority={priority} />
        <span className="pointer-events-none absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white/90 opacity-90 transition group-hover:opacity-100">
          ✎
        </span>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/60 group-hover:opacity-100">
          <span className="font-display px-2 text-center text-xs font-bold uppercase tracking-widest text-white">
            Cambia copertina
          </span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galleria immagini — ${film.title}`}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-10 sm:pt-16"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-ink-2 p-6 ring-1 ring-white/10 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-marvel">
                  {film.title}
                </p>
                <p className="mt-1 text-sm text-white/50">Scegli o carica una copertina</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi"
                className="shrink-0 text-2xl leading-none text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <FilmGallery
              filmSlug={film.slug}
              initialImages={initialImages}
              isAuthed={isAuthed}
              demoMode={demoMode}
            />
          </div>
        </div>
      )}
    </>
  );
}
