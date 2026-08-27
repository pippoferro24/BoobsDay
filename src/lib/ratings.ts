"use server";

import { revalidatePath } from "next/cache";
import { CATEGORIES, type CategoryId, type FilmStat } from "@/types";
import { createClient } from "@/lib/supabase/server";

/** Media/conteggio finti ma stabili, usati finché Supabase non è collegato. */
function seedStats(slug: string): FilmStat[] {
  return CATEGORIES.map((c) => {
    let h = 0;
    const key = `${slug}:${c.id}`;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return {
      category: c.id,
      average: Math.round((6 + (h % 350) / 100) * 10) / 10,
      votes: 40 + (h % 260),
    };
  });
}

export async function getFilmStats(slug: string): Promise<FilmStat[]> {
  const supabase = await createClient();
  if (!supabase) return seedStats(slug);

  const { data, error } = await supabase
    .from("film_rating_stats")
    .select("category, average, votes")
    .eq("film_slug", slug);

  if (error || !data) return CATEGORIES.map((c) => ({ category: c.id, average: 0, votes: 0 }));

  return CATEGORIES.map((c) => {
    const row = data.find((d) => d.category === c.id);
    return {
      category: c.id,
      average: row ? Math.round(Number(row.average) * 10) / 10 : 0,
      votes: row ? Number(row.votes) : 0,
    };
  });
}

export async function getMyVotes(slug: string): Promise<Partial<Record<CategoryId, number>>> {
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

  const out: Partial<Record<CategoryId, number>> = {};
  data?.forEach((row) => {
    out[row.category as CategoryId] = row.score;
  });
  return out;
}

export type VoteResult = { ok: true } | { ok: false; error: string };

/** Un voto per utente/film/categoria: il secondo voto sovrascrive il primo. */
export async function submitVote(
  filmSlug: string,
  category: CategoryId,
  score: number
): Promise<VoteResult> {
  if (!CATEGORIES.some((c) => c.id === category)) {
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
