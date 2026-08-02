// Server-only Spotify client. Uses the Authorization Code flow refresh token
// (see docs/research/spotify-integration-plan.md §2) — never import client-side.

export type SpotifyTrackCard = {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  playedAt: string; // ISO timestamp; "now" for the currently playing track
  url: string;
  nowPlaying: boolean;
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

// Memoized across warm serverless invocations; cold starts just re-fetch.
let cached: { token: string; expiresAt: number } | null = null;

export function hasSpotifyEnv(): boolean {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN
  );
}

async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt - Date.now() > 5 * 60_000) return cached.token;

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN as string,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`spotify token refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  if (data.refresh_token && data.refresh_token !== process.env.SPOTIFY_REFRESH_TOKEN) {
    console.warn(
      "[spotify] refresh response contained a NEW refresh_token — update SPOTIFY_REFRESH_TOKEN"
    );
  }

  cached = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cached.token;
}

type SpotifyTrack = {
  id: string;
  name: string;
  explicit: boolean;
  artists: { name: string }[];
  album: { name: string; images: { url: string; width: number }[] };
  external_urls: { spotify: string };
};

function toCard(track: SpotifyTrack, playedAt: string, nowPlaying: boolean): SpotifyTrackCard {
  return {
    id: `${track.id}-${playedAt}`,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[1]?.url ?? track.album.images[0]?.url ?? "",
    playedAt,
    url: track.external_urls.spotify,
    nowPlaying,
  };
}

export async function getRecentlyPlayed(limit = 12): Promise<SpotifyTrackCard[]> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/me/player/recently-played?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`recently-played failed: ${res.status}`);
  const data = (await res.json()) as {
    items: { track: SpotifyTrack; played_at: string }[];
  };
  return (data.items ?? []).map((it) => toCard(it.track, it.played_at, false));
}

export async function getNowPlaying(): Promise<SpotifyTrackCard | null> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  // 204 = nothing playing; body is empty, not JSON.
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`currently-playing failed: ${res.status}`);
  const data = (await res.json()) as { item: SpotifyTrack | null; is_playing: boolean };
  if (!data.item || !data.is_playing) return null;
  return toCard(data.item, "now", true);
}
