// Shared bits for the Anatomy-kit figures that live inside case-study pages:
// the inlined kit, the iframe embed script (theme sync + self-sizing), and the
// base CSS that lets a figure sit straight on the page background.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, "..");

export const kitScript = () => readFileSync(join(HERE, "anatomy-kit", "iso-kit.mjs"), "utf8").replace(/^export /gm, "");

// Runs inside the iframe: follow the site's theme, and size the iframe to the
// figure (unless ?compact, where the page sizes it).
export const EMBED_JS = `
const COMPACT = /[?&]compact/.test(location.search);
if (COMPACT) document.documentElement.classList.add("compact");
const syncTheme = () => {
  let t = null;
  try { t = parent.document.documentElement.getAttribute("data-theme"); } catch (e) {}
  if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.body.setAttribute("data-theme", t === "light" ? "light" : "dark");
};
syncTheme();
try { if (parent !== window) new MutationObserver(syncTheme).observe(parent.document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] }); } catch (e) {}
// crop the drawing to what is actually drawn so it fills the figure's width
try {
  const s = document.querySelector(".iso-stage svg");
  const b = s.getBBox();
  const m = 8;
  s.setAttribute("viewBox", [b.x - m, b.y - m, b.width + m * 2, b.height + m * 2].map((v) => v.toFixed(1)).join(" "));
} catch (e) {}
const fit = () => { try { if (frameElement && !COMPACT) frameElement.style.height = Math.ceil(document.querySelector(".iso-page").getBoundingClientRect().height) + "px"; } catch (e) {} };
addEventListener("load", fit); addEventListener("resize", fit); fit();
`;

export const BASE_CSS = `
html,body{color-scheme:normal!important;background:transparent!important;margin:0}
.iso-page{width:100%!important;margin:0!important}
.iso-figure{margin:0!important}
.iso-plate{--anatomy-card:transparent;background:transparent;box-shadow:none;padding:44px 8px 40px}
.iso-plate-corners{inset:12px 10px}
.iso-legend{padding:0 8px}
.iso-stage{outline:none}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-mid);outline-offset:4px}
.flowing{stroke-dasharray:3 5;animation:iso-flow 900ms linear infinite}
`;

export function writePage(k, { name, title, body, live, css = "" }) {
  const html = k.pageHtml({ title, theme: "dark", body, script: kitScript() + live + EMBED_JS }).replace("</style>", BASE_CSS + css + "</style>");
  const out = join(ROOT, "public", "figures", name);
  writeFileSync(out, html);
  console.log("wrote", out, Math.round(html.length / 1024) + " KB");
}
