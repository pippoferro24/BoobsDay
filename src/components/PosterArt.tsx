import type { Film } from "@/types";

type Props = {
  film: Film;
  /** Già risolto da chi chiama: public/posters/<slug> oppure la copertina caricata dagli utenti. */
  src: string | null;
  priority?: boolean;
};

/**
 * Copertina della card: la protagonista femminile del film, a meno che una
 * copertina caricata dagli utenti non l'abbia sostituita.
 * Nessuna immagine → segnaposto con gli stessi ingombri, così il layout non
 * cambia quando arrivano le foto. Componente puro: nessun accesso a `fs`,
 * così può essere usato anche dentro componenti client come CoverArt.
 */
export function PosterArt({ film, src, priority = false }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${film.lead.character} — ${film.title}`}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover object-top"
      />
    );
  }

  return (
    <div
      className="relative flex h-full w-full flex-col justify-end overflow-hidden p-3"
      style={{
        background: `linear-gradient(155deg, ${film.accent[0]} 0%, ${film.accent[1]} 78%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-6 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: film.accent[0] }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.07] mix-blend-overlay">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_6px)]" />
      </div>
      <span className="font-display relative text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
        {film.year}
      </span>
      <span className="font-display relative text-xl leading-none font-extrabold uppercase text-white">
        {film.lead.character}
      </span>
      <span className="relative mt-1 text-[11px] font-medium text-white/70">
        {film.lead.actress}
      </span>
      <span className="relative mt-3 block h-[3px] w-10 bg-marvel" />
    </div>
  );
}
