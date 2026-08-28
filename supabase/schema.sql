-- ============================================================
-- Boobsday — schema Supabase
-- Esegui in Supabase Studio > SQL Editor (e' idempotente).
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  username    text unique,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles sono pubblici" on public.profiles;
create policy "profiles sono pubblici"
  on public.profiles for select using (true);

drop policy if exists "aggiorno solo il mio profilo" on public.profiles;
create policy "aggiorno solo il mio profilo"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "creo solo il mio profilo" on public.profiles;
create policy "creo solo il mio profilo"
  on public.profiles for insert with check (auth.uid() = id);

-- Profilo creato in automatico alla registrazione.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- categories ----------
-- Le categorie votabili non sono più un elenco fisso: chiunque sia loggato
-- può aggiungerne e riordinarle da interfaccia (vedi RatingPanel). Lo slug
-- è la chiave, referenziata da votes.category più sotto.
create table if not exists public.categories (
  slug        text primary key,
  label       text not null,
  hint        text not null default '',
  sort_order  integer not null,
  created_by  uuid references auth.users on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx on public.categories (sort_order);

insert into public.categories (slug, label, hint, sort_order) values
  ('trama', 'Trama', 'Regge la storia?', 1),
  ('personaggi', 'Personaggi', 'Scritti e interpretati bene?', 2),
  ('azione', 'Azione', 'Combattimenti e set piece', 3),
  ('colonna_sonora', 'Colonna sonora', 'Musiche e sound design', 4),
  ('doomsday', 'Rilevanza Doomsday', 'Quanto serve averlo visto', 5)
on conflict (slug) do nothing;

alter table public.categories enable row level security;

drop policy if exists "le categorie sono leggibili da tutti" on public.categories;
create policy "le categorie sono leggibili da tutti"
  on public.categories for select using (true);

drop policy if exists "chi è loggato aggiunge categorie" on public.categories;
create policy "chi è loggato aggiunge categorie"
  on public.categories for insert with check (auth.uid() = created_by);

-- Il riordino passa solo da questa funzione (security definer), così
-- chiunque sia loggato può riordinare anche le categorie aggiunte da altri
-- (nessuna policy di update diretta su categories).
create or replace function public.swap_category_order(p_slug_a text, p_slug_b text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_order_a integer;
  v_order_b integer;
begin
  if auth.uid() is null then
    raise exception 'Devi accedere per riordinare le categorie';
  end if;

  select sort_order into v_order_a from public.categories where slug = p_slug_a;
  select sort_order into v_order_b from public.categories where slug = p_slug_b;

  if v_order_a is null or v_order_b is null then
    raise exception 'Categoria non trovata';
  end if;

  update public.categories set sort_order = v_order_b where slug = p_slug_a;
  update public.categories set sort_order = v_order_a where slug = p_slug_b;
end;
$$;

-- ---------- votes ----------
create table if not exists public.votes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  film_slug   text not null,
  category    text not null,
  score       smallint not null check (score between 1 and 10),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, film_slug, category)
);

create index if not exists votes_film_idx on public.votes (film_slug);

-- Il vecchio vincolo elencava le 5 categorie a mano; ora è una foreign key
-- verso categories, che può crescere da interfaccia.
alter table public.votes drop constraint if exists votes_category_check;
alter table public.votes drop constraint if exists votes_category_fkey;
alter table public.votes
  add constraint votes_category_fkey foreign key (category) references public.categories (slug);

alter table public.votes enable row level security;

drop policy if exists "i voti sono leggibili da tutti" on public.votes;
create policy "i voti sono leggibili da tutti"
  on public.votes for select using (true);

drop policy if exists "voto solo a nome mio" on public.votes;
create policy "voto solo a nome mio"
  on public.votes for insert with check (auth.uid() = user_id);

drop policy if exists "modifico solo i miei voti" on public.votes;
create policy "modifico solo i miei voti"
  on public.votes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cancello solo i miei voti" on public.votes;
create policy "cancello solo i miei voti"
  on public.votes for delete using (auth.uid() = user_id);

-- ---------- aggregato pubblico ----------
-- security_invoker: la view rispetta le policy di chi la interroga.
drop view if exists public.film_rating_stats;
create view public.film_rating_stats
with (security_invoker = on) as
  select
    film_slug,
    category,
    round(avg(score)::numeric, 2) as average,
    count(*)                      as votes
  from public.votes
  group by film_slug, category;

grant select on public.film_rating_stats to anon, authenticated;

-- ---------- film_images ----------
-- Immagini caricate dagli utenti per un film. Una sola per film può essere
-- la copertina (is_cover): la promozione passa dalla funzione set_film_cover,
-- così chiunque sia loggato può promuovere anche un'immagine altrui.
create table if not exists public.film_images (
  id            uuid primary key default gen_random_uuid(),
  film_slug     text not null,
  user_id       uuid not null references auth.users on delete cascade,
  storage_path  text not null,
  is_cover      boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists film_images_slug_idx on public.film_images (film_slug);

create unique index if not exists film_images_one_cover_per_film
  on public.film_images (film_slug) where is_cover;

alter table public.film_images enable row level security;

drop policy if exists "le immagini sono leggibili da tutti" on public.film_images;
create policy "le immagini sono leggibili da tutti"
  on public.film_images for select using (true);

drop policy if exists "carico solo le mie immagini" on public.film_images;
create policy "carico solo le mie immagini"
  on public.film_images for insert with check (auth.uid() = user_id);

create or replace function public.set_film_cover(p_image_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_slug text;
begin
  if auth.uid() is null then
    raise exception 'Devi accedere per impostare la copertina';
  end if;

  select film_slug into v_slug from public.film_images where id = p_image_id;
  if v_slug is null then
    raise exception 'Immagine non trovata';
  end if;

  update public.film_images set is_cover = false where film_slug = v_slug and is_cover;
  update public.film_images set is_cover = true where id = p_image_id;
end;
$$;

-- ---------- storage: film-images ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'film-images', 'film-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Senza questa policy l'API Storage non espone il bucket (anche se esiste
-- nella tabella): storage.buckets ha la RLS già attiva di suo (tabella
-- interna di Supabase, non modificabile con ALTER TABLE) e di default
-- nessuna policy lo rende visibile via anon/authenticated.
drop policy if exists "i bucket pubblici sono visibili a tutti" on storage.buckets;
create policy "i bucket pubblici sono visibili a tutti"
  on storage.buckets for select
  using (public = true);

drop policy if exists "le immagini dei film sono pubbliche" on storage.objects;
create policy "le immagini dei film sono pubbliche"
  on storage.objects for select
  using (bucket_id = 'film-images');

-- Percorso atteso: <film_slug>/<user_id>/<uuid>.<ext>, così ognuno carica
-- solo nella propria cartella.
drop policy if exists "carico immagini solo nella mia cartella" on storage.objects;
create policy "carico immagini solo nella mia cartella"
  on storage.objects for insert
  with check (
    bucket_id = 'film-images'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- ---------- film_trivia ----------
-- Curiosità aggiunte dagli utenti, in coda a quelle scritte a mano in
-- films.ts. Nessuna promozione/ordine speciale: appaiono nell'ordine in
-- cui vengono inserite.
create table if not exists public.film_trivia (
  id          uuid primary key default gen_random_uuid(),
  film_slug   text not null,
  user_id     uuid not null references auth.users on delete cascade,
  text        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists film_trivia_slug_idx on public.film_trivia (film_slug);

alter table public.film_trivia enable row level security;

drop policy if exists "le curiosità sono leggibili da tutti" on public.film_trivia;
create policy "le curiosità sono leggibili da tutti"
  on public.film_trivia for select using (true);

drop policy if exists "aggiungo solo le mie curiosità" on public.film_trivia;
create policy "aggiungo solo le mie curiosità"
  on public.film_trivia for insert with check (auth.uid() = user_id);
