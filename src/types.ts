/** Lo slug è la chiave della categoria: in supabase/schema.sql è la primary key di public.categories. */
export type Category = {
  slug: string;
  label: string;
  hint: string;
  sortOrder: number;
};

/**
 * Le categorie di partenza: seminano public.categories in supabase/schema.sql
 * e coprono la modalità demo senza Supabase. Chiunque sia loggato può
 * aggiungerne altre e riordinarle da interfaccia (vedi RatingPanel) — non
 * sono più un elenco fisso.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { slug: "trama", label: "Trama", hint: "Regge la storia?", sortOrder: 1 },
  { slug: "personaggi", label: "Personaggi", hint: "Scritti e interpretati bene?", sortOrder: 2 },
  { slug: "azione", label: "Azione", hint: "Combattimenti e set piece", sortOrder: 3 },
  { slug: "colonna_sonora", label: "Colonna sonora", hint: "Musiche e sound design", sortOrder: 4 },
  { slug: "doomsday", label: "Rilevanza Doomsday", hint: "Quanto serve averlo visto", sortOrder: 5 },
];

export type Film = {
  slug: string;
  title: string;
  year: number;
  /** ISO date, uscita originale in sala (o su Disney+ per le serie). */
  releaseDate: string;
  kind: "film" | "serie";
  /** Durata in minuti, oppure descrizione episodi per le serie. */
  duration: string;
  /** Protagonista femminile del titolo: la copertina della card. */
  lead: { character: string; actress: string };
  /** Due colori HEX per il poster generato quando manca l'immagine reale. */
  accent: [string, string];
  synopsis: string;
  /** Perché è nella watchlist ufficiale pre-Doomsday. */
  whyDoomsday: string;
  /** Curiosità scorrevoli in stile titoli di coda. */
  trivia: string[];
};

export type FilmStat = {
  category: string;
  average: number;
  votes: number;
};

/** Immagine caricata da un utente per un film, eventualmente promossa a copertina. */
export type FilmImage = {
  id: string;
  url: string;
  isCover: boolean;
  createdAt: string;
};
