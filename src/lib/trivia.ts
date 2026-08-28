"use server";

import { revalidatePath } from "next/cache";
import type { FilmTrivia } from "@/types";
import { createClient } from "@/lib/supabase/server";

const MAX_LENGTH = 240;

/** Curiosità aggiunte dagli utenti per un film, in ordine di inserimento. */
export async function getFilmTrivia(slug: string): Promise<FilmTrivia[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("film_trivia")
    .select("id, text, created_at")
    .eq("film_slug", slug)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({ id: row.id, text: row.text, createdAt: row.created_at }));
}

export type TriviaActionResult = { ok: true; trivia: FilmTrivia } | { ok: false; error: string };

export async function addTrivia(filmSlug: string, text: string): Promise<TriviaActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase non configurato" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Devi accedere per aggiungere una curiosità" };

  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "La curiosità non può essere vuota" };
  if (trimmed.length > MAX_LENGTH) {
    return { ok: false, error: `Massimo ${MAX_LENGTH} caratteri` };
  }

  const { data: row, error } = await supabase
    .from("film_trivia")
    .insert({ film_slug: filmSlug, user_id: user.id, text: trimmed })
    .select("id, text, created_at")
    .single();

  if (error || !row) {
    return { ok: false, error: error?.message ?? "Errore nel salvataggio della curiosità" };
  }

  revalidatePath(`/film/${filmSlug}`);

  return { ok: true, trivia: { id: row.id, text: row.text, createdAt: row.created_at } };
}
