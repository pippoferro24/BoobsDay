"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Striscia orizzontale di card con le frecce tonde rosse in stile Marvel. */
export function FilmCarousel({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 660, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={sync}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>

      {!atStart && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Titoli precedenti"
          className="absolute -left-6 top-[34%] hidden h-11 w-11 items-center justify-center bg-marvel text-white shadow-lg transition hover:bg-marvel-dark md:flex"
        >
          <Chevron className="rotate-180" />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Titoli successivi"
          className="absolute -right-6 top-[34%] hidden h-11 w-11 items-center justify-center bg-marvel text-white shadow-lg transition hover:bg-marvel-dark md:flex"
        >
          <Chevron />
        </button>
      )}
    </div>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}
