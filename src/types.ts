export type CategoryId =
  | "trama"
  | "personaggi"
  | "azione"
  | "colonna_sonora"
  | "doomsday";

export type Category = {
  id: CategoryId;
  label: string;
  hint: string;
};

/** Le cinque metriche votabili. Ordine = ordine di rendering nella scheda film. */
export const CATEGORIES: Category[] = [
  { id: "trama", label: "Trama", hint: "Regge la storia?" },
  { id: "personaggi", label: "Personaggi", hint: "Scritti e interpretati bene?" },
  { id: "azione", label: "Azione", hint: "Combattimenti e set piece" },
  { id: "colonna_sonora", label: "Colonna sonora", hint: "Musiche e sound design" },
  { id: "doomsday", label: "Rilevanza Doomsday", hint: "Quanto serve averlo visto" },
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
  category: CategoryId;
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
