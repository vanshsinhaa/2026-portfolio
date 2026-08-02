import { getNowPlaying, getRecentlyPlayed, hasSpotifyEnv } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const OK_CACHE = "public, s-maxage=60, stale-while-revalidate=120";
const ERR_CACHE = "public, s-maxage=30";

export async function GET() {
  if (!hasSpotifyEnv()) {
    return Response.json({ tracks: [] }, { headers: { "Cache-Control": ERR_CACHE } });
  }

  try {
    const [now, recent] = await Promise.all([
      getNowPlaying().catch(() => null), // now-playing is optional garnish
      getRecentlyPlayed(12),
    ]);

    const tracks = now
      ? [now, ...recent.filter((t) => !t.id.startsWith(now.id.split("-")[0]))].slice(0, 12)
      : recent;

    return Response.json({ tracks }, { headers: { "Cache-Control": OK_CACHE } });
  } catch (err) {
    // Never surface a broken section to visitors; empty list hides it client-side.
    console.error("[spotify] recently-played route failed:", err);
    return Response.json({ tracks: [] }, { headers: { "Cache-Control": ERR_CACHE } });
  }
}
