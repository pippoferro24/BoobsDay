import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md e AGENTS.md sono scritti a mano: Next non deve rigenerarli.
  agentRules: false,
};

export default nextConfig;
