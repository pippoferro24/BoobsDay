"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import type { FilmImage } from "@/types";
import { uploadFilmImage, setFilmCover } from "@/lib/images";
import {
  COVER_CHANGED_EVENT,
  coverStorageKey,
  galleryStorageKey,
  readFileAsDataUrl,
  type CoverChangedDetail,
} from "@/lib/local-covers";

type Props = {
  filmSlug: string;
  initialImages: FilmImage[];
  isAuthed: boolean;
  demoMode: boolean;
  /** Intestazione della sezione: presente nell'archivio in pagina, assente dentro la modale di CoverGallery. */
  heading?: string;
};

const DEMO_MAX_BYTES = 1.5 * 1024 * 1024;

/**
 * Archivio di immagini caricate dagli utenti per un film — restano lì
 * indefinitamente, nessuna scade o va persa — con la possibilità di
 * promuoverne una a copertina. In modalità demo tutto vive in localStorage
 * (nessun Supabase, nessun limite di un upload per persona); altrimenti passa
 * dai server action in lib/images.ts, dietro login come per i voti.
 */
export function FilmGallery({ filmSlug, initialImages, isAuthed, demoMode, heading }: Props) {
  const [images, setImages] = useState(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!demoMode) return;
    try {
      const raw = localStorage.getItem(galleryStorageKey(filmSlug));
      if (raw) setImages(JSON.parse(raw));
    } catch {
      /* localStorage non disponibile: galleria vuota per questa sessione. */
    }
  }, [demoMode, filmSlug]);

  const locked = !demoMode && !isAuthed;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void handleUpload(file);
  }

  async function handleUpload(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Il file deve essere un'immagine");
      return;
    }

    if (demoMode) {
      if (file.size > DEMO_MAX_BYTES) {
        setError("In modalità demo le immagini restano nel browser: usa un file sotto 1,5 MB");
        return;
      }
      setBusy(true);
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const image: FilmImage = {
          id: crypto.randomUUID(),
          url: dataUrl,
          isCover: false,
          createdAt: new Date().toISOString(),
        };
        const next = [image, ...images];
        setImages(next);
        localStorage.setItem(galleryStorageKey(filmSlug), JSON.stringify(next));
      } catch {
        setError("Non sono riuscito a leggere il file");
      } finally {
        setBusy(false);
      }
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      try {
        const res = await uploadFilmImage(filmSlug, formData);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        setImages((prev) => [res.image, ...prev]);
      } catch {
        // La Server Action può fallire prima ancora di essere eseguita
        // (rete, corpo della richiesta troppo grande): non far cadere la pagina.
        setError("Upload fallito. Riprova con un file più leggero o controlla la connessione.");
      }
    });
  }

  function handleSetCover(image: FilmImage) {
    setError(null);

    if (demoMode) {
      const next = images.map((i) => ({ ...i, isCover: i.id === image.id }));
      setImages(next);
      try {
        localStorage.setItem(coverStorageKey(filmSlug), image.url);
        localStorage.setItem(galleryStorageKey(filmSlug), JSON.stringify(next));
      } catch {
        /* ignorato */
      }
      window.dispatchEvent(
        new CustomEvent<CoverChangedDetail>(COVER_CHANGED_EVENT, {
          detail: { slug: filmSlug, url: image.url },
        })
      );
      return;
    }

    startTransition(async () => {
      try {
        const res = await setFilmCover(filmSlug, image.id);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        setImages((prev) => prev.map((i) => ({ ...i, isCover: i.id === image.id })));
        window.dispatchEvent(
          new CustomEvent<CoverChangedDetail>(COVER_CHANGED_EVENT, {
            detail: { slug: filmSlug, url: image.url },
          })
        );
      } catch {
        setError("Impostazione della copertina fallita. Riprova.");
      }
    });
  }

  return (
    <section
      aria-label={heading ? undefined : "Galleria immagini"}
      aria-labelledby={heading ? "archivio-immagini" : undefined}
      className={heading ? "mt-14" : "mt-6"}
    >
      {heading && (
        <h2
          id="archivio-immagini"
          className="font-display text-3xl font-extrabold uppercase text-white"
        >
          {heading}
        </h2>
      )}
      <p className={heading ? "mt-2 text-xs uppercase tracking-widest text-white/40" : "text-xs uppercase tracking-widest text-white/40"}>
        {demoMode
          ? "modalità demo · immagini locali"
          : "restano qui, chiunque sia loggato può caricarne e impostare la copertina"}
      </p>

      {locked && (
        <p className="mt-4 border-l-2 border-marvel bg-white/5 px-4 py-3 text-sm text-white/70">
          <Link href="/login" className="font-semibold text-white underline">
            Accedi
          </Link>{" "}
          per caricare immagini e scegliere la copertina.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-amber-400 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      {!locked && (
        <label className="skew-slab mt-6 inline-block cursor-pointer bg-marvel px-6 py-3 transition hover:bg-marvel-dark has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
          <span className="font-display block text-sm font-bold uppercase tracking-wider text-white">
            {busy || pending ? "Carico..." : "Carica immagine"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={busy || pending}
            className="sr-only"
          />
        </label>
      )}

      {images.length === 0 ? (
        <p className="mt-6 text-sm text-white/40">Nessuna immagine caricata per questo titolo, per ora.</p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((image) => (
            <div key={image.id} className="group relative overflow-hidden bg-ink-2 ring-1 ring-white/10">
              <div style={{ aspectRatio: "2 / 3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-full w-full object-cover" />
              </div>

              {image.isCover && (
                <span className="font-display absolute left-0 top-0 bg-marvel px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  Copertina
                </span>
              )}

              {!locked && !image.isCover && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleSetCover(image)}
                  className="absolute inset-x-0 bottom-0 bg-black/70 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                >
                  Imposta come copertina
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
