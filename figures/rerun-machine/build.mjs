// Fig 1 for the BigQuery Rerun Manager case study, drawn with the Anatomy kit
// (figures/anatomy-kit, MIT). Run `node figures/rerun-machine/build.mjs` to
// write public/figures/rerun-machine.html, which the case page embeds.
//
// The machine is the system:
//   card rack     = query metadata table (swap cards, no redeploy)
//   gantry + head = the Kubernetes Job, executing one query at a time
//   clock         = the CronJob that starts each run
//   log box       = the BigQuery execution log; one slip per query fingerprint
// A failed query raises its card's flag. The next run reruns the group: the
// red slip turns green in place and no new slip is filed (idempotent reruns).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../anatomy-kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const kitScript = () => readFileSync(join(HERE, "..", "anatomy-kit", "iso-kit.mjs"), "utf8").replace(/^export /gm, "");

const WIDTH = 640;
const HEIGHT = 400;

// ---- world (units ≈ px of the real thing; x, y on the bench, z up) ----
const PLATE = { x: -150, y: -74, w: 278, d: 134, r: 9 };
const PLATE_H = 10;
const FOOT_H = 5;

const TRAY = { x: -128, y: -26, w: 114, d: 52, r: 3 };
const TRAY_WALL = 2.4;
const TRAY_H = 10;
const CARD = { w: 2.2, d: 40, h: 30 };
const CARD_Y = -20;
const CARD_Z = 1.2;
const CARD_TOP = CARD_Z + CARD.h;
// two query groups; a divider plate sits between them
const GROUPS = [
  { name: "A", xs: [-118, -110, -102, -94, -86, -78] },
  { name: "B", xs: [-50, -42, -34, -26] },
];
const DIVIDERS = [-64];
const CARDS = GROUPS.flatMap((g, gi) => g.xs.map((x, i) => ({ x, group: gi, label: g.name + (i + 1) })));

const RAIL_Y = [-36, 36];
const RAIL_FROM = -134;
const RAIL_TO = 30;
const RAIL_Z = 46;
const RAIL_H = 4;
const POSTS_X = [-128, -52, 24];
const HOME_X = -134 + 8;

const BRIDGE_W = 12;
const BEAM_Z = RAIL_Z + RAIL_H + 1.2;
const HEAD_Z = 36; // underside of the read head at rest
const PLUNGER_REST = 3.2; // gap above a card top at rest

const LOG = { x: 12, y: -24, w: 78, d: 48, r: 3 };
const LOG_H = 15;
const SLIP = { w: 1.6, d: 38, h: 20 };
const SLIP_X0 = 18;
const SLIP_STEP = 5.2;
const SLIPS = 13;

const CLOCK = [100, -48];
const CLOCK_R = 15;
const CLOCK_Z = 2;
const CLOCK_H = 16;
const CLOCK_TOP = CLOCK_Z + CLOCK_H;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [RAIL_FROM, RAIL_Y[0], BEAM_Z + 8],
    [RAIL_TO + 10, RAIL_Y[1], BEAM_Z + 8],
    [CLOCK[0], CLOCK[1] - CLOCK_R, CLOCK_TOP],
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 40 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ---------------------------------------------------------------- base
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(slab(PLATE, -PLATE_H, PLATE_H, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strip along the front edge
  const strip = { x: -132, y: PLATE.y + PLATE.d - 13, w: 160, d: 6, r: 1 };
  out.push(S(slab(strip, 0, 0.6), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
  // label plate, front right
  const label = { x: 40, y: PLATE.y + PLATE.d - 18, w: 46, d: 11, r: 1.2 };
  out.push(S(slab(label, 0, 0.8, 3, 0.3), { tone: "mid", crease: "none" }));
  out.push(D(k.corners(label, 2).map(([x, y]) => at([x, y, 0.8])), { size: 0.4 }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 5, label.y + 4.6], 0.8, P, "x"), "RERUN-01", { size: 3, tone: "mid" }));
  out.push(L([0, 1, 2].map((i) => k.lineOnTop([label.x + 5, label.y + 6.6 + i * 1.4], [label.x + 5 + (i === 2 ? 20 : 34), label.y + 6.6 + i * 1.4], 0.8, P)).join(""), { tone: "faint", free: true }));
  return out.join("");
}

// ---------------------------------------------------------------- cron clock (back right)
function clock() {
  const [x, y] = CLOCK;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - CLOCK_R, y: y - CLOCK_R, w: CLOCK_R * 2, d: CLOCK_R * 2, r: CLOCK_R }, CLOCK_Z, 1, P)}" style="filter:blur(4px)"/>`];
  out.push(S(slab({ x: x - CLOCK_R - 3, y: y - CLOCK_R - 3, w: CLOCK_R * 2 + 6, d: CLOCK_R * 2 + 6, r: 4 }, 0, CLOCK_Z, 4, 0.4), { tone: "lo" }));
  out.push(D(k.corners({ x: x - CLOCK_R - 3, y: y - CLOCK_R - 3, w: CLOCK_R * 2 + 6, d: CLOCK_R * 2 + 6 }, 2.4).map(([px, py]) => at([px, py, CLOCK_Z])), { size: 0.4 }));
  out.push(S(k.cylinder(x, y, CLOCK_R, CLOCK_Z, CLOCK_H, P, 64, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.sideArc(x, y, CLOCK_R, CLOCK_Z + 4, P, 40), { tone: "faint" }));
  out.push(L(k.knurl(x, y, CLOCK_R, CLOCK_TOP - 3, CLOCK_TOP, 72, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(x, y, CLOCK_R - 2, CLOCK_TOP, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, CLOCK_R - 2.8, 60, 5, CLOCK_TOP, [1.1, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // the "fire" mark at 12
  out.push(L(k.lineOnTop([x, y - CLOCK_R + 2.8], [x, y - CLOCK_R + 6.4], CLOCK_TOP, P), { tone: "hi" }));
  out.push(L(k.ring(x, y, 1.5, CLOCK_TOP, P, 16), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 7.5], CLOCK_TOP, P, "x"), "CRON", { size: 2.2, tone: "lo", anchor: "middle" }));
  // crown on the +x side
  out.push(S(k.slabOf({ x: x + CLOCK_R - 0.6, y: y - 1.6, w: 3.4, d: 3.2, r: 1 }, CLOCK_Z + 6, 3.4, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(x + CLOCK_R + 4.2, y, 2.4, CLOCK_Z + 5.4, 4.6, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(x + CLOCK_R + 4.2, y, 2.4, CLOCK_Z + 5.4, CLOCK_Z + 10, 16, P), { tone: "lo" }));
  return out.join("");
}
const needleAt = (turn) => {
  const a = turn * Math.PI * 2;
  const [x, y] = CLOCK;
  return k.lineOnTop([x - Math.sin(a) * 3, y + Math.cos(a) * 3], [x + Math.sin(a) * (CLOCK_R - 4.2), y - Math.cos(a) * (CLOCK_R - 4.2)], CLOCK_TOP + 0.2, P);
};

// ---------------------------------------------------------------- gantry rails, posts and motor
function post(x, y) {
  const out = [];
  out.push(S(slab({ x: x - 5, y: y - 5, w: 10, d: 10, r: 1.5 }, 0, 2, 3, 0.4), { tone: "lo" }));
  out.push(D(k.corners({ x: x - 5, y: y - 5, w: 10, d: 10 }, 1.8).map(([px, py]) => at([px, py, 2])), { size: 0.35 }));
  out.push(S(k.cylinder(x, y, 2.6, 2, RAIL_Z - 2, P, 24), { tone: "mid", crease: "none" }));
  out.push(L([14, 30].map((z) => k.sideArc(x, y, 2.6, z, P, 12)).join(""), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, 3.6, RAIL_Z - 3, 3, P, 24), { tone: "mid" }));
  return out.join("");
}
function rail(y) {
  const out = [];
  const plan = { x: RAIL_FROM, y: y - 3, w: RAIL_TO - RAIL_FROM, d: 6, r: 1 };
  out.push(S(slab(plan, RAIL_Z, RAIL_H, 3, 0.4), { tone: "mid" }));
  const ticks = k.topTicks(RAIL_FROM + 6, RAIL_TO - 6, 4, 5, y + 1.4, RAIL_Z + RAIL_H, [1, 2], P);
  out.push(L(ticks.minor, { tone: "faint" }), L(ticks.major, { tone: "lo" }));
  out.push(D(POSTS_X.map((x) => at([x, y, RAIL_Z + RAIL_H])), { size: 0.45 }));
  // end stops
  for (const x of [RAIL_FROM, RAIL_TO - 4]) out.push(S(slab({ x, y: y - 4, w: 4, d: 8, r: 1 }, RAIL_Z + RAIL_H, 3.4, 3, 0.3), { tone: "mid" }));
  return out.join("");
}
function motor() {
  const y = RAIL_Y[0];
  const box = { x: RAIL_TO + 1, y: y - 7, w: 14, d: 14, r: 2 };
  const out = [];
  out.push(S(slab({ x: RAIL_TO - 2, y: y - 4.5, w: 4, d: 9, r: 1 }, RAIL_Z - 2, 8, 2), { tone: "mid", crease: "none" }));
  out.push(S(slab(box, RAIL_Z - 6, 14, 4, 0.6), { tone: "mid" }));
  for (const z of [RAIL_Z - 3, RAIL_Z, RAIL_Z + 3]) out.push(L(k.lineOnTop([box.x + box.w, box.y + 2], [box.x + box.w, box.y + box.d - 2], z, P), { tone: "faint" }));
  out.push(D(k.corners(box, 2.2).map(([px, py]) => at([px, py, RAIL_Z + 8])), { size: 0.4 }));
  out.push(S(k.cylinder(box.x + 7, box.y + 7, 3, RAIL_Z + 8, 1.6, P, 20), { tone: "mid" }));
  return out.join("");
}
function cable() {
  // cron clock -> motor: the trigger. Runs along the bench behind the log box, up the back post.
  const from = [CLOCK[0] - CLOCK_R * 0.7, CLOCK[1] + CLOCK_R * 0.7, CLOCK_Z + 4];
  const via = [
    [CLOCK[0] - 22, CLOCK[1] + 8, 1],
    [RAIL_TO + 8, CLOCK[1] + 8, 1],
    [RAIL_TO + 8, RAIL_Y[0], 1],
  ];
  const to = [RAIL_TO + 8, RAIL_Y[0], RAIL_Z - 6];
  return k.wireSvg(at(from), at(to), { via: via.map(at), tone: "lo" });
}

// ---------------------------------------------------------------- the card rack (query metadata)
function trayBack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(TRAY, 0, 1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(slab(TRAY, 0, 1.2, 4, 0.3), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(TRAY, 4), 1.2, P), { tone: "faint" }));
  // back (−y) and left (−x) walls
  out.push(S(slab({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: TRAY_WALL, r: 0.6 }, 1.2, TRAY_H), { tone: "mid" }));
  out.push(S(slab({ x: TRAY.x, y: TRAY.y, w: TRAY_WALL, d: TRAY.d, r: 0.6 }, 1.2, TRAY_H), { tone: "mid" }));
  return out.join("");
}
function trayFront() {
  const out = [];
  const front = { x: TRAY.x, y: TRAY.y + TRAY.d - TRAY_WALL, w: TRAY.w, d: TRAY_WALL, r: 0.6 };
  out.push(S(slab(front, 1.2, TRAY_H), { tone: "mid" }));
  out.push(S(slab({ x: TRAY.x + TRAY.w - TRAY_WALL, y: TRAY.y, w: TRAY_WALL, d: TRAY.d, r: 0.6 }, 1.2, TRAY_H), { tone: "mid" }));
  // index strip on the front wall with a tick under every card slot
  const tick = CARDS.map((c) => k.segment([c.x + CARD.w / 2, front.y + TRAY_WALL, 1.2 + TRAY_H - 1.6], [c.x + CARD.w / 2, front.y + TRAY_WALL, 1.2 + TRAY_H - 4], P)).join("");
  out.push(L(tick, { tone: "lo" }));
  out.push(L(k.segment([TRAY.x + 3, front.y + TRAY_WALL, 1.2 + TRAY_H - 1.6], [TRAY.x + TRAY.w - 3, front.y + TRAY_WALL, 1.2 + TRAY_H - 1.6], P), { tone: "faint" }));
  out.push(D([at([TRAY.x + 3, front.y + TRAY_WALL, 6]), at([TRAY.x + TRAY.w - 3, front.y + TRAY_WALL, 6])], { size: 0.4 }));
  GROUPS.forEach((g, gi) => {
    const mid = (g.xs[0] + g.xs[g.xs.length - 1]) / 2;
    out.push(k.faceTextSvg(k.sideMatrix([mid, front.y + TRAY_WALL], 1.2 + TRAY_H - 6.2, P, "left"), "GROUP " + g.name, { size: 2.4, tone: "lo", anchor: "middle" }));
  });
  return out.join("");
}
function divider(x) {
  const plan = { x, y: CARD_Y - 2, w: 1.6, d: CARD.d + 4, r: 0.4 };
  const out = [S(slab(plan, CARD_Z, CARD.h - 6), { tone: "mid" })];
  out.push(S(slab({ x, y: CARD_Y + CARD.d - 12, w: 1.6, d: 12, r: 0.6 }, CARD_Z + CARD.h - 6, 8), { tone: "mid" }));
  return out.join("");
}
// One card: a slab with a group tab on its top edge, punched holes on its +x
// face, and a flag at its back end that rises when the query fails.
function card(c, index, showHoles) {
  const out = [];
  const plan = { x: c.x, y: CARD_Y, w: CARD.w, d: CARD.d, r: 0.5 };
  out.push(S(slab(plan, CARD_Z, CARD.h, 2, 0.2), { tone: "hi", crease: "lo" }));
  // group tab: A tabs sit forward, B tabs further back
  const tabY = CARD_Y + (c.group === 0 ? 24 : 14);
  out.push(S(slab({ x: c.x, y: tabY, w: CARD.w, d: 8, r: 0.6 }, CARD_TOP, 2.6, 2, 0.2), { tone: "hi", crease: "lo" }));
  // printed rule lines on the top edge read as the query id
  out.push(L(k.lineOnTop([c.x + CARD.w / 2, CARD_Y + 2], [c.x + CARD.w / 2, CARD_Y + 9], CARD_TOP, P), { tone: "lo", free: true }));
  if (showHoles) {
    const holes = [];
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 9; col++) if ((col * 7 + row * 3 + index) % 4 !== 0) holes.push(at([c.x + CARD.w, CARD_Y + 4 + col * 4, CARD_Z + 7 + row * 5]));
    out.push(D(holes, { size: 0.42, tone: "mid" }));
  }
  // flag: a thin slab in a slot at the card's back end
  const flag = `<g data-flag="${index}">${S(slab({ x: c.x + 0.3, y: CARD_Y + 1.5, w: CARD.w - 0.6, d: 4, r: 0.4 }, CARD_TOP - 6, 6, 2), { tone: "mid", crease: "none", className: "flag" })}</g>`;
  out.push(flag);
  // armed marker (a query you broke on purpose), hidden until clicked
  out.push(`<g data-armed="${index}" style="opacity:0">${D([at([c.x + CARD.w / 2, CARD_Y + CARD.d - 4, CARD_TOP])], { size: 1.1, tone: "hi" })}</g>`);
  // selection outline for keyboard focus
  out.push(`<path data-select="${index}" class="iso-line" data-tone="lit" style="opacity:0" d="${k.planOutline({ ...plan, r: 0.5 }, CARD_TOP + 0.1, P)}"/>`);
  return `<g data-card="${index}" class="card">${out.join("")}</g>`;
}
function rack() {
  const lastOf = new Set(GROUPS.map((g) => g.xs[g.xs.length - 1]));
  const items = [
    ...CARDS.map((c, i) => ({ x: c.x, svg: card(c, i, lastOf.has(c.x)) })),
    ...DIVIDERS.map((x) => ({ x, svg: divider(x) })),
  ].sort((a, b) => a.x - b.x);
  return items.map((i) => i.svg).join("");
}

// ---------------------------------------------------------------- gantry bridge + read head (moves in x)
function bridge() {
  const out = [];
  const x = -BRIDGE_W / 2;
  // bushings riding each rail
  for (const y of RAIL_Y) {
    out.push(S(slab({ x: x - 1, y: y - 5, w: BRIDGE_W + 2, d: 10, r: 1.4 }, RAIL_Z + RAIL_H, 1.2 + 3, 3, 0.4), { tone: "mid" }));
    out.push(D([at([x + 1.4, y - 3.4, BEAM_Z + 3]), at([x + BRIDGE_W - 1.4, y + 3.4, BEAM_Z + 3])], { size: 0.4 }));
  }
  // beam
  out.push(S(slab({ x: x + 1, y: RAIL_Y[0] - 2, w: BRIDGE_W - 2, d: RAIL_Y[1] - RAIL_Y[0] + 4, r: 1 }, BEAM_Z + 3, 4, 3, 0.4), { tone: "mid" }));
  out.push(L(k.lineOnTop([0, RAIL_Y[0] + 4], [0, RAIL_Y[1] - 4], BEAM_Z + 7, P), { tone: "faint" }));
  // head carrier hanging under the beam
  out.push(S(slab({ x: -4.5, y: -8, w: 9, d: 16, r: 1.4 }, HEAD_Z + 4, BEAM_Z + 3 - HEAD_Z - 4, 3, 0.5), { tone: "mid" }));
  out.push(L([HEAD_Z + 8, HEAD_Z + 11].map((z) => k.lineOnTop([4.5, -6], [4.5, 6], z, P)).join(""), { tone: "faint" }));
  out.push(D([at([4.5, -6, HEAD_Z + 13]), at([4.5, 6, HEAD_Z + 13])], { size: 0.4 }));
  out.push(S(slab({ x: -3.6, y: -6, w: 7.2, d: 12, r: 1.2 }, HEAD_Z, 4, 3, 0.4), { tone: "hi", lit: true }));
  return out.join("");
}
function plunger() {
  // pin under the head; its group moves down onto the card being executed
  const len = HEAD_Z - CARD_TOP - PLUNGER_REST;
  return S(k.cylinder(0, CARD_Y + CARD.d / 2, 1.2, CARD_TOP + PLUNGER_REST, len, P, 16), { tone: "hi", crease: "none", lit: true });
}

// ---------------------------------------------------------------- log box (execution log table)
function logBack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(LOG, 0, 1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(slab(LOG, 0, 1.2, 4, 0.3), { tone: "lo" }));
  out.push(S(slab({ x: LOG.x, y: LOG.y, w: LOG.w, d: 2.2, r: 0.6 }, 1.2, LOG_H), { tone: "mid" }));
  out.push(S(slab({ x: LOG.x, y: LOG.y, w: 2.2, d: LOG.d, r: 0.6 }, 1.2, LOG_H), { tone: "mid" }));
  return out.join("");
}
function slip(i) {
  const x = SLIP_X0 + i * SLIP_STEP;
  const y = LOG.y + 5;
  const out = [];
  out.push(S(slab({ x, y, w: SLIP.w, d: SLIP.d, r: 0.4 }, 1.2, SLIP.h, 2, 0.2), { tone: "hi", crease: "lo" }));
  out.push(L(k.lineOnTop([x + SLIP.w / 2, y + 3], [x + SLIP.w / 2, y + 12], 1.2 + SLIP.h, P), { tone: "lo", free: true }));
  // status tab: coloured because status is the subject
  out.push(S(slab({ x, y: y + SLIP.d - 10, w: SLIP.w, d: 7, r: 0.5 }, 1.2 + SLIP.h, 3, 2, 0.2), { tone: "hi", crease: "none", className: "tab" }));
  return `<g data-slip="${i}" style="opacity:0">${out.join("")}</g>`;
}
function logFront() {
  const out = [];
  const front = { x: LOG.x, y: LOG.y + LOG.d - 2.2, w: LOG.w, d: 2.2, r: 0.6 };
  out.push(S(slab(front, 1.2, LOG_H), { tone: "mid" }));
  out.push(S(slab({ x: LOG.x + LOG.w - 2.2, y: LOG.y, w: 2.2, d: LOG.d, r: 0.6 }, 1.2, LOG_H), { tone: "mid" }));
  // label holder and pull on the front face
  const lz = 1.2 + LOG_H;
  const holder = [[LOG.x + 24, lz - 4], [LOG.x + 54, lz - 4], [LOG.x + 54, lz - 10], [LOG.x + 24, lz - 10]];
  out.push(L(k.pathOf(holder.map(([x, z]) => at([x, front.y + 2.2, z])), true), { tone: "lo" }));
  out.push(D(holder.slice(0, 2).map(([x, z]) => at([x, front.y + 2.2, z])), { size: 0.4 }));
  out.push(k.faceTextSvg(k.sideMatrix([LOG.x + 39, front.y + 2.2], lz - 5.6, P, "left"), "EXEC LOG", { size: 2.3, tone: "mid", anchor: "middle" }));
  out.push(L(k.segment([LOG.x + 3, front.y + 2.2, lz - 1.2], [LOG.x + LOG.w - 3, front.y + 2.2, lz - 1.2], P), { tone: "faint" }));
  return out.join("");
}

// ---------------------------------------------------------------- assemble
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A query-card machine. A rack holds punched cards in two groups, each card one query's metadata. A gantry on two rails carries a read head that presses each card in turn, which is the Kubernetes Job running the group's queries one after another; a cron clock behind it starts each run. Every run files a slip in an execution log box, green for success and red for failure. A failed card raises a flag, and the next run reruns the group: the red slip turns green in place and no new slip is filed.",
  body: [
    plate(),
    clock(),
    `<path data-part="needle" class="iso-line" data-tone="hi" data-free="start" d="${needleAt(0.55)}" style="stroke-width:1"/>`,
    cable(),
    ...POSTS_X.map((x) => post(x, RAIL_Y[0])),
    rail(RAIL_Y[0]),
    motor(),
    trayBack(),
    rack(),
    trayFront(),
    logBack(),
    ...Array.from({ length: SLIPS }, (_, i) => slip(i)),
    logFront(),
    ...POSTS_X.map((x) => post(x, RAIL_Y[1])),
    rail(RAIL_Y[1]),
    `<g data-part="plunger" transform="${k.translateAlong(P, [HOME_X, 0, 0])}"><g data-part="pin">${plunger()}</g></g>`,
    `<g data-part="bridge" transform="${k.translateAlong(P, [HOME_X, 0, 0])}">${bridge()}</g>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const CARDS = ${JSON.stringify(CARDS)};
const GROUPS = ${JSON.stringify(GROUPS.map((g, gi) => ({ name: g.name, cards: CARDS.map((c, i) => (c.group === gi ? i : -1)).filter((i) => i >= 0) })))};
const CARD_W = ${CARD.w}, HOME_X = ${HOME_X}, SLIPS = ${SLIPS}, PRESS = ${PLUNGER_REST};
const CLOCK = ${JSON.stringify(CLOCK)}, CLOCK_R = ${CLOCK_R}, CLOCK_TOP = ${CLOCK_TOP};
const needleAt = ${needleAt.toString().replace("k.lineOnTop", "lineOnTop")};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (q) => svg.querySelector(q);
const bridge = $('[data-part="bridge"]'), plungerG = $('[data-part="plunger"]'), pin = $('[data-part="pin"]'), needle = $('[data-part="needle"]');
const flags = CARDS.map((_, i) => $('[data-flag="' + i + '"]'));
const armed = CARDS.map((_, i) => $('[data-armed="' + i + '"]'));
const selects = CARDS.map((_, i) => $('[data-select="' + i + '"]'));
const slips = Array.from({ length: SLIPS }, (_, i) => $('[data-slip="' + i + '"]'));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");

// ---- model: the same numbers drive motion and readout
const secondsOf = (i) => 9 + ((i * 7 + 3) % 19);            // each query runs 9–27 s, under 30 s on average
const state = { broken: CARDS.map(() => false), failed: CARDS.map(() => false), slipOf: CARDS.map(() => -1), slipOk: [], rows: 0 };
state.broken[3] = true;                                   // A4 hits a transient upstream error on the first run

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
let gx = HOME_X, press = 0, turn = 0.55, text = "idle · waiting for cron";
const flagRise = CARDS.map(() => 0), flagGoal = CARDS.map(() => 0);
const slipDrop = Array.from({ length: SLIPS }, () => 1), slipFlash = Array.from({ length: SLIPS }, () => 0);

function setSlip(i, ok) {
  state.slipOk[i] = ok;
  slips[i].querySelector(".tab").setAttribute("class", "iso-solid tab " + (ok ? "ok" : "bad"));
}
function draw() {
  bridge.setAttribute("transform", translateAlong(P, [gx, 0, 0]));
  plungerG.setAttribute("transform", translateAlong(P, [gx, 0, 0]));
  pin.setAttribute("transform", translateAlong(P, [0, 0, -press * PRESS]));
  needle.setAttribute("d", needleAt(turn));
  flags.forEach((f, i) => { f.setAttribute("transform", translateAlong(P, [0, 0, flagRise[i] * 7])); f.classList.toggle("up", flagRise[i] > 0.05); });
  slips.forEach((s, i) => {
    const shown = i < state.rows;
    s.style.opacity = shown ? String(Math.min(1, 1.4 - slipDrop[i])) : "0";
    s.setAttribute("transform", translateAlong(P, [0, 0, slipDrop[i] * 22]));
    s.classList.toggle("flash", slipFlash[i] > 0);
  });
  if (readout.textContent !== text) readout.textContent = text;
}

// ---- a run is a list of timed steps; each step tweens from its start values
const steps = [];
const step = (dur, fn, done) => steps.push({ dur, fn, done });
function moveTo(x, dur = 0.7) { let from; step(dur, (t) => { from ??= gx; gx = lerp(from, x, ease(t)); }); }
function wait(dur, fn) { step(dur, () => {}, fn); }
function cron() { let from; step(1.4, (t) => { from ??= turn % 1; turn = lerp(from, 1, ease(t)); }, () => { turn = 0; }); }

function planRun(g, rerun) {
  const group = GROUPS[g];
  step(0.01, () => {}, () => { text = (rerun ? "cron · rerun group " : "cron · run group ") + group.name; });
  cron();
  let ok = 0, fail = 0, added = 0;
  group.cards.forEach((ci, n) => {
    moveTo(CARDS[ci].x + CARD_W / 2, n === 0 ? 1.0 : 0.55);
    step(0.3, (t) => { press = ease(t); }, () => { text = (rerun ? "rerun " : "run ") + CARDS[ci].label + " · " + secondsOf(ci) + " s"; });
    wait(0.55, () => {
      const failed = state.broken[ci];
      state.broken[ci] = false;
      armed[ci].style.opacity = "0";
      state.failed[ci] = failed;
      flagGoal[ci] = failed ? 1 : 0;
      failed ? fail++ : ok++;
      let slot = state.slipOf[ci];
      const isNew = slot < 0;
      if (isNew) {
        if (state.rows >= SLIPS) archive();
        slot = state.rows++;
        state.slipOf[ci] = slot;
        slipDrop[slot] = 1;
        added++;
      } else slipFlash[slot] = 0.6;   // same fingerprint: update the row in place
      setSlip(slot, !failed);
      text = CARDS[ci].label + (failed ? " · failed · flagged for rerun" : isNew ? " · ok · row filed" : " · ok · same row updated");
    });
    step(0.25, (t) => { press = 1 - ease(t); });
  });
  moveTo(HOME_X, 1.0);
  wait(1.6, () => {
    text = (rerun ? "rerun " : "run ") + group.name + " · " + ok + " ok · " + fail + " failed · " + (added ? "+" + added : "0 new") + " rows · " + state.rows + " in log";
  });
}
function archive() {
  // the log box is full: archive it (fade the slips) and start a fresh box
  state.rows = 0; state.slipOf = CARDS.map(() => -1);
  slipDrop.fill(1);
}
let group = 0, runs = 0;
function nextRun() {
  if (GROUPS[group].cards.some((ci) => state.failed[ci])) return planRun(group, true);
  if (runs++ > 0) group = (group + 1) % GROUPS.length;
  // every third fresh run, one query hits a transient error (unless you already broke one)
  const cards = GROUPS[group].cards;
  if (runs > 1 && runs % 3 === 0 && !cards.some((ci) => state.broken[ci])) state.broken[cards[(runs / 3) % cards.length]] = true;
  planRun(group, false);
}

let frame = 0, last = 0, visible = false, current = null, elapsed = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  if (!current) { if (!steps.length) nextRun(); current = steps.shift(); elapsed = 0; }
  elapsed += dt;
  const t = Math.min(1, elapsed / current.dur);
  current.fn(t);
  if (t >= 1) { current.done?.(); current = null; }
  // idle cron hand creeps; flags and slips follow with exponential ease
  if (!current || current.dur > 0.5) turn += dt * 0.02;
  for (let i = 0; i < flagRise.length; i++) flagRise[i] += (flagGoal[i] - flagRise[i]) * (1 - Math.exp(-dt / 0.12));
  for (let i = 0; i < SLIPS; i++) {
    const goal = i < state.rows ? 0 : 1;
    slipDrop[i] += (goal - slipDrop[i]) * (1 - Math.exp(-dt / 0.14));
    if (slipFlash[i] > 0) slipFlash[i] = Math.max(0, slipFlash[i] - dt);
  }
  draw();
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "80px 0px" }).observe(stage);

// ---- interaction: click a card (or arrow + Enter) to break its query on its next run
let sel = -1;
const arm = (i) => { state.broken[i] = !state.broken[i]; armed[i].style.opacity = state.broken[i] ? "1" : "0"; text = CARDS[i].label + (state.broken[i] ? " · armed to fail on its next run" : " · disarmed"); draw(); };
svg.querySelectorAll("[data-card]").forEach((g) => {
  g.style.cursor = "pointer";
  g.addEventListener("click", () => arm(+g.dataset.card));
});
const showSel = () => selects.forEach((s, i) => (s.style.opacity = i === sel ? "1" : "0"));
stage.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") sel = Math.min(CARDS.length - 1, sel + 1);
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") sel = Math.max(0, sel - 1);
  else if ((e.key === "Enter" || e.key === " ") && sel >= 0) arm(sel);
  else return;
  e.preventDefault();
  showSel();
});
stage.addEventListener("blur", () => { sel = -1; showSel(); });

if (still.matches) {
  // reduced motion: one still frame after the first run
  state.rows = 6; for (let i = 0; i < 6; i++) { state.slipOf[i] = i; slipDrop[i] = 0; setSlip(i, i !== 3); }
  state.failed[3] = true; flagRise[3] = 1; flagGoal[3] = 1; text = "run A · 5 ok · 1 failed · A4 flagged for rerun";
}
draw();

// ---- embed: follow the site's theme and size the iframe to the figure
const COMPACT = /[?&]compact/.test(location.search);
if (COMPACT) document.documentElement.classList.add("compact");
const syncTheme = () => {
  let t = null;
  try { t = parent.document.documentElement.getAttribute("data-theme"); } catch (e) {}
  if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.body.setAttribute("data-theme", t === "light" ? "light" : "dark");
};
syncTheme();
try { new MutationObserver(syncTheme).observe(parent.document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] }); } catch (e) {}
const fit = () => { try { if (frameElement && !COMPACT) frameElement.style.height = Math.ceil(document.querySelector(".iso-page").getBoundingClientRect().height) + "px"; } catch (e) {} };
addEventListener("load", fit); addEventListener("resize", fit); fit();
`;

const EXTRA_CSS = `
html,body{color-scheme:normal!important;background:transparent!important}
.iso-page{width:100%!important;margin:0!important}
.iso-figure{margin:0!important}
.iso-stage{outline:none}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-mid);outline-offset:4px}
.flag.iso-solid{transition:none}
g.up .flag>.iso-top,g.up .flag>.iso-fill{fill:var(--anatomy-red)}
g.up .flag>.iso-shade{fill:color-mix(in srgb,var(--anatomy-red) 70%,#000)}
.tab.ok>.iso-top,.tab.ok>.iso-fill{fill:var(--anatomy-green)}
.tab.ok>.iso-shade{fill:color-mix(in srgb,var(--anatomy-green) 65%,#000)}
.tab.bad>.iso-top,.tab.bad>.iso-fill{fill:var(--anatomy-red)}
.tab.bad>.iso-shade{fill:color-mix(in srgb,var(--anatomy-red) 65%,#000)}
g.flash .tab>.iso-top{fill:var(--anatomy-lit)}
.card:hover>.iso-solid:first-child>.iso-top{fill:var(--anatomy-lit-top)}
html.compact,html.compact body,html.compact .iso-page,html.compact .iso-figure,html.compact .iso-plate{height:100%}
html.compact .iso-legend{display:none}
html.compact .iso-plate-corners{top:64px;left:max(20px,calc((100vw - 1100px) / 2));right:max(20px,calc((100vw - 1100px) / 2))}
html.compact .iso-plate{display:flex;align-items:center;justify-content:center;padding:44px 18px;box-shadow:none;border-radius:inherit;background:transparent;--anatomy-card:transparent}
html.compact .iso-stage{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
html.compact .iso-svg{width:100%;height:100%;max-height:100%}
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Query rerun machine",
  hint: "Click a card to break its query",
  readout: "idle · waiting for cron",
  keys: [
    { mark: "lit", label: "Read head: the Kubernetes Job, running one query at a time" },
    { mark: "raised", label: "Cards: query metadata, two groups" },
    { mark: "red", label: "Raised flag / red slip: failed run" },
    { mark: "green", label: "Green slip: logged success" },
  ],
  caption:
    "Queries live as cards in a rack, so changing one is swapping a card, not shipping code. On each cron tick the gantry runs a group, pressing every card in turn, and files one slip per query in the execution log. A failure raises that card's flag; the next tick reruns the group, and because each slip is keyed by the query's fingerprint, the red slip turns green in place instead of a duplicate being filed.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Query rerun machine. Arrow keys select a card, Enter breaks its query on the next run.">${svg}</div>`,
});

const html = k.pageHtml({ title: "Query rerun machine", theme: "dark", body, script: kitScript() + live }).replace("</style>", EXTRA_CSS + "</style>");
const out = join(ROOT, "public", "figures", "rerun-machine.html");
writeFileSync(out, html);
console.log("wrote", out, Math.round(html.length / 1024) + " KB");
