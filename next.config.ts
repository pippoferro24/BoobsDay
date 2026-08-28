import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md e AGENTS.md sono scritti a mano: Next non deve rigenerarli.
  agentRules: false,
  experimental: {
    serverActions: {
      // Di default Next limita a 1 MB il corpo di una Server Action: troppo
      // poco per l'upload immagini (validiamo noi fino a 5 MB in lib/images.ts).
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
