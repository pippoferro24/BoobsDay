/**
 * Chiavi e utilità condivise tra CoverArt e FilmGallery per la modalità demo:
 * senza Supabase, copertina e galleria vivono solo nel browser di chi guarda.
 */
export const coverStorageKey = (slug: string) => `doomsday-prep:cover:${slug}`;
export const galleryStorageKey = (slug: string) => `doomsday-prep:gallery:${slug}`;

/** Notifica in tempo reale, nella stessa pagina, quando cambia la copertina. */
export const COVER_CHANGED_EVENT = "doomsday-prep:cover-changed";

export type CoverChangedDetail = { slug: string; url: string };

/** Apre la galleria da un punto qualsiasi della pagina (es. click sul nome dell'attrice). */
export const OPEN_GALLERY_EVENT = "doomsday-prep:open-gallery";

export type OpenGalleryDetail = { slug: string };

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Lettura del file fallita"));
    reader.readAsDataURL(file);
  });
}
