// Homepage desk scene, drawn with the Anatomy kit (figures/anatomy-kit, MIT).
// Run `node figures/desk-scene/build.mjs` to write public/figures/desk.html,
// which the homepage embeds under the intro.
//
// The turntable is the subject: its record label is the album art of the
// track from /api/spotify/recently-played. When something is playing now the
// platter spins and the tonearm drops onto the record; otherwise the arm rests
// and the label shows the last played track. Hover reads it out, click opens it.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../anatomy-kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const kitScript = () => readFileSync(join(HERE, "..", "anatomy-kit", "iso-kit.mjs"), "utf8").replace(/^export /gm, "");

const WIDTH = 640;
const HEIGHT = 330;

// ---- world: desk top at z = 0
const DESK = { x: -118, y: -52, w: 236, d: 104, r: 4 };
const DESK_H = 7;
const LEG_H = 34;

const MON = { x: -76, y: -40, w: 74, d: 7, r: 2 };
const MON_Z = 22;
const MON_H = 46;
const SCREEN = { x0: MON.x + 5, x1: MON.x + MON.w - 5, z0: MON_Z + 5, z1: MON_Z + MON_H - 5 };
const SCREEN_Y = MON.y + MON.d;

const KB = { x: -72, y: -6, w: 64, d: 22, r: 2 };
const KB_H = 3;

const TT = { x: 22, y: -42, w: 74, d: 58, r: 3 };
const TT_H = 9;
const PLATTER = [54, -13];
const PLATTER_R = 23;
const PLATTER_Z = TT_H;
const RECORD_Z = PLATTER_Z + 2.6;
const RECORD_R = 22;
const LABEL_R = 9.5;
const PIVOT = [86, -33];
const ARM_Z = RECORD_Z + 5;
const ARM_LEN = 34;
// arm angles (radians, measured in the desk plane): resting off the record, and on the outer groove
const ARM_REST = 1.6;
const ARM_PLAY = 2.057;

const MUG = [104, 30];
const BOOKS = [
  { x: -112, y: -46, w: 30, d: 22, h: 5 },
  { x: -110, y: -44, w: 27, d: 19, h: 4.4 },
  { x: -113, y: -45, w: 31, d: 21, h: 5.4 },
];

const P = k.fitProjection(
  [...k.boxCorners(DESK, -DESK_H - LEG_H, 0), [MON.x, MON.y, MON_Z + MON_H + 2], [MON.x + MON.w, MON.y, MON_Z + MON_H + 2]],
  WIDTH,
  HEIGHT,
  { pad: 10, azimuth: 58 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);

// ---------------------------------------------------------------- desk
function desk() {
  const out = [`<path class="iso-halo" d="${k.haloOf(DESK, -DESK_H - LEG_H, DESK_H, P)}"/>`];
  // two panel legs with a stretcher between them, back to front
  for (const x of [DESK.x + 8, DESK.x + DESK.w - 14]) {
    out.push(S(slab({ x, y: DESK.y + 8, w: 6, d: DESK.d - 16, r: 1 }, -DESK_H - LEG_H, LEG_H, 3, 0.4), { tone: "mid" }));
    out.push(S(slab({ x: x - 1, y: DESK.y + 6, w: 8, d: DESK.d - 12, r: 1 }, -DESK_H - LEG_H, 2, 3, 0.3), { tone: "lo" }));
  }
  out.push(S(slab({ x: DESK.x + 14, y: DESK.y + 14, w: DESK.w - 34, d: 5, r: 1 }, -DESK_H - LEG_H + 8, 5, 3, 0.4), { tone: "lo" }));
  out.push(S(slab(DESK, -DESK_H, DESK_H, 6, 1.2), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(DESK, 4), 0, P), { tone: "faint" }));
  // desk mat under the keyboard
  const mat = { x: -84, y: -14, w: 106, d: 40, r: 3 };
  out.push(S(slab(mat, 0, 0.6, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(mat, 2), 0.6, P), { tone: "faint" }));
  return out.join("");
}

// ---------------------------------------------------------------- books (back left)
function books() {
  const out = [];
  let z = 0;
  BOOKS.forEach((b, i) => {
    out.push(S(slab({ x: b.x, y: b.y, w: b.w, d: b.d, r: 0.6 }, z, b.h, 2, 0.3), { tone: i === 1 ? "hi" : "mid", crease: "lo" }));
    // page block lines on the +x face
    out.push(L([0.3, 0.6].map((f) => k.segment([b.x + b.w, b.y + 2, z + b.h * f], [b.x + b.w, b.y + b.d - 2, z + b.h * f], P)).join(""), { tone: "faint" }));
    z += b.h;
  });
  return out.join("");
}

// ---------------------------------------------------------------- monitor
function monitor() {
  const out = [];
  const foot = { x: MON.x + MON.w / 2 - 14, y: MON.y - 4, w: 28, d: 18, r: 3 };
  out.push(S(slab(foot, 0, 2.2, 4, 0.5), { tone: "mid" }));
  out.push(S(slab({ x: MON.x + MON.w / 2 - 4, y: MON.y - 3, w: 8, d: 4, r: 1 }, 2.2, MON_Z - 2.2 + 4, 2, 0.3), { tone: "mid" }));
  out.push(S(slab(MON, MON_Z, MON_H, 4, 1), { tone: "mid" }));
  // screen inset on the front (+y) face
  const corners = [
    [SCREEN.x0, SCREEN_Y, SCREEN.z1],
    [SCREEN.x1, SCREEN_Y, SCREEN.z1],
    [SCREEN.x1, SCREEN_Y, SCREEN.z0],
    [SCREEN.x0, SCREEN_Y, SCREEN.z0],
  ];
  out.push(`<path class="screen" d="${k.pathOf(corners.map(at), true)}"/>`);
  out.push(L(k.pathOf(corners.map(at), true), { tone: "lo" }));
  // power led and logo dot on the bezel
  out.push(D([at([MON.x + MON.w - 6, SCREEN_Y, MON_Z + 2.4])], { size: 0.7, tone: "hi" }));
  out.push(D([at([MON.x + MON.w / 2, SCREEN_Y, MON_Z + 2.4])], { size: 0.45, tone: "mid" }));
  return out.join("");
}
// code lines on the screen; the live script scrolls them
const LINES = 9;
const lineGeom = (row, length) => {
  const z = SCREEN.z1 - 4.2 - row * 4.2;
  const indent = [0, 4, 8, 8, 4, 8, 12, 4, 0][row % 9];
  return k.segment([SCREEN.x0 + 4 + indent, SCREEN_Y, z], [SCREEN.x0 + 4 + indent + length, SCREEN_Y, z], P);
};

// ---------------------------------------------------------------- keyboard + mouse
function keyboard() {
  const out = [`<path class="iso-halo" d="${k.haloOf(KB, 0.6, 1, P)}" style="filter:blur(3px)"/>`];
  out.push(S(slab(KB, 0.6, KB_H, 4, 0.5), { tone: "mid" }));
  const keys = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 12; col++) {
      const w = row === 3 && col >= 3 && col <= 8 ? 0 : 4;
      if (!w) continue;
      keys.push({ x: KB.x + 3 + col * 4.9, y: KB.y + 3 + row * 4.4 });
    }
  }
  keys.push({ x: KB.x + 3 + 3 * 4.9, y: KB.y + 3 + 3 * 4.4, w: 4.9 * 6 - 0.9 }); // space bar
  keys.sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const key of keys) out.push(S(slab({ x: key.x, y: key.y, w: key.w ?? 4, d: 3.6, r: 0.7 }, 0.6 + KB_H, 1.4, 2, 0.3), { tone: "hi", crease: "none" }));
  // mouse
  out.push(S(slab({ x: 6, y: 0, w: 9, d: 14, r: 4 }, 0.6, 3.2, 6, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.lineOnTop([10.5, 0.8], [10.5, 5], 3.8, P), { tone: "lo" }));
  return out.join("");
}

// ---------------------------------------------------------------- turntable
function turntable() {
  const out = [`<path class="iso-halo" d="${k.haloOf(TT, 0, 1, P)}" style="filter:blur(4px)"/>`];
  for (const [x, y] of k.corners(TT, 6)) out.push(S(k.cylinder(x, y, 3.4, -0.01, 1.4, P, 20), { tone: "lo" }));
  out.push(S(slab(TT, 1.4, TT_H - 1.4, 6, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(TT, 3), TT_H, P), { tone: "faint" }));
  // dust-cover hinges on the back edge
  for (const x of [TT.x + 12, TT.x + TT.w - 18]) out.push(S(slab({ x, y: TT.y - 2.4, w: 6, d: 3, r: 0.6 }, TT_H - 4, 5, 2), { tone: "mid" }));
  // speed buttons and knob on the front left
  for (const [i, x] of [TT.x + 6, TT.x + 13].entries()) out.push(S(slab({ x, y: TT.y + TT.d - 9, w: 5, d: 4, r: 0.8 }, TT_H, 1.2, 2), { tone: i === 0 ? "hi" : "mid", crease: "none" }));
  out.push(k.faceTextSvg(k.topMatrix([TT.x + 6, TT.y + TT.d - 2.4], TT_H, P, "x"), "33  45", { size: 2.2, tone: "lo" }));
  // platter and mat
  out.push(S(k.cylinder(PLATTER[0], PLATTER[1], PLATTER_R, PLATTER_Z, 2.6, P, 72, 0.4), { tone: "mid" }));
  out.push(L(k.sideArc(PLATTER[0], PLATTER[1], PLATTER_R, PLATTER_Z + 1.2, P, 48), { tone: "faint" }));
  // record: dark disc, grooves, label (album art) and spindle
  out.push(`<g class="record">${S(k.cylinder(PLATTER[0], PLATTER[1], RECORD_R, RECORD_Z, 0.6, P, 72), { tone: "lo", crease: "none" })}</g>`);
  out.push(L([19.5, 17, 14.5, 12].map((r) => k.ring(PLATTER[0], PLATTER[1], r, RECORD_Z + 0.6, P, 64)).join(""), { tone: "faint" }));
  const labelRing = k.ring(PLATTER[0], PLATTER[1], LABEL_R, RECORD_Z + 0.6, P, 48);
  out.push(`<clipPath id="label-clip"><path d="${labelRing}"/></clipPath>`);
  out.push(`<path class="label-paper" d="${labelRing}"/>`);
  out.push(`<g clip-path="url(#label-clip)"><image data-part="art" href="" width="${LABEL_R * 2}" height="${LABEL_R * 2}" preserveAspectRatio="xMidYMid slice" transform=""/></g>`);
  out.push(L(labelRing, { tone: "lit" }));
  // a sheen line across the record that turns with it
  out.push(`<path data-part="sheen" class="iso-line" data-tone="mid" d="" style="stroke-width:.9;opacity:.7"/>`);
  out.push(S(k.cylinder(PLATTER[0], PLATTER[1], 0.9, RECORD_Z + 0.6, 2.2, P, 12), { tone: "hi", crease: "none" }));
  // tonearm base and counterweight post
  out.push(S(k.cylinder(PIVOT[0], PIVOT[1], 5, TT_H, 2.4, P, 32, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(PIVOT[0], PIVOT[1], 2.4, TT_H + 2.4, ARM_Z - TT_H - 2.4, P, 20), { tone: "mid" }));
  out.push(S(slab({ x: PIVOT[0] - 3, y: PIVOT[1] + 10, w: 6, d: 4, r: 1 }, TT_H, 6, 2), { tone: "mid" })); // arm rest post
  return out.join("");
}
const armAt = (angle, drop) => {
  // pivot -> headshell, plus a short counterweight stub behind the pivot
  const [px, py] = PIVOT;
  const hx = px + Math.cos(angle) * ARM_LEN, hy = py + Math.sin(angle) * ARM_LEN;
  const z = ARM_Z - drop;
  return {
    arm: segment([px, py, ARM_Z], [hx, hy, z], P),
    stub: segment([px, py, ARM_Z], [px - Math.cos(angle) * 7, py - Math.sin(angle) * 7, ARM_Z], P),
    head: iso([hx, hy, z], P),
  };
};

// ---------------------------------------------------------------- mug
function mug() {
  const [x, y] = MUG;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - 6, y: y - 6, w: 12, d: 12, r: 6 }, 0, 1, P)}" style="filter:blur(3px)"/>`];
  out.push(S(slab({ x: x + 4.4, y: y - 1.2, w: 4.6, d: 2.4, r: 1.1 }, 3, 7, 3), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 6, 0, 12, P, 40, 0.5), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(x, y, 5, 12, P, 40), { tone: "lo" }));
  out.push(`<g class="steam">${[0, 1, 2].map((i) => `<path class="iso-line" data-tone="lo" data-flow="" style="animation-delay:${-i * 500}ms" d="${k.pathOf([0, 1, 2, 3, 4].map((j) => at([x - 2 + i * 2 + Math.sin(j * 1.4 + i) * 1.2, y, 14 + j * 3.2])))}"/>`).join("")}</g>`);
  return out.join("");
}

// ---------------------------------------------------------------- assemble (back to front)
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "An isometric desk: a monitor with code on screen, a keyboard and mouse, a stack of books, a mug, and a record player whose label is the album art of the song Vansh last played on Spotify.",
  body: [
    desk(),
    books(),
    monitor(),
    `<g data-part="code">${Array.from({ length: LINES }, (_, i) => `<path class="iso-line code" data-tone="mid" d=""/>`).join("")}</g>`,
    `<path data-part="caret" class="iso-line" data-tone="lit" d="" style="stroke-width:1.4"/>`,
    turntable(),
    `<g data-part="arm"><path data-part="stub" class="iso-line" data-tone="hi" style="stroke-width:2.2"/><path data-part="arm-line" class="iso-line" data-tone="hi" style="stroke-width:1.4"/><circle data-part="head" r="1.8" class="headshell"/></g>`,
    keyboard(),
    mug(),
    `<rect data-part="hit" class="tt-hit" fill="transparent"/>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const PLATTER = ${JSON.stringify(PLATTER)}, RECORD_Z = ${RECORD_Z}, RECORD_R = ${RECORD_R}, LABEL_R = ${LABEL_R};
const PIVOT = ${JSON.stringify(PIVOT)}, ARM_Z = ${ARM_Z}, ARM_LEN = ${ARM_LEN}, ARM_REST = ${ARM_REST}, ARM_PLAY = ${ARM_PLAY};
const TT = ${JSON.stringify(TT)};
const SCREEN = ${JSON.stringify(SCREEN)}, SCREEN_Y = ${SCREEN_Y}, LINES = ${LINES};
const armAt = ${armAt.toString()};
const lineGeom = ${lineGeom.toString().replace(/k\.segment/g, "segment")};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (q) => svg.querySelector(q);
const art = $('[data-part="art"]'), sheen = $('[data-part="sheen"]'), caret = $('[data-part="caret"]');
const stub = $('[data-part="stub"]'), armLine = $('[data-part="arm-line"]'), head = $('[data-part="head"]');
const code = [...svg.querySelectorAll(".code")];
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");

// clickable area over the turntable (screen-space box of its plinth)
const hit = $('[data-part="hit"]');
const tc = [[TT.x, TT.y, 0], [TT.x + TT.w, TT.y, 0], [TT.x, TT.y + TT.d, 0], [TT.x + TT.w, TT.y + TT.d, 0], [TT.x, TT.y, 30], [TT.x + TT.w, TT.y + TT.d, 30]].map((p) => iso(p, P));
const xs = tc.map((p) => p[0]), ys = tc.map((p) => p[1]);
hit.setAttribute("x", Math.min(...xs)); hit.setAttribute("y", Math.min(...ys));
hit.setAttribute("width", Math.max(...xs) - Math.min(...xs)); hit.setAttribute("height", Math.max(...ys) - Math.min(...ys));

let track = null, playing = false, spin = 0, armAngle = ARM_REST, armDrop = 0, scroll = 0, hover = false;
const lengths = [22, 30, 18, 34, 26, 14, 28, 20, 32, 16, 24, 36];

function draw() {
  // album art on the label, turning with the record
  const deg = (spin * 180) / Math.PI;
  art.setAttribute("transform", topMatrix(PLATTER, RECORD_Z + 0.6, P, "x") + " rotate(" + deg.toFixed(2) + ") translate(" + -LABEL_R + " " + -LABEL_R + ")");
  const a = spin + 0.6;
  sheen.setAttribute("d", segment([PLATTER[0] + Math.cos(a) * (LABEL_R + 1.5), PLATTER[1] + Math.sin(a) * (LABEL_R + 1.5), RECORD_Z + 0.65], [PLATTER[0] + Math.cos(a) * (RECORD_R - 1.5), PLATTER[1] + Math.sin(a) * (RECORD_R - 1.5), RECORD_Z + 0.65], P));
  const g = armAt(armAngle, armDrop);
  stub.setAttribute("d", g.stub); armLine.setAttribute("d", g.arm);
  head.setAttribute("cx", g.head[0].toFixed(2)); head.setAttribute("cy", g.head[1].toFixed(2));
  // code scrolls up one line at a time on the monitor
  const first = Math.floor(scroll);
  code.forEach((path, i) => path.setAttribute("d", lineGeom(i, lengths[(first + i) % lengths.length])));
  const last = lineGeom(LINES - 1, lengths[(first + LINES - 1) % lengths.length]);
  const end = last.split("L")[1].split(" ").map(Number);
  caret.setAttribute("d", Math.floor(performance.now() / 530) % 2 ? "" : "M" + (end[0] + 1.5) + " " + (end[1] - 1.8) + "L" + (end[0] + 1.5) + " " + (end[1] + 1.8));
}

function setText() {
  let text = "";
  if (!track) text = "desk · no record on";
  else if (playing) text = "♪ now playing · " + track.title + " — " + track.artist;
  else text = "last played · " + track.title + " — " + track.artist;
  if (hover && track) text += "  ↗";
  if (readout.textContent !== text) readout.textContent = text;
}

let frame = 0, last = 0, visible = false, lastKey = "";
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (playing && !calm) spin += dt * (33.3 / 60) * Math.PI * 2;
  // arm swings over, then drops; lifts before swinging back
  const goal = playing ? ARM_PLAY : ARM_REST;
  if (playing) {
    armAngle += (goal - armAngle) * (1 - Math.exp(-dt / 0.45));
    if (Math.abs(goal - armAngle) < 0.02) armDrop += (2.4 - armDrop) * (1 - Math.exp(-dt / 0.25));
  } else {
    armDrop += (0 - armDrop) * (1 - Math.exp(-dt / 0.2));
    if (armDrop < 0.1) armAngle += (goal - armAngle) * (1 - Math.exp(-dt / 0.45));
  }
  if (!calm) scroll += dt * 0.6;
  // repaint only when something visible changed (blurred shadows make every
  // repaint costly): ~30 fps while the record spins, a few times a second idle
  const key = (playing && !calm ? Math.floor(now / 33) : 0) + "|" + armAngle.toFixed(3) + "|" + armDrop.toFixed(2) + "|" + Math.floor(scroll) + "|" + (Math.floor(now / 530) % 2);
  if (key !== lastKey) { lastKey = key; draw(); }
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "60px 0px" }).observe(stage);

async function load() {
  try {
    const d = await (await fetch("/api/spotify/recently-played")).json();
    const t = d.tracks && d.tracks[0];
    if (t) {
      track = t; playing = !!t.nowPlaying || /[?&]playing/.test(location.search);  // ?playing previews the spinning state
      if (art.getAttribute("href") !== t.albumArt) art.setAttribute("href", t.albumArt);
      svg.classList.add("has-art");
    }
  } catch (e) {}
  setText(); draw();
}
load();
setInterval(load, 60000);

hit.addEventListener("pointerenter", () => { hover = true; svg.classList.add("tt-hover"); setText(); });
hit.addEventListener("pointerleave", () => { hover = false; svg.classList.remove("tt-hover"); setText(); });
hit.addEventListener("click", () => { if (track) window.open(track.url, "_blank", "noopener"); });
stage.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && track) { e.preventDefault(); window.open(track.url, "_blank", "noopener"); } });
draw();

// ---- embed: follow the site's theme and size the iframe to the scene
const syncTheme = () => {
  let t = null;
  try { t = parent.document.documentElement.getAttribute("data-theme"); } catch (e) {}
  if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.body.setAttribute("data-theme", t === "light" ? "light" : "dark");
};
syncTheme();
try { new MutationObserver(syncTheme).observe(parent.document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] }); } catch (e) {}
const fit = () => { try { if (frameElement) frameElement.style.height = Math.ceil(document.querySelector(".iso-page").getBoundingClientRect().height) + "px"; } catch (e) {} };
addEventListener("load", fit); addEventListener("resize", fit); fit();
`;

const EXTRA_CSS = `
html,body{color-scheme:normal!important;background:transparent!important;margin:0}
.iso-page{width:100%!important;margin:0!important}
.iso{--anatomy-card:transparent;--anatomy-paper:var(--anatomy-page)}
body .iso-stage{outline:none;position:relative}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-mid);outline-offset:4px}
.screen{fill:#0d1117}
body[data-theme="light"] .screen{fill:#1b1f27}
.code{opacity:.75}
.code:nth-child(3n){stroke:#7ee787}.code:nth-child(4n){stroke:#79c0ff}.code:nth-child(5n){stroke:#ff7b72}
.record>.iso-solid>.iso-top,.record>.iso-solid>.iso-fill{fill:#080808}
.record>.iso-solid>.iso-shade{fill:#050505}
.label-paper{fill:var(--anatomy-hi)}
.headshell{fill:var(--anatomy-hi)}
.tt-hit{cursor:pointer}
.tt-hover .label-paper{fill:var(--anatomy-lit)}
.desk-readout{margin-top:6px;font:11px/1.4 var(--anatomy-mono);letter-spacing:.04em;color:var(--anatomy-muted);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;

const body = `<div class="iso-stage" tabindex="0" role="group" aria-label="Desk scene. The record player shows the last song played on Spotify; press Enter to open it.">${svg}</div><div class="desk-readout" data-readout aria-live="polite">desk</div>`;
const html = k.pageHtml({ title: "Desk", theme: "dark", body, script: kitScript() + live }).replace("</style>", EXTRA_CSS + "</style>");
const out = join(ROOT, "public", "figures", "desk.html");
writeFileSync(out, html);
console.log("wrote", out, Math.round(html.length / 1024) + " KB");
