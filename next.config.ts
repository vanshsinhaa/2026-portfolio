import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stray lockfiles above this folder make Turbopack infer the wrong
  // workspace root; pin it so dev chunk resolution stays correct.
  turbopack: { root: path.join(__dirname) },
  // Dev-only: let phones on the LAN (and 127.0.0.1) load dev resources so
  // hydration works when testing on a real device. No effect on production.
  allowedDevOrigins: ["127.0.0.1", "192.168.0.31", "192.168.0.*"],
};

export default nextConfig;
