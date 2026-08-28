# TODO — Boobsday

Stato al 26 agosto 2026. Uscita di *Avengers: Doomsday*: **18 dicembre 2026**.

Legenda: `[x]` fatto · `[ ]` da fare · **P1** blocca la produzione · **P2** subito dopo ·
**P3** quando c'è tempo.

---

## Fatto

- [x] Scaffold Next.js 16 + TypeScript strict + Tailwind v4
- [x] Home in stile Marvel Unlimited: hero, ventaglio poster, carosello, striscia dati
- [x] Watchlist ufficiale completa: 15 titoli con sinossi, data, durata, motivo in lista
- [x] Scheda film `/film/[slug]` con SSG su tutti gli slug
- [x] Statistiche votabili su 5 categorie, 1-10, con media e conteggio
- [x] Curiosità a scorrimento stile titoli di coda (pausa su hover, focus e bottone)
- [x] Login magic link Supabase + logout + rinnovo sessione via `proxy.ts`
- [x] Schema SQL con RLS, trigger profilo, view aggregata
- [x] Modalità demo senza Supabase (statistiche seed + voti in localStorage)
- [x] Segnaposto grafici al posto delle foto mancanti, con lo stesso ingombro
- [x] Galleria per film: upload immagini utente + copertina promuovibile
      (`FilmGallery`, `lib/images.ts`, tabella `film_images` + storage `film-images`)
- [x] Nome definitivo deciso: **Boobsday**, centralizzato in `src/lib/site.ts`
- [x] Poster cliccabile in scheda film: apre la galleria in una finestra (`CoverGallery`)
- [x] Categorie di voto dinamiche: chiunque sia loggato può aggiungerne e riordinarle,
      valgono per tutti i film (tabella `categories`, `swap_category_order()`)
- [x] Deploy online: repo GitHub (`pippoferro24/BoobsDay`) + Vercel + Supabase collegati
- [x] Curiosità aggiungibili dagli utenti, in coda a quelle di `films.ts`
      (`CreditsScroll`, `lib/trivia.ts`, tabella `film_trivia`)

---

## P1 — prima di mettere online

- [x] **Creare il progetto Supabase** ed eseguire `supabase/schema.sql`
- [x] **Compilare `.env.local`** partendo da `.env.local.example`
- [x] **Ri-eseguire `supabase/schema.sql`** dopo le categorie dinamiche: aggiunge la
      tabella `categories` e sposta `votes.category` da `check` a foreign key
- [ ] **Ri-eseguire di nuovo `supabase/schema.sql`** dopo le curiosità utente: aggiunge la
      tabella `film_trivia`. Idempotente, non tocca voti/immagini/categorie già salvate
- [ ] **Verificare il giro di login end to end**: magic link → callback → voto salvato →
      la media cambia davvero per un secondo utente
- [ ] **Immagini**: caricare `public/posters/<slug>.jpg` (2:3) e
      `public/stills/<slug>.jpg` (orizzontale) per tutti e 15 i titoli.
      Usare materiale per cui si hanno i diritti (press kit, stock, artwork proprio):
      i fotogrammi dei film sono coperti da copyright
- [ ] **Verificare le curiosità** una per una: sono scritte a memoria e vanno controllate
      su fonte prima della pubblicazione
- [ ] **Rate limiting sul voto**: oggi un utente registrato può cambiare voto all'infinito.
      Aggiungere un limite lato Supabase (policy o edge function)
- [ ] **Moderazione contenuti utente**: oggi chiunque sia loggato può caricare qualunque
      immagine e promuoverla a copertina, aggiungere/riordinare categorie di voto, o
      scrivere qualunque curiosità, senza controllo. Serve almeno un modo per
      segnalare/rimuovere (edge function o pannello admin) prima di un lancio pubblico
- [ ] Passare a **Node 22** in locale (`@supabase/supabase-js` deprecato su Node 20)

## P2 — subito dopo il lancio

- [ ] **Pagina profilo** `/profilo`: i miei voti, username modificabile, avatar
- [ ] **Classifica** `/classifica`: i 15 titoli ordinati per media, filtrabile per categoria
- [ ] **Progressi maratona**: segna "visto", barra di completamento, ripresa da dove eri
- [ ] **Ordine consigliato** alternativo a quello cronologico (per trama, non per uscita)
- [ ] **Immagine social** (`opengraph-image.tsx`) per home e schede film
- [ ] **`sitemap.ts` e `robots.ts`**
- [ ] **Distribuzione dei voti**: istogramma 1-10 accanto alla media, non solo la barra
- [ ] Stato di caricamento e `error.tsx` sulle rotte

## P3 — se c'è tempo

- [ ] Commenti per film (con moderazione: senza, diventa ingestibile)
- [ ] Login con Google/Discord oltre al magic link
- [ ] Dove si guarda: link alla piattaforma di streaming per titolo
- [ ] Countdown grande a schermo intero per il giorno dell'uscita
- [ ] Modalità "spoiler nascosti" sulle sinossi
- [ ] Traduzione inglese (i18n)
- [ ] Test: uno end to end su login + voto, uno su `applyVote` in `RatingPanel`

---

## Deploy

- [x] Repo su GitHub (`pippoferro24/BoobsDay`)
- [x] Progetto Vercel collegato + variabili d'ambiente (https://boobs-day.vercel.app)
- [x] `NEXT_PUBLIC_SITE_URL` sul dominio di produzione
- [x] Dominio Vercel nei **Redirect URLs** di Supabase (altrimenti il magic link torna a
      localhost)
- [ ] Template email Supabase in italiano
- [ ] Controllo finale: Lighthouse, mobile, e la pagina aperta da non registrato

---

## Deciso, non da rifare

- Le categorie di voto riguardano **il film**: trama, personaggi, azione, colonna sonora,
  rilevanza per Doomsday. Non si vota l'aspetto fisico di persone reali.
- Le curiosità riguardano **produzione e carriera**, non la vita privata degli interpreti.
- Vedi la sezione "Contenuti" in [CLAUDE.md](CLAUDE.md).
