import type { Category } from "@/types";

/**
 * Le categorie sono globali (valgono per tutti i film), quindi in modalità
 * demo vivono sotto un'unica chiave — non una per film, come cover/galleria.
 */
export const CATEGORIES_STORAGE_KEY = "doomsday-prep:categories";

export function readLocalCategories(): Category[] | null {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : null;
  } catch {
    return null;
  }
}

export function writeLocalCategories(categories: Category[]) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    /* ignorato */
  }
}
