"use client";

import { useEffect, useState } from "react";
import { DOOMSDAY_RELEASE } from "@/data/films";

/** Giorni mancanti all'uscita, calcolati sul client per evitare mismatch di idratazione. */
export function Countdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(`${DOOMSDAY_RELEASE}T00:00:00`).getTime();
    const tick = () =>
      setDays(Math.max(0, Math.ceil((target - Date.now()) / 86_400_000)));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (days === null) return <span className="inline-block h-4 w-20 align-middle" />;
  if (days === 0) return <span>oggi</span>;
  return (
    <span>
      <strong className="font-display text-white">{days}</strong> giorn{days === 1 ? "o" : "i"}
    </span>
  );
}
