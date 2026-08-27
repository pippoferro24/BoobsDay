import Link from "next/link";
import type { Film } from "@/types";
import { CoverArt } from "./CoverArt";

type Props = { film: Film; coverSrc: string | null; demoMode: boolean };

export function FilmCard({ film, coverSrc, demoMode }: Props) {
  return (
    <Link
      href={`/film/${film.slug}`}
      className="group block w-[180px] shrink-0 snap-start sm:w-[210px]"
    >
      <div className="relative overflow-hidden bg-ink-2 shadow-lg ring-1 ring-black/10 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl">
        <div style={{ aspectRatio: "2 / 3" }}>
          <CoverArt film={film} initialSrc={coverSrc} demoMode={demoMode} />
        </div>
        {film.kind === "serie" && (
          <span className="font-display absolute left-0 top-3 bg-marvel px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
            Serie
          </span>
        )}
      </div>
      <h3 className="font-display mt-3 min-h-[2.6em] text-[15px] font-bold uppercase leading-tight text-ink group-hover:text-marvel">
        {film.title} ({film.year})
      </h3>
      <p className="mt-0.5 text-xs text-ink/55">{film.lead.character}</p>
    </Link>
  );
}
