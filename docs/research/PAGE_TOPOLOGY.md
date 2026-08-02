# Page Topology & Architecture Notes

Single-page portfolio with overlays, built on Next.js 16 App Router. Static markup is
rendered by React components; behavior lives in plain JS modules under `public/scripts/`
(`base.js` + `index.js`) that run after hydration. Shared scoping attributes
(`data-scope-main`, `data-scope-loader`) tie the global CSS to the component markup.

## Body structure (in order)
1. `#loading-screen` — percent scramble loader (inline script; `is-done` → fade, html gets `.loaded`)
2. Inline script — `?view=gallery` deep-link adds `html.gallery-mode` pre-paint
3. `.page-field` — fixed background field
4. `.col-handle--left/right` — draggable column-resize handles (≥1201px, pointer:fine);
   persists `--container-w` to localStorage, restored pre-paint by head script
5. `main.wrap` — hero statement (fit-text), Project Index, LAB, archive/mind,
   `.gallery` (lazy figures, `data-src`)
6. `.filter-scrim`, `#floating` — dock: avatar+time status dot, filter
   (sliding pill), Gallery/Index view toggle, About, theme toggle
7. `#projects-data` — JSON payload (project case-study blocks) consumed by index.js
8. `#bio-overlay`, `#article-overlay`, `#modal` (preview card + case-study modal: left carousel
   `.cmodal` + right text panel, Newsreader serif)
9. `footer.site-footer` — hr, disclaimer, live clock + weather orb (open-meteo), social links,
   Light-mode toggle (mobile-only display), sound toggle (WebAudio synth), signature SVG

## Theming
- `data-theme` on `<html>`; desktop defaults dark, mobile follows system; localStorage override.
  Set pre-paint by inline head script (in `layout.tsx`).
- Fonts: ABC Monument Grotesk (self-hosted woff2), Inter var via Google Fonts, Newsreader
  variable TTF (self-hosted) for serif case-study/footer text.

## Behaviors (all in `public/scripts/base.js` + `index.js`)
Filters, reveal-on-scroll, fit-text (`--fit` var), gallery mode (URL pushState + lazy media),
preview card / case-study modal with carousel, bio + article overlays, column drag, footer clock,
open-meteo weather orb, interaction sounds, mobile bottom dock.

## Next.js integration notes
- Behavior scripts must load AFTER hydration (`BehaviorScripts` client component appends module
  scripts in `useEffect`) — loading them as plain body scripts mutates DOM pre-hydration and
  triggers React hydration-mismatch recovery, which wipes `data-theme`/`--fit` and re-runs the tree.
- `suppressHydrationWarning` on `<html>` and the loader nodes (inline pre-hydration mutations).
- Loader `screen.remove()` swapped for `display:none` so hydration still finds the node.
