import fs from "node:fs";
import path from "node:path";

const EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/**
 * Cerca un'immagine in public/<dir>/<slug>.<ext>.
 * Basta rilasciare il file con il nome giusto: il sito lo raccoglie da solo,
 * altrimenti disegna il segnaposto grafico.
 */
function findAsset(dir: string, slug: string): string | null {
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(process.cwd(), "public", dir, slug + ext))) {
      return `/${dir}/${slug}${ext}`;
    }
  }
  return null;
}

export const posterFor = (slug: string) => findAsset("posters", slug);
export const stillFor = (slug: string) => findAsset("stills", slug);
