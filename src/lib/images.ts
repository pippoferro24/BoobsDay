"use server";

import { revalidatePath } from "next/cache";
import type { FilmImage } from "@/types";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "film-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type ImagesClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

function publicUrl(supabase: ImagesClient, path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Tutte le immagini caricate per un film, più recenti prima. */
export async function getFilmImages(slug: string): Promise<FilmImage[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("film_images")
    .select("id, storage_path, is_cover, created_at")
    .eq("film_slug", slug)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    url: publicUrl(supabase, row.storage_path),
    isCover: row.is_cover,
    createdAt: row.created_at,
  }));
}

/** Copertina corrente di ogni film che ne ha una, per la home e il ventaglio. */
export async function getFilmCovers(): Promise<Record<string, string>> {
  const supabase = await createClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("film_images")
    .select("film_slug, storage_path")
    .eq("is_cover", true);

  if (error || !data) return {};

  const out: Record<string, string> = {};
  data.forEach((row) => {
    out[row.film_slug] = publicUrl(supabase, row.storage_path);
  });
  return out;
}

export type ImageActionResult =
  | { ok: true; image: FilmImage }
  | { ok: false; error: string };

export async function uploadFilmImage(
  filmSlug: string,
  formData: FormData
): Promise<ImageActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase non configurato" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Devi accedere per caricare immagini" };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nessun file selezionato" };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Formato non supportato: usa jpg, png, webp o avif" };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Il file supera i 5 MB" };
  }

  const ext = file.type.split("/")[1];
  const path = `${filmSlug}/${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: row, error: insertError } = await supabase
    .from("film_images")
    .insert({ film_slug: filmSlug, user_id: user.id, storage_path: path })
    .select("id, storage_path, is_cover, created_at")
    .single();

  if (insertError || !row) {
    return { ok: false, error: insertError?.message ?? "Errore nel salvataggio dell'immagine" };
  }

  revalidatePath(`/film/${filmSlug}`);

  return {
    ok: true,
    image: {
      id: row.id,
      url: publicUrl(supabase, row.storage_path),
      isCover: row.is_cover,
      createdAt: row.created_at,
    },
  };
}

export type SetCoverResult = { ok: true } | { ok: false; error: string };

/** Promuove un'immagine già caricata a copertina del film (sostituisce quella attuale). */
export async function setFilmCover(filmSlug: string, imageId: string): Promise<SetCoverResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase non configurato" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Devi accedere per impostare la copertina" };

  const { error } = await supabase.rpc("set_film_cover", { p_image_id: imageId });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/film/${filmSlug}`);
  revalidatePath("/");

  return { ok: true };
}
