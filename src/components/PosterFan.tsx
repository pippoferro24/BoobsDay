import Link from "next/link";
import type { Film } from "@/types";
import { CoverArt } from "./CoverArt";

type Props = { films: Film[]; covers: Record<string, string | null>; demoMode: boolean };

/** Il ventaglio di copertine in prospettiva sulla destra dell'hero. */
export function PosterFan({ films, covers, demoMode }: Props) {
  return (
    <div className="pointer-events-none relative hidden h-full items-center justify-end pr-4 lg:flex">
      <div
        className="flex items-center gap-3"
        style={{ transform: "perspective(1400px) rotateY(-26deg) rotateX(4deg) rotateZ(-3deg)" }}
      >
        {films.map((film, i) => (
          <Link
            key={film.slug}
            href={`/film/${film.slug}`}
            className="pointer-events-auto block w-[150px] shrink-0 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition hover:-translate-y-2"
            style={{
              aspectRatio: "2 / 3",
              transform: `translateY(${i * 10}px) scale(${1 - i * 0.045})`,
              opacity: 1 - i * 0.06,
              zIndex: films.length - i,
            }}
          >
            <CoverArt
              film={film}
              initialSrc={covers[film.slug] ?? null}
              demoMode={demoMode}
              priority={i === 0}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
