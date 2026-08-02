import type { SpotifyTrackCard } from "@/lib/spotify";
import { getNowPlaying, getRecentlyPlayed, hasSpotifyEnv } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const OK_CACHE = "public, s-maxage=60, stale-while-revalidate=120";
const ERR_CACHE = "public, s-maxage=30";

// Module-scope memo: throttles Spotify calls in dev (no CDN there) and keeps
// serving the last good list through transient 429/5xx windows.
let lastGood: SpotifyTrackCard[] | null = null;
let lastFetchAt = 0;
const MIN_FETCH_INTERVAL_MS = 60_000;

export async function GET() {
  if (!hasSpotifyEnv()) {
    return Response.json({ tracks: [] }, { headers: { "Cache-Control": ERR_CACHE } });
  }

  if (Date.now() - lastFetchAt < MIN_FETCH_INTERVAL_MS) {
    return Response.json(
      { tracks: lastGood ?? [] },
      { headers: { "Cache-Control": lastGood ? OK_CACHE : ERR_CACHE } }
    );
  }

  try {
    const [now, recent] = await Promise.all([
      getNowPlaying().catch(() => null), // now-playing is optional garnish
      getRecentlyPlayed(12),
    ]);

    const tracks = now
      ? [now, ...recent.filter((t) => !t.id.startsWith(now.id.split("-")[0]))].slice(0, 12)
      : recent;

    lastGood = tracks;
    lastFetchAt = Date.now();
    return Response.json({ tracks }, { headers: { "Cache-Control": OK_CACHE } });
  } catch (err) {
    console.error("[spotify] recently-played route failed:", err);
    lastFetchAt = Date.now(); // back off before hitting Spotify again
    // Serve stale rather than hiding the section; empty only if never succeeded.
    return Response.json(
      { tracks: lastGood ?? [] },
      { headers: { "Cache-Control": ERR_CACHE } }
    );
  }
}
