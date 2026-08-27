# Boobsday

La watchlist ufficiale Marvel da recuperare prima di **Avengers: Doomsday**
(18 dicembre 2026): 15 titoli, una scheda per ciascuno, statistiche votabili dagli utenti
registrati e curiosità a scorrimento.

## Avvio rapido

```bash
npm install
npm run dev     # http://localhost:3000
```

Parte così com'è, **senza configurare niente**: in assenza di Supabase il sito va in
modalità demo, con statistiche di esempio e voti salvati nel browser.

## Con account e voti reali

1. Crea un progetto su [supabase.com](https://supabase.com).
2. In Supabase Studio → SQL Editor, esegui `supabase/schema.sql`.
3. Copia `.env.local.example` in `.env.local` e incolla URL e anon key.
4. Riavvia `npm run dev`.

## Immagini

Il repo non contiene foto. Metti i file qui e vengono raccolti da soli:

- `public/posters/<slug>.jpg` — copertina verticale 2:3
- `public/stills/<slug>.jpg` — sfondo orizzontale della scheda

Gli `slug` sono in `src/data/films.ts`. Senza file, il sito disegna un segnaposto.

## Deploy

Vercel, con le tre variabili di `.env.local.example`. Ricordati di aggiungere il dominio
di produzione tra i **Redirect URLs** di Supabase.

---

Documentazione per chi ci lavora: [CLAUDE.md](CLAUDE.md) · Roadmap: [TODO.md](TODO.md)

Progetto fan-made, non affiliato a Marvel Studios o The Walt Disney Company.
