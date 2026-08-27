# CLAUDE.md — Boobsday

Guida operativa per lavorare su questo repository. Leggila prima di toccare il codice.

## Cos'è

Webapp fan-made che raccoglie i **15 titoli della watchlist ufficiale Marvel/Disney** da
recuperare prima di *Avengers: Doomsday* (in sala il **18 dicembre 2026**).

- **Home** — hero in stile Marvel Unlimited + carosello con tutti i titoli.
  La copertina di ogni card è la **protagonista femminile** del film.
- **Scheda film** (`/film/[slug]`) — foto dell'interprete in copertina, data di uscita,
  durata, sinossi, motivo per cui è in lista, **statistiche votabili**, **galleria con
  copertina caricata dagli utenti** e **curiosità a scorrimento** in stile titoli di coda.
- **Account** — login via magic link Supabase; ogni utente registrato vota una volta per
  categoria e può cambiare idea.

## Stack

| Pezzo | Scelta |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| Linguaggio | TypeScript strict |
| Stile | Tailwind CSS v4 (token in `src/app/globals.css`, niente `tailwind.config`) |
| Auth + DB | Supabase (`@supabase/ssr`, Postgres con RLS) |
| Hosting | Vercel |

## Comandi

```bash
npm run dev        # http://localhost:3000
npm run build      # build di produzione + type check
npm run typecheck  # solo tsc --noEmit
```

**Serve Node 22+.** `@supabase/supabase-js` avvisa su Node 20 (funziona, ma è deprecato).
Vercel usa già Node 22.

## Struttura

```
src/
├── app/
│   ├── layout.tsx              header + footer + font, legge l'utente Supabase
│   ├── page.tsx                home: hero, ventaglio poster, carosello, striscia dati
│   ├── globals.css             token Tailwind, starfield, skew-slab, animazione credits
│   ├── icon.svg                favicon
│   ├── film/[slug]/page.tsx    scheda film (SSG su tutti gli slug)
│   ├── login/page.tsx          form magic link
│   └── auth/callback/route.ts  scambio code → sessione
├── components/                 tutti i pezzi di UI (vedi sotto)
├── data/films.ts               ⭐ la watchlist: unica fonte di verità sui contenuti
├── lib/
│   ├── site.ts                 nome e testi di brand, in un solo punto (vedi sotto)
│   ├── assets.ts               trova le immagini in public/ (server-only, usa fs)
│   ├── ratings.ts              server action submitVote + lettura statistiche
│   ├── images.ts               server action upload/setFilmCover + lettura galleria
│   ├── local-covers.ts         chiavi localStorage + evento condivisi da CoverArt/FilmGallery
│   └── supabase/               config, client browser, client server
├── proxy.ts                    rinnova la sessione Supabase a ogni navigazione
└── types.ts                    ⭐ tipo Film + le 5 categorie votabili
supabase/schema.sql             tabelle, RLS, trigger, view aggregata, storage film-images
```

Componenti client (`"use client"`): `RatingPanel`, `CreditsScroll`, `FilmCarousel`,
`Countdown`, `LoginForm`, `SignOutButton`, `CoverArt`, `CoverCaption`, `FilmGallery`.
Tutto il resto è server component.

`PosterArt` è puro (riceve `src` già risolto, niente `fs`): tutti i punti che mostrano un
poster (card, ventaglio, scheda film) passano dal wrapper client `CoverArt`, che sovrascrive
`src` con la copertina caricata dagli utenti — da Supabase, o da localStorage in demo.

## Modalità demo

**Il sito gira anche senza Supabase.** Se mancano `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY`:

- `isSupabaseConfigured` è `false`, `createClient()` ritorna `null`;
- le statistiche vengono da `seedStats()` in `src/lib/ratings.ts` (medie finte ma stabili,
  derivate da un hash dello slug);
- i voti finiscono in `localStorage` con chiave `doomsday-prep:votes:<slug>`;
- le immagini caricate e la copertina scelta finiscono in `localStorage` (chiavi
  `doomsday-prep:gallery:<slug>` e `doomsday-prep:cover:<slug>`, vedi `src/lib/local-covers.ts`),
  come data URL: niente Supabase Storage, niente login richiesto;
- header e scheda film mostrano il badge "modalità demo".

Serve a poter aprire il progetto e vederlo funzionare senza configurare niente. **Non
rimuovere questo fallback** senza motivo: è quello che tiene il progetto avviabile.

## Le 5 categorie votabili

Definite una sola volta in `src/types.ts` (`CATEGORIES`) e ripetute nel `check` della
colonna `category` in `supabase/schema.sql`. **Se ne aggiungi una, vanno aggiornati
entrambi**, altrimenti il vincolo Postgres rifiuta il voto.

`trama` · `personaggi` · `azione` · `colonna_sonora` · `doomsday` — voto intero 1-10.

## Contenuti: cosa sì e cosa no

Il sito parla di **persone reali**. Regola di prodotto, non negoziabile:

- si vota **il film**, mai il corpo di chi ci recita;
- le curiosità riguardano **produzione e carriera** (ruoli, premi, scelte di regia), mai
  la vita privata o le relazioni degli interpreti;
- niente contenuti che una persona citata non vorrebbe vedere pubblicati su di sé.

Se una richiesta va in quella direzione, va riportata su una metrica del film.

## Aggiungere un film

1. Aggiungi l'oggetto `Film` in `src/data/films.ts` (ordine cronologico di uscita).
2. `slug` in kebab-case: diventa l'URL ed è la chiave dei voti nel database.
3. `accent` sono i due colori del poster segnaposto quando manca la foto.
4. `lead` è la protagonista femminile mostrata in copertina.
5. Niente altro da toccare: rotte, SSG e metadata si generano da qui.

## Immagini

Non ci sono foto nel repo. Il codice le raccoglie da solo:

- `public/posters/<slug>.jpg` → copertina verticale (2:3) della card;
- `public/stills/<slug>.jpg` → immagine di sfondo della scheda film (orizzontale).

Estensioni accettate: `.jpg .jpeg .png .webp .avif` (vedi `src/lib/assets.ts`).
Se il file non c'è, viene disegnato un segnaposto con lo stesso ingombro: **il layout non
si sposta** quando arrivano le immagini vere. Usa immagini per cui hai i diritti.

## Copertine caricate dagli utenti

Nella scheda film, sezione "Galleria" (`FilmGallery`): chiunque sia loggato (chiunque, in
demo) può caricare un'immagine e promuoverne una a copertina del film, sostituendo quella
di default ovunque appaia il poster — card home, ventaglio hero, scheda film.

- Upload e promozione passano da `src/lib/images.ts` (server action `uploadFilmImage`,
  `setFilmCover`); un solo file per volta, max 5 MB, solo jpg/png/webp/avif.
- Storage: bucket pubblico `film-images` su Supabase Storage, percorso
  `<film_slug>/<user_id>/<uuid>.<ext>`. Tabella `public.film_images` tiene traccia di chi
  ha caricato cosa e quale riga è `is_cover`.
- La promozione a copertina passa dalla funzione `set_film_cover` (security definer) in
  `supabase/schema.sql`: così chiunque sia loggato può promuovere anche un'immagine
  caricata da un altro, non solo la propria.
- In modalità demo tutto vive in localStorage (vedi sopra); `CoverArt` e `CoverCaption`
  ascoltano l'evento `doomsday-prep:cover-changed` per aggiornarsi subito, senza refresh,
  quando qualcuno cambia copertina nella stessa pagina.
- **Nessuna moderazione**: chiunque può caricare qualunque immagine. Non adatto a un
  lancio pubblico senza aggiungere almeno un modo per segnalare/rimuovere contenuti (vedi
  TODO).

## Convenzioni

- Testi dell'interfaccia **in italiano**, con accenti veri (`à è ì ò ù`), mai `e'`.
- Font: `.font-display` (Barlow Condensed) per titoli e numeri, corpo in Inter.
- Colori solo via token: `bg-ink`, `bg-marvel`, `text-paper`. Niente esadecimali sparsi,
  tranne i due `accent` per film.
- Commenti in italiano, solo dove il codice non si spiega da sé.
- Il rosso Marvel è `#ec1d24` (`--color-marvel`).
- Nome e testi di brand: **solo `src/lib/site.ts`**, non aggiungere il nome hardcoded
  altrove. Un nome che sessualizza le interpreti va contro la regola in "Contenuti" sopra.

## Database

Esegui `supabase/schema.sql` in Supabase Studio → SQL Editor. È idempotente.

- `profiles` — creato in automatico da un trigger su `auth.users`.
- `votes` — vincolo `unique (user_id, film_slug, category)`: `submitVote` fa `upsert`,
  quindi il secondo voto sovrascrive il primo.
- `film_rating_stats` — view con media e conteggio, `security_invoker = on`.
- `film_images` — immagini caricate dagli utenti; al più una `is_cover = true` per film
  (indice unico parziale). Promozione solo tramite `set_film_cover()`.
- Storage: bucket `film-images` (pubblico in lettura, upload solo nella propria cartella).
- RLS attiva ovunque: i voti e le immagini sono **leggibili da tutti**, scrivibili solo dal
  proprietario.

## Deploy

1. `.env.local` da `.env.local.example` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
2. Su Vercel: stesse variabili, con `NEXT_PUBLIC_SITE_URL` = dominio di produzione.
3. Su Supabase → Authentication → URL Configuration: aggiungi il dominio Vercel tra i
   **Redirect URLs**, altrimenti il magic link rimanda a localhost.

## Trappole note

- `generateStaticParams` prerenderizza le 15 schede: le medie mostrate al primo caricamento
  sono quelle del momento di build finché la pagina non viene rivalidata. `submitVote`
  chiama `revalidatePath`.
- `src/lib/assets.ts` usa `fs`: non importarlo mai da un componente client. Per questo
  `PosterArt` non chiama più `posterFor()` da sé: riceve `src` già risolto, altrimenti
  finirebbe nel bundle client tramite `CoverArt`.
- Le curiosità in `films.ts` sono scritte a mano e **non sono verificate una per una**:
  ricontrollale prima di pubblicare (vedi TODO).
