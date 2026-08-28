"use server";

import { revalidatePath } from "next/cache";
import { DEFAULT_CATEGORIES, type Category, type FilmStat } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

/** Media/conteggio finti ma stabili, usati finché Supabase non è collegato. */
function seedStats(slug: string, categories: Category[]): FilmStat[] {
  return categories.map((c) => {
    let h = 0;
    const key = `${slug}:${c.slug}`;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return {
      category: c.slug,
      average: Math.round((6 + (h % 350) / 100) * 10) / 10,
      votes: 40 + (h % 260),
    };
  });
}

/** Le categorie votabili, in ordine. Chiunque sia loggato può aggiungerne o riordinarle. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  if (!supabase) return DEFAULT_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select("slug, label, hint, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;

  return data.map((row) => ({
    slug: row.slug,
    label: row.label,
    hint: row.hint,
    sortOrder: row.sort_order,
  }));
}

export async function getFilmStats(slug: string, categories: Category[]): Promise<FilmStat[]> {
  const supabase = await createClient();
  if (!supabase) return seedStats(slug, categories);

  const { data, error } = await supabase
    .from("film_rating_stats")
    .select("category, average, votes")
    .eq("film_slug", slug);

  if (error || !data) return categories.map((c) => ({ category: c.slug, average: 0, votes: 0 }));

  return categories.map((c) => {
    const row = data.find((d) => d.category === c.slug);
    return {
      category: c.slug,
      average: row ? Math.round(Number(row.average) * 10) / 10 : 0,
      votes: row ? Number(row.votes) : 0,
    };
  });
}

export async function getMyVotes(slug: string): Promise<Partial<Record<string, number>>> {
  const supabase = await createClient();
  if (!supabase) return {};

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("votes")
    .select("category, score")
    .eq("film_slug", slug)
    .eq("user_id", user.id);

  const out: Partial<Record<string, number>> = {};
  data?.forEach((row) => {
    out[row.category as string] = row.score;
  });
  return out;
}

export type VoteResult = { ok: true } | { ok: false; error: string };

/** Un voto per utente/film/categoria: il secondo voto sovrascrive il primo. */
export async function submitVote(
  filmSlug: string,
  category: string,
  score: number
): Promise<VoteResult> {
  if (!category) {
    return { ok: false, error: "Categoria non valida" };
  }
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    return { ok: false, error: "Il voto deve essere un intero da 1 a 10" };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase non configurato" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Devi accedere per votare" };

  const { error } = await supabase.from("votes").upsert(
    {
      user_id: user.id,
      film_slug: filmSlug,
      category,
      score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,film_slug,category" }
  );

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/film/${filmSlug}`);
  return { ok: true };
}

export type CategoryActionResult =
  | { ok: true; category: Category }
  | { ok: false; error: string };

/**
 * Aggiunge una categoria votabile: vale per tutti i film, non solo per
 * quello da cui è stata aggiunta. Va in fondo all'ordine attuale.
 */
export async function addCategory(label: string, hint: string): Promise<CategoryActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase non configurato" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Devi accedere per aggiungere una categoria" };

  const trimmedLabel = label.trim();
  if (!trimmedLabel) return { ok: false, error: "Il nome non può essere vuoto" };
  if (trimmedLabel.length > 40) return { ok: false, error: "Nome troppo lungo (max 40 caratteri)" };

  const slug = slugify(trimmedLabel);
  if (!slug) return { ok: false, error: "Nome non valido: usa lettere o numeri" };

  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? 0) + 1;

  const { data: row, error } = await supabase
    .from("categories")
    .insert({
      slug,
      label: trimmedLabel,
      hint: hint.trim().slice(0, 80),
      sort_order: nextOrder,
      created_by: user.id,
    })
    .select("slug, label, hint, sort_order")
    .single();

  if (error || !row) {
    if (error?.code === "23505") return { ok: false, error: "Esiste già una categoria con questo nome" };
    return { ok: false, error: error?.message ?? "Errore nel salvataggio della categoria" };
  }

  revalidatePath("/film/[slug]", "layout");

  return {
    ok: true,
    category: { slug: row.slug, label: row.label, hint: row.hint, sortOrder: row.sort_order },
  };
}

export type ReorderResult = { ok: true } | { ok: false; error: string };

/** Scambia l'ordine di due categorie adiacenti. Vale per tutti i film. */
export async function reorderCategory(slugA: string, slugB: string): Promise<ReorderResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase non configurato" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Devi accedere per riordinare le categorie" };

  const { error } = await supabase.rpc("swap_category_order", {
    p_slug_a: slugA,
    p_slug_b: slugB,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/film/[slug]", "layout");
  return { ok: true };
}
