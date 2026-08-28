import type { FilmTrivia } from "@/types";

/** Curiosità aggiunte in modalità demo: una chiave per film, come la galleria immagini. */
export const triviaStorageKey = (slug: string) => `doomsday-prep:trivia:${slug}`;

export function readLocalTrivia(slug: string): FilmTrivia[] {
  try {
    const raw = localStorage.getItem(triviaStorageKey(slug));
    return raw ? (JSON.parse(raw) as FilmTrivia[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalTrivia(slug: string, items: FilmTrivia[]) {
  try {
    localStorage.setItem(triviaStorageKey(slug), JSON.stringify(items));
  } catch {
    /* ignorato */
  }
}
