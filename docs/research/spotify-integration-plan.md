# Spotify "Recently Played" Integration Plan

Research date: 2026-08-01. Target: the portfolio app (Next.js App Router, TypeScript).
Goal: a live section showing the owner's recently played Spotify tracks (album art, title,
artist, played-at) rendered as rounded gallery-style cards, stats.fm-style.

---

## 1. API status check (important — read first)

### The endpoints we need are still available
- `GET https://api.spotify.com/v1/me/player/recently-played` — scope `user-read-recently-played`.
  Params: `limit` (1–50, default 20), `before`/`after` (unix ms cursors, mutually exclusive).
  Response: array of `{ track, played_at, context }`; `track.album.images[]` carries cover art
  URLs (640/300/64 px) on `i.scdn.co`. Podcast episodes are NOT returned. A track only appears
  after it has finished playing (and generally after >30s of play).
- `GET https://api.spotify.com/v1/me/player/currently-playing` — scope `user-read-currently-playing`.
  Returns `204 No Content` when nothing is playing (handle this — it is not JSON).

Neither endpoint was removed in the **November 2024 lockdown** (that removed audio-features,
recommendations, related-artists, etc. for new dev-mode apps) nor in the **February 2026
Development Mode changes**. Both remain listed in the Player reference and the Feb 2026
migration guide's "kept" set.

### Current Development Mode rules (Feb 2026 changes — these DO affect us)
- **App owner must have an active Spotify Premium subscription.** If the site owner is on a
  free account, new dev-mode apps cannot be created. Verify before starting.
- New apps: limited client IDs per developer (1 at Feb 2026, raised to **25 as of July 2026**)
  and **max 5 authorized users** per app. Irrelevant for us — only the owner authorizes, once.
- No extended-quota application needed: a single-user personal-site app stays in dev mode forever.

### Redirect URI rules (enforced since Apr 9 2025; mandatory for all apps since Nov 27 2025)
- Redirect URIs must be **HTTPS**, with one exception: **loopback IP literals**
  `http://127.0.0.1:<port>` or `http://[::1]:<port>` are allowed over HTTP.
- **`http://localhost` is banned** — the dashboard rejects it. Use `http://127.0.0.1:3000/...`.
- Implicit grant and other legacy flows are gone; **Authorization Code flow** (confidential
  client, client secret on the server) is exactly right for a single-owner site. PKCE is
  optional for server-side confidential clients but harmless to add.

### Tokens and rate limits
- Access tokens live **1 hour**. The **refresh token does not expire** unless the user revokes
  the app (spotify.com → Account → Apps) or Spotify invalidates it. The refresh response *may*
  include a new `refresh_token`; if present, it should replace the stored one (log a warning so
  the env var can be updated — in practice Spotify rarely rotates it for auth-code flow).
- Rate limit: rolling **30-second window** (unpublished count; dev mode is the lower tier,
  community-observed ~180 req/30s). `429` responses carry `Retry-After` (seconds). With 60s
  server caching we make ≤2 requests/min — nowhere near the limit.
- Album art hotlinking from `i.scdn.co` is how every "now playing" widget works; the URLs come
  straight from the API and Spotify's design/developer policy permits displaying artwork
  **unmodified** (no cropping into non-rectangular shapes, no overlays that obscure it) and
  encourages linking back to the track on Spotify (`track.external_urls.spotify`). Keep the
  card a plain rounded rectangle (our gallery cards already are) and link out.

---

## 2. One-time setup for the owner

### 2.1 Create the app
1. Go to <https://developer.spotify.com/dashboard> (requires Spotify **Premium** login) →
   **Create app**.
2. Name: e.g. `portfolio-now-playing`. Redirect URI: `http://127.0.0.1:3000/callback`
   (NOT `localhost`). API used: **Web API**. Save.
3. Copy **Client ID** and **Client Secret** from the app's Settings.

### 2.2 Get the refresh token (done exactly once)
1. Open this URL in a browser (fill in CLIENT_ID):

   ```
   https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-recently-played%20user-read-currently-playing
   ```

2. Approve. The browser lands on `http://127.0.0.1:3000/callback?code=AQB...` — the page will
   404 (nothing needs to be running); copy the `code` from the address bar. The code expires in
   ~10 minutes, so do step 3 promptly.
3. Exchange it (Git Bash; heredoc-free one-liner):

   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(printf '%s' 'CLIENT_ID:CLIENT_SECRET' | base64 -w0)" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code&code=PASTE_CODE&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback"
   ```

4. Save the `refresh_token` from the JSON response. (The `access_token` in the same response
   can be discarded — the server mints fresh ones.)

### 2.3 Environment variables
`.env.local` (and Vercel project env vars for prod). Add `.env.local` to `.gitignore` if not
already:

```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

No `NEXT_PUBLIC_` prefix — these must never reach the client bundle.

---

## 3. Architecture

```
Browser (client component, SWR/poll 60s)
   └── GET /api/spotify/recently-played        (route handler, Cache-Control s-maxage=60)
          └── lib/spotify.ts
                ├── getAccessToken()            POST accounts.spotify.com/api/token
                │                               (grant_type=refresh_token, Basic auth;
                │                                memoized in module scope until expiry)
                ├── getRecentlyPlayed(limit)    GET /v1/me/player/recently-played
                └── getNowPlaying()             GET /v1/me/player/currently-playing (optional)
```

### 3.1 `src/lib/spotify.ts`
- `getAccessToken()`: POST `https://accounts.spotify.com/api/token` with
  `Authorization: Basic base64(client_id:client_secret)` and body
  `grant_type=refresh_token&refresh_token=...`. Memoize `{ token, expiresAt }` in module scope;
  refresh when < 5 min remain. (Module scope survives across warm serverless invocations —
  cold starts just re-fetch, which is fine.)
- `getRecentlyPlayed(limit = 12)` and `getNowPlaying()`: call Spotify with the bearer token,
  `cache: "no-store"` on the Spotify fetches themselves (freshness is controlled at our route
  layer instead).
- Map to a lean DTO so the client never sees the full Spotify payload:

  ```ts
  type SpotifyTrackCard = {
    id: string;            // track id + played_at (played_at alone is unique)
    title: string;         // track.name
    artist: string;        // track.artists.map(a => a.name).join(", ")
    album: string;
    albumArt: string;      // 300px image: track.album.images[1]?.url ?? images[0]?.url
    playedAt: string;      // ISO; "now" for currently playing
    url: string;           // track.external_urls.spotify
    nowPlaying: boolean;
  };
  ```

### 3.2 `src/app/api/spotify/recently-played/route.ts`
- `export const runtime = "nodejs"` (default) and `export const dynamic = "force-dynamic"`.
- Optionally merge `currently-playing` as item 0 (flagged `nowPlaying: true`), then
  recently-played after it, deduping if the same track appears in both.
- Return `Response.json(tracks, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } })`.
  On Vercel this makes the CDN absorb all visitor traffic — Spotify sees at most ~1 req/min
  regardless of visitor count. (Note: route handlers don't honor `export const revalidate` for
  dynamic responses; the header is the reliable mechanism.)
- Error strategy: on 401/429/5xx from Spotify, return `{ tracks: [] }` with a short-lived
  cache header (`s-maxage=30`) and status 200 — never surface a broken section to visitors.

### 3.3 Client fetching
- Small client component using SWR (`refreshInterval: 60_000`, `revalidateOnFocus: true`) or a
  hand-rolled `useEffect` + `setInterval` fetch if avoiding the dependency. SWR is ~4 kB and
  handles dedupe/focus revalidation; either is fine.

### 3.4 Images
- The rest of the site uses plain `<img>` (the gallery uses `data-src` lazy loading via
  `public/scripts/index.js`), so plain `<img src={albumArt} loading="lazy">` is the
  consistent choice and needs zero config.
- If `next/image` is preferred instead, `next.config.ts` (currently empty) needs:

  ```ts
  const nextConfig: NextConfig = {
    images: { remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }] },
  };
  ```

  Optimization benefit is marginal (art is already sized 300px WebP-ish JPEG); plain `<img>`
  recommended.

---

## 4. Component plan — mapping onto the existing card system

### What exists today (verified in the repo)
- Gallery markup: `src/components/MainIndex.tsx` — `<section className="gallery" id="gallery">`
  containing `<figure className="gallery__item" data-aspect="..." style={{"--item-aspect": ...}}>`
  with lazy `<img data-src=...>`.
- Styles: `src/app/globals.css` (~lines 1454–1553):
  - `.gallery__item`: `aspect-ratio: var(--item-aspect, 1.35)`, `border-radius:
    var(--container-radius, 16px)`, `overflow: hidden`, `background: var(--surface)`.
  - Loading shimmer: `:after` sheen animation until `.is-loaded`; media fades in with
    `opacity .45s var(--ease)`.
  - The gallery itself is `display: none` unless `html.gallery-mode` is set, and
    `public/scripts/index.js` (minified behavior bundle) redistributes
    figures into `.gallery__col` flex columns and drives `data-src` lazy loading.

### Recommendation: reuse the card *styles*, not the gallery *container*
The `.gallery` section is a special view-mode toggled by the site's vanilla JS; injecting live
React-rendered cards into it would fight the script's DOM mutation (column building, data-src
swapping). Instead:

1. New client component `src/components/SpotifySection.tsx` rendered from `MainIndex`/`page.tsx`
   as its own `<section className="section" id="listening">`, matching sibling sections:
   `<h2 className="fit section__title">` with the folder icon (`/folder-icon.png`) and a title
   like `Listening` or `On repeat`, plus an optional `.section__lede`.
2. Card grid: new class `.spotify-grid` (CSS grid, `repeat(auto-fill, minmax(160px, 1fr))`,
   `gap: var(--wrap-pad)`) so cards stay square-ish. Each card:

   ```tsx
   <a className="spotify-card" href={t.url} target="_blank" rel="noopener">
     <figure className="gallery__item is-loaded" style={{ "--item-aspect": "1" }}>
       <img src={t.albumArt} alt={`${t.title} — ${t.artist}`} loading="lazy" />
     </figure>
     <div className="spotify-card__meta">
       <span className="spotify-card__title">{t.title}</span>
       <span className="spotify-card__artist">{t.artist}</span>
       <span className="spotify-card__time">{t.nowPlaying ? "Now playing" : relativeTime(t.playedAt)}</span>
     </div>
   </a>
   ```

   Reusing `.gallery__item` gives the rounded 16px corners, `var(--surface)` placeholder
   background, and the fade-in/sheen for free. Add `is-loaded` on the img `onLoad` (or render
   without it and toggle) so the existing sheen shimmer doubles as the loading skeleton —
   render 8–12 empty `.gallery__item` figures (no `is-loaded`) while SWR is loading.
3. Meta text: reuse the site's type tokens — small caps/dim styling like `.cat-chip` /
   `.lede-dim` for artist + relative time ("2h ago"); track title in default `--fg`.
4. `nowPlaying` card: subtle affordance consistent with the site's restraint — e.g. a small
   pulsing dot or an animated 3-bar equalizer in the meta row (respect
   `prefers-reduced-motion`, as the existing CSS already does for the sheen).
5. Hover: match site conventions — gallery items have no zoom/scale; index rows rely on text
   treatment. Suggest `opacity`/slight `filter: brightness(1.05)` on art plus underlining the
   title, transition `var(--ease)`. Keep artwork unmodified per Spotify guidelines (no overlays
   covering the art).
6. Count: 8 or 12 tracks (fills the grid at common breakpoints). Deduplicate consecutive
   repeats of the same track id if a cleaner list is wanted (stats.fm shows repeats; either is
   defensible — make it a constant).
7. `relativeTime`: `Intl.RelativeTimeFormat`, computed client-side; render with
   `suppressHydrationWarning` not needed since the whole component is client-only (fetches
   after mount — also avoids any SSR/env leakage concerns).

---

## 5. Edge cases

| Case | Behavior |
|---|---|
| Nothing played recently / new account | API returns empty `items`; hide the whole section (render `null`) rather than an empty grid. |
| Nothing currently playing | `currently-playing` returns **204 with empty body** — check `res.status === 204` before `res.json()`. |
| Refresh token revoked / invalid (`400 invalid_grant` on token refresh, or `401` on API) | Route returns `{ tracks: [] }` 200 + short cache; log server-side (`console.error`) so it shows in Vercel logs. Section hides. Fix = redo §2.2. |
| Spotify returns a new `refresh_token` on refresh | Log a warning with instruction to update `SPOTIFY_REFRESH_TOKEN`; keep using the old one until it fails (can't persist env at runtime). |
| `429` rate limit | Honor `Retry-After` is overkill at our volume; just return empty + `s-maxage=30` so the CDN backs off automatically. |
| Spotify API 5xx / network error | Same empty-response fallback; SWR keeps showing the last good data client-side (`keepPreviousData`). |
| Private session / listening history disabled in Spotify settings | Endpoint returns stale or empty data — same empty/hide handling; nothing to do. |
| Missing env vars (fork/preview deploys) | Guard at top of route: if any of the 3 vars is absent, return empty immediately (don't 500). |
| Explicit tracks | `track.explicit` boolean available; probably ignore, optionally show a tiny "E" tag. |
| Very long titles/artists | `text-overflow: ellipsis; white-space: nowrap` (or 2-line clamp) on meta spans. |

---

## 6. Implementation checklist

Owner (one-time, ~10 min):
- [ ] Confirm Spotify **Premium** on the owner account (hard requirement for new dev-mode apps).
- [ ] Create dashboard app with redirect URI `http://127.0.0.1:3000/callback` (§2.1).
- [ ] Run the authorize URL + `curl` token exchange; capture refresh token (§2.2).
- [ ] Add the 3 env vars locally and in Vercel (§2.3).

Code:
- [ ] `src/lib/spotify.ts` — token refresh w/ module-scope memo, `getRecentlyPlayed`,
      `getNowPlaying` (204-safe), DTO mapping.
- [ ] `src/app/api/spotify/recently-played/route.ts` — merged now-playing + recent list,
      `s-maxage=60, stale-while-revalidate=120`, empty-array fallbacks, env-var guard.
- [ ] `src/components/SpotifySection.tsx` — client component, SWR (60s refresh,
      `keepPreviousData`), skeleton figures while loading, hide when empty.
- [ ] CSS in `globals.css`: `.spotify-grid`, `.spotify-card__meta/title/artist/time`, hover
      state, now-playing indicator, `prefers-reduced-motion` guard.
- [ ] Mount the section in `MainIndex.tsx` (after archive/mind, before `.gallery`) — verify
      `public/scripts/index.js` behaviors (gallery-mode hides `.section`s, so the Spotify
      section correctly disappears in gallery view for free; confirm no selector collisions).
- [ ] (Only if `next/image` chosen) add `i.scdn.co` to `images.remotePatterns` in
      `next.config.ts`.
- [ ] Smoke test: dev server, play a track, confirm card order/now-playing flag; test with env
      vars removed (section hidden, no 500); Lighthouse pass for layout shift (aspect-ratio
      cards prevent CLS).

---

## 7. Sources
- Feb 2026 dev-mode migration guide: https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide
- Quota modes: https://developer.spotify.com/documentation/web-api/concepts/quota-modes
- Recently played reference: https://developer.spotify.com/documentation/web-api/reference/get-recently-played
- Redirect URI rules: https://developer.spotify.com/documentation/web-api/concepts/redirect_uri
- Security-requirements blog (Apr 2025 enforcement): https://developer.spotify.com/blog/2025-02-12-increasing-the-security-requirements-for-integrating-with-spotify
- OAuth migration deadline (localhost removal, Nov 27 2025): https://developer.spotify.com/blog/2025-10-14-reminder-oauth-migration-27-nov-2025
