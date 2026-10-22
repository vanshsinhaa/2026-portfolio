// Fig 3 for the BigQuery Rerun Manager case study: the execution flow as a marble run.
// Run `node figures/bq-marbles/build.mjs` to write public/figures/bq-marbles.html.
//
// Numbered badges match the steps of the original sequence diagram:
//   1 start container   the lever: the Job starts the container
//   2 fetch queries     the group's active queries drop into the hopper, one marble each
//   3 execute SQL       each marble rolls through the BigQuery tunnel, one at a time (the loop)
//   4 log success       the switch sends it to the success bin (status + timestamps)
//   5 log failure       ... or to the failure bin (error message + failure status)
//   6 exit job          the hopper is empty, the flag goes up, the job exits
import * as k from "../anatomy-kit/iso-kit.mjs";
import { writePage } from "../shared.mjs";

const WIDTH = 640;
const HEIGHT = 420;

const PLATE = { x: -158, y: -76, w: 236, d: 146, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;
const MR = 3.2; // marble radius

const LEVER = { x: -150, y: 30, w: 12, d: 12, r: 1.5 };
const LEVER_PIVOT = [LEVER.x + 6, LEVER.y + 6, 7];
const HOPPER = { x: -128, y: -20, w: 24, d: 24, r: 2 };
const HOP_Z = 62, HOP_H = 16;
const RAIL_GAP = 2.4;
const ROUTE_A = [[-104, -8, HOP_Z + 2], [-52, -8, 50]]; // hopper outlet -> tunnel mouth
const TUNNEL = { x: -52, y: -15, w: 30, d: 14, r: 1.5 };
const TUNNEL_Z = 42, TUNNEL_H = 16;
const ROUTE_B = [[-22, -8, 47], [6, -8, 41]]; // tunnel exit -> switch
const SWITCH = [10, -8, 40];
const OK_BRANCH = [SWITCH, [34, 30, 18], [42, 40, 13]];
const FAIL_BRANCH = [SWITCH, [40, -40, 18], [48, -48, 13]];
const BIN_OK = { x: 30, y: 30, w: 30, d: 24, r: 1.5 };
const BIN_FAIL = { x: 36, y: -62, w: 30, d: 24, r: 1.5 };
const BIN_H = 12;
const FLAG_POST = [-100, 40];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [HOPPER.x, HOPPER.y, HOP_Z + HOP_H + 30], [TUNNEL.x + TUNNEL.w, TUNNEL.y, TUNNEL_Z + TUNNEL_H]],
  WIDTH,
  HEIGHT,
  { pad: 20, azimuth: 40 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
const f1 = (n) => (Math.round(n * 10) / 10).toString();

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 22)) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(slab(PLATE, -PLATE_H, PLATE_H, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// numbered badges on the bench, one per step of the sequence
const BADGES = [
  { n: 1, at: [LEVER.x + 6, LEVER.y + LEVER.d + 8] },
  { n: 2, at: [HOPPER.x + HOPPER.w / 2, HOPPER.y + HOPPER.d + 26] },
  { n: 3, at: [TUNNEL.x + TUNNEL.w / 2 + 4, TUNNEL.y + TUNNEL.d + 12] },
  { n: 4, at: [BIN_OK.x + BIN_OK.w / 2, BIN_OK.y + BIN_OK.d + 7] },
  { n: 5, at: [BIN_FAIL.x + BIN_FAIL.w + 8, BIN_FAIL.y + BIN_FAIL.d / 2] },
  { n: 6, at: [FLAG_POST[0] + 9, FLAG_POST[1] + 10] },
];
function badges() {
  return BADGES.map((b) => {
    const disc = S(k.cylinder(b.at[0], b.at[1], 5.6, 0, 0.9, P, 32), { tone: "mid", crease: "none" });
    const num = k.faceTextSvg(k.topMatrix([b.at[0], b.at[1] + 2], 0.9, P, "x"), String(b.n), { size: 5.6, tone: "hi", anchor: "middle" });
    return `<g class="badge" data-badge="${b.n}">${disc}${num}</g>`;
  }).join("");
}

// ---------------------------------------------------------------- rails: two lines, sleepers and posts under a polyline
function track(route, { posts = true } = {}) {
  const out = [];
  const left = [], right = [], ties = [], legs = [];
  for (let i = 0; i < route.length - 1; i++) {
    const [a, b] = [route[i], route[i + 1]];
    const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
    const nx = -dy / m * RAIL_GAP, ny = dx / m * RAIL_GAP;
    const steps = Math.max(1, Math.round(Math.hypot(dx, dy, b[2] - a[2]) / 5));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const p = [a[0] + dx * t, a[1] + dy * t, a[2] + (b[2] - a[2]) * t];
      if (s || !i) { left.push(at([p[0] + nx, p[1] + ny, p[2]])); right.push(at([p[0] - nx, p[1] - ny, p[2]])); }
      ties.push(k.segment([p[0] + nx * 1.3, p[1] + ny * 1.3, p[2] - 0.6], [p[0] - nx * 1.3, p[1] - ny * 1.3, p[2] - 0.6], P));
      if (posts && s > 0 && s < steps && s % 4 === 2 && p[2] > 4) legs.push(p);
    }
  }
  out.push(L(ties.join(""), { tone: "faint" }));
  for (const p of legs) {
    out.push(S(k.cylinder(p[0], p[1], 0.8, 0, p[2] - 1, P, 10), { tone: "mid", crease: "none" }));
    out.push(S(k.cylinder(p[0], p[1], 2, 0, 0.8, P, 14), { tone: "lo" }));
  }
  out.push(`<path class="rail" d="${k.pathOf(left)}"/><path class="rail" d="${k.pathOf(right)}"/>`);
  return out.join("");
}

// ---------------------------------------------------------------- stations
function lever() {
  const out = [S(slab(LEVER, 0, 7, 3, 0.6), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(LEVER, 2), 7, P, 3), { tone: "faint" }));
  out.push(k.faceTextSvg(k.sideMatrix([LEVER.x + LEVER.w / 2, LEVER.y + LEVER.d], 4.4, P, "left"), "K8S JOB", { size: 1.8, tone: "lo", anchor: "middle" }));
  out.push(`<path data-part="lever" class="iso-line" data-tone="hi" d="" style="stroke-width:1.6"/><circle data-part="knob" class="knob" r="2.2"/>`);
  return out.join("");
}
function hopper(part) {
  const { x, y, w, d } = HOPPER;
  const z = HOP_Z;
  const wall = 1.2;
  if (part === "back") {
    const out = [];
    for (const [px, py] of [[x + 2, y + 2], [x + w - 2, y + 2], [x + 2, y + d - 2], [x + w - 2, y + d - 2]]) out.push(S(k.cylinder(px, py, 1, 0, z, P, 12), { tone: "mid", crease: "none" }));
    out.push(S(slab({ x, y, w, d, r: 2 }, z - 2, 2, 3, 0.3), { tone: "lo" }));
    out.push(S(slab({ x, y, w, d: wall, r: 0.3 }, z, HOP_H), { tone: "mid" }));
    out.push(S(slab({ x, y, w: wall, d, r: 0.3 }, z, HOP_H), { tone: "mid" }));
    return out.join("");
  }
  const out = [];
  out.push(S(slab({ x, y: y + d - wall, w, d: wall, r: 0.3 }, z, HOP_H), { tone: "mid" }));
  out.push(S(slab({ x: x + w - wall, y, w: wall, d, r: 0.3 }, z, HOP_H), { tone: "mid" }));
  out.push(k.faceTextSvg(k.sideMatrix([x + w / 2, y + d], z + HOP_H - 4, P, "left"), "QUERY_METADATA", { size: 2, tone: "lo", anchor: "middle" }));
  out.push(k.faceTextSvg(k.sideMatrix([x + w / 2, y + d], z + HOP_H - 7.5, P, "left"), "group A · active", { size: 1.8, tone: "faint", anchor: "middle" }));
  // gate on the outlet
  out.push(`<g data-part="gate">${S(slab({ x: x + w, y: -11, w: 1.2, d: 6, r: 0.3 }, z + 1, 6, 2), { tone: "hi", crease: "none" })}</g>`);
  return out.join("");
}
function tunnel() {
  const { x, y, w, d } = TUNNEL;
  const out = [S(slab(TUNNEL, TUNNEL_Z, TUNNEL_H, 3, 0.6), { tone: "mid" })];
  // an arch-shaped mouth on the +x end, a lit window strip on the +y face
  const mouth = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * (i / 16); mouth.push(at([x + w, -8 + Math.cos(a) * 5, TUNNEL_Z + 2 + Math.sin(a) * 6])); }
  out.push(`<path class="mouth" d="${k.pathOf(mouth, true)}"/>`);
  const wz0 = TUNNEL_Z + 6, wz1 = TUNNEL_Z + 10;
  const win = [[x + 3, wz0], [x + w - 3, wz0], [x + w - 3, wz1], [x + 3, wz1]].map(([wx, wz]) => at([wx, y + d, wz]));
  out.push(`<path data-part="window" class="window" d="${k.pathOf(win, true)}"/>`);
  out.push(L(k.pathOf(win, true), { tone: "lo" }));
  out.push(k.faceTextSvg(k.sideMatrix([x + w / 2, y + d], TUNNEL_Z + 3.4, P, "left"), "BIGQUERY · EXECUTE SQL", { size: 1.9, tone: "lo", anchor: "middle" }));
  out.push(L(k.planOutline(k.insetPlan(TUNNEL, 2.5), TUNNEL_Z + TUNNEL_H, P, 3), { tone: "faint" }));
  return out.join("");
}
function switchPart() {
  const out = [S(k.cylinder(SWITCH[0], SWITCH[1], 3.4, SWITCH[2] - 3, 2.2, P, 24, 0.3), { tone: "mid" })];
  out.push(S(k.cylinder(SWITCH[0], SWITCH[1], 1.2, 0, SWITCH[2] - 3, P, 12), { tone: "mid", crease: "none" }));
  out.push(`<path data-part="flipper" class="iso-line" data-tone="lit" d="" style="stroke-width:1.8"/>`);
  return `<g class="switch" data-part="switch">${out.join("")}</g>`;
}
function bin(b, part, label) {
  const wall = 1.2;
  if (part === "back") {
    return [
      S(slab(b, 0, 1.2, 3, 0.3), { tone: "lo" }),
      S(slab({ x: b.x, y: b.y, w: b.w, d: wall, r: 0.3 }, 1.2, BIN_H), { tone: "mid" }),
      S(slab({ x: b.x, y: b.y, w: wall, d: b.d, r: 0.3 }, 1.2, BIN_H), { tone: "mid" }),
    ].join("");
  }
  const out = [
    S(slab({ x: b.x, y: b.y + b.d - wall, w: b.w, d: wall, r: 0.3 }, 1.2, BIN_H), { tone: "mid" }),
    S(slab({ x: b.x + b.w - wall, y: b.y, w: wall, d: b.d, r: 0.3 }, 1.2, BIN_H), { tone: "mid" }),
  ];
  out.push(k.faceTextSvg(k.sideMatrix([b.x + b.w / 2, b.y + b.d], 9.6, P, "left"), label, { size: 2.1, tone: "mid", anchor: "middle" }));
  out.push(`<text class="count" data-count="${label}" transform="${k.sideMatrix([b.x + b.w / 2, b.y + b.d], 4.2, P, "left")}" font-size="3.4" text-anchor="middle">0</text>`);
  return out.join("");
}
function flag() {
  const [x, y] = FLAG_POST;
  const out = [S(k.cylinder(x, y, 2.6, 0, 1.4, P, 16), { tone: "lo" })];
  out.push(S(k.cylinder(x, y, 0.7, 1.4, 34, P, 10), { tone: "mid", crease: "none" }));
  out.push(`<g data-part="flag">${S(slab({ x: x + 0.7, y: y - 0.3, w: 12, d: 0.6, r: 0 }, 6, 7, 1), { tone: "hi", crease: "none" })}${k.faceTextSvg(k.sideMatrix([x + 6.7, y + 0.3], 10.6, P, "left"), "EXIT", { size: 2.4, tone: "lo", anchor: "middle" })}</g>`);
  return out.join("");
}

// ---------------------------------------------------------------- marbles: positions in the hopper and in each bin
const N = 6;
const HOP_SLOTS = Array.from({ length: N }, (_, i) => [HOPPER.x + 6 + (i % 3) * 6.5, HOPPER.y + 8 + Math.floor(i / 3) * 8, HOP_Z + MR]);
const binSlots = (b) => Array.from({ length: N }, (_, i) => [b.x + 7 + (i % 3) * 7.5, b.y + 7 + Math.floor(i / 3) * 8, 1.2 + MR]);
const OK_SLOTS = binSlots(BIN_OK), FAIL_SLOTS = binSlots(BIN_FAIL);
const marbles = () => Array.from({ length: N }, (_, i) => `<g data-marble="${i}" style="opacity:0"><circle class="marble" r="${f1(MR * P.scale)}"/><circle class="shine" r="${f1(MR * P.scale * 0.32)}"/></g>`).join("");

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "The execution flow as a marble run with six numbered stations. 1: a lever marked K8s Job starts the run. 2: the group's active queries drop into a hopper marked query_metadata, one marble per query. 3: one at a time, each marble rolls through a tunnel marked BigQuery, execute SQL. 4 and 5: a switch sends it to the success bin or the failure bin, where it is logged. 6: when the hopper is empty an exit flag goes up.",
  body: [
    plate(),
    badges(),
    bin(BIN_FAIL, "back"),
    bin(BIN_OK, "back"),
    hopper("back"),
    track(ROUTE_A),
    track(ROUTE_B),
    track(FAIL_BRANCH),
    track(OK_BRANCH),
    switchPart(),
    `<path class="extent" d="${k.pathOf([[HOPPER.x, HOPPER.y, HOP_Z + 36], [HOPPER.x + HOPPER.w, HOPPER.y, HOP_Z + 36], [HOPPER.x + HOPPER.w, HOPPER.y + HOPPER.d, HOP_Z + 36]].map(at), true)}"/>`,
    `<g data-part="marbles">${marbles()}</g>`,
    hopper("front"),
    tunnel(),
    bin(BIN_FAIL, "front", "FAILURE"),
    bin(BIN_OK, "front", "SUCCESS"),
    lever(),
    flag(),
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const N = ${N}, MR = ${MR};
const HOP_SLOTS = ${JSON.stringify(HOP_SLOTS)}, OK_SLOTS = ${JSON.stringify(OK_SLOTS)}, FAIL_SLOTS = ${JSON.stringify(FAIL_SLOTS)};
const ROUTE_A = ${JSON.stringify(ROUTE_A)}, ROUTE_B = ${JSON.stringify(ROUTE_B)}, OK_BRANCH = ${JSON.stringify(OK_BRANCH)}, FAIL_BRANCH = ${JSON.stringify(FAIL_BRANCH)};
const SWITCH = ${JSON.stringify(SWITCH)}, LEVER_PIVOT = ${JSON.stringify(LEVER_PIVOT)}, HOP_Z = ${HOP_Z};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (q) => svg.querySelector(q);
const marbleEls = Array.from({ length: N }, (_, i) => $('[data-marble="' + i + '"]'));
const badgeEls = [1, 2, 3, 4, 5, 6].map((n) => $('[data-badge="' + n + '"]'));
const leverEl = $('[data-part="lever"]'), knob = $('[data-part="knob"]'), flagEl = $('[data-part="flag"]'), win = $('[data-part="window"]'), flipper = $('[data-part="flipper"]');
const okCount = $('[data-count="SUCCESS"]'), failCount = $('[data-count="FAILURE"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const accel = (t) => t * t * 0.6 + t * 0.4;
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const along = (route, t) => {
  const lens = []; let total = 0;
  for (let i = 1; i < route.length; i++) { const l = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1], route[i][2] - route[i - 1][2]); lens.push(l); total += l; }
  let d = t * total;
  for (let i = 0; i < lens.length; i++) { if (d <= lens[i] || i === lens.length - 1) return lerp3(route[i], route[i + 1], Math.min(1, d / lens[i])); d -= lens[i]; }
};
const QUERIES = ["q-0101", "q-0102", "q-0103", "q-0104", "q-0105", "q-0106"];

// ---- state
const pos = Array.from({ length: N }, () => null); // world position of each marble, or null when hidden
const tint = Array(N).fill("");
let leverAngle = -0.7, flagUp = 0, tunnelOn = 0, flip = 0, okN = 0, failN = 0, activeStep = 0, text = "", run = 0, failing = 3;
const clicked = new Set(); // queries the visitor has broken this run
const isFail = (i) => i === failing || clicked.has(i);

const steps = [];
const step = (dur, fn, done) => steps.push({ dur, fn, done });
function plan() {
  failing = (run * 2 + 3) % N;
  clicked.clear();
  step(0.9, (t) => { activeStep = 1; leverAngle = -0.7 + 1.4 * ease(t); }, () => { text = "1 · start container"; });
  // 2: queries drop into the hopper
  for (let i = 0; i < N; i++) step(0.18, (t) => { activeStep = 2; pos[i] = [HOP_SLOTS[i][0], HOP_SLOTS[i][1], HOP_SLOTS[i][2] + (1 - t) * 30]; }, () => { text = "2 · fetch active queries by group · " + (i + 1) + " of " + N; });
  for (let i = 0; i < N; i++) {
    let from;
    step(0.35, (t) => { activeStep = 3; from ??= pos[i]; pos[i] = lerp3(from, ROUTE_A[0], ease(t)); }, () => { text = "3 · execute SQL · " + QUERIES[i]; });
    step(0.8, (t) => { pos[i] = along(ROUTE_A, accel(t)); });
    step(0.9, (t) => { pos[i] = null; tunnelOn = Math.sin(t * Math.PI); }, () => { tunnelOn = 0; });
    step(0.45, (t) => { pos[i] = along(ROUTE_B, t); flip = isFail(i) ? -1 : 1; });
    step(0.7, (t) => { const f = isFail(i); activeStep = f ? 5 : 4; pos[i] = along(f ? FAIL_BRANCH : OK_BRANCH, accel(t)); tint[i] = f ? "fail" : "ok"; });
    let end;
    step(0.3, (t) => { end ??= pos[i]; const f = isFail(i); const slot = f ? FAIL_SLOTS[failN] : OK_SLOTS[okN]; pos[i] = lerp3(end, slot, ease(t)); }, () => {
      const f = isFail(i);
      if (f) failN++; else okN++;
      text = f ? "5 · log error + failure status · " + QUERIES[i] : "4 · log success + timestamps · " + QUERIES[i];
    });
  }
  step(1.4, (t) => { activeStep = 6; leverAngle = 0.7 - 1.4 * ease(t); flagUp = ease(t); }, () => { text = "6 · exit job · " + okN + " succeeded, " + failN + " failed"; });
  step(2.0, () => {});
  step(0.6, (t) => { marbleEls.forEach((m) => (m.style.opacity = String(1 - t))); flagUp = 1 - t; }, () => {
    pos.fill(null); tint.fill(""); okN = 0; failN = 0; activeStep = 0; run++;
  });
}

function draw() {
  for (let i = 0; i < N; i++) {
    const el = marbleEls[i];
    if (!pos[i]) { el.style.opacity = "0"; continue; }
    const c = iso([pos[i][0], pos[i][1], pos[i][2] + MR * 0.2], P);
    el.style.opacity = "1";
    el.setAttribute("transform", "translate(" + c[0].toFixed(1) + " " + c[1].toFixed(1) + ")");
    el.setAttribute("class", tint[i]);
  }
  const L = 11;
  const tip = [LEVER_PIVOT[0] + Math.sin(leverAngle) * L * 0.6, LEVER_PIVOT[1] - Math.sin(leverAngle) * L * 0.6, LEVER_PIVOT[2] + Math.cos(leverAngle) * L];
  const a = iso(LEVER_PIVOT, P), b = iso(tip, P);
  leverEl.setAttribute("d", "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1));
  knob.setAttribute("cx", b[0].toFixed(1)); knob.setAttribute("cy", b[1].toFixed(1));
  flagEl.setAttribute("transform", translateAlong(P, [0, 0, flagUp * 24]));
  win.style.opacity = (0.25 + tunnelOn * 0.75).toFixed(2);
  const to = flip < 0 ? FAIL_BRANCH[1] : OK_BRANCH[1];
  const dx = to[0] - SWITCH[0], dy = to[1] - SWITCH[1], m = Math.hypot(dx, dy);
  const s0 = iso([SWITCH[0], SWITCH[1], SWITCH[2] - 0.6], P), s1 = iso([SWITCH[0] + (dx / m) * 6, SWITCH[1] + (dy / m) * 6, SWITCH[2] - 1.6], P);
  flipper.setAttribute("d", "M" + s0[0].toFixed(1) + " " + s0[1].toFixed(1) + "L" + s1[0].toFixed(1) + " " + s1[1].toFixed(1));
  badgeEls.forEach((bEl, i) => bEl.classList.toggle("on", activeStep === i + 1));
  if (okCount.textContent !== String(okN)) okCount.textContent = String(okN);
  if (failCount.textContent !== String(failN)) failCount.textContent = String(failN);
  if (readout.textContent !== text) readout.textContent = text;
}

let frame = 0, last = 0, visible = false, current = null, elapsed = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  if (!current) { if (!steps.length) plan(); current = steps.shift(); elapsed = 0; }
  elapsed += dt;
  const t = Math.min(1, elapsed / current.dur);
  current.fn(t);
  if (t >= 1) { current.done?.(); current = null; }
  draw();
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const go = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) go(); }, { rootMargin: "80px 0px" }).observe(stage);

// click: the next query that has not reached the switch yet will fail
stage.addEventListener("click", () => {
  const next = pos.findIndex((p, i) => p && !tint[i]);
  if (next >= 0) { clicked.add(next); text = QUERIES[next] + " will fail · the rest of the group still runs"; draw(); }
});
if (still.matches) { for (let i = 0; i < 4; i++) { pos[i] = OK_SLOTS[i]; tint[i] = "ok"; } pos[4] = FAIL_SLOTS[0]; tint[4] = "fail"; okN = 4; failN = 1; flagUp = 1; text = "6 · exit job · 4 succeeded, 1 failed"; }
else text = "waiting for the CronJob";
draw();
`;

const css = `
.extent{fill:none;stroke:none}
.rail{fill:none;stroke:var(--anatomy-hi);stroke-width:1.1px;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.marble{fill:#c9d2e3}
.ok .marble{fill:#46c97a}
.fail .marble{fill:#e5484d}
.shine{fill:#fff;opacity:.75;transform:translate(-1px,-1.2px)}
.knob{fill:var(--anatomy-hi)}
.mouth{fill:var(--anatomy-shade-0)}
.window{fill:#5b8cff;transition:opacity .15s}
.count{fill:var(--anatomy-hi);font-family:var(--anatomy-mono)}
.badge .iso-face-text{transition:fill .2s}
.badge.on .iso-face-text{fill:var(--anatomy-lit)}
.badge.on .iso-top{fill:#5b8cff}
.iso-stage{cursor:pointer}
`;

const body = k.plateHtml({
  fig: "Fig 3",
  title: "Execution flow",
  hint: "Click to make the next query fail",
  readout: "waiting for the CronJob",
  keys: [
    { mark: "raised", label: "Marbles: the group's active queries, one each" },
    { mark: "blue", label: "Tunnel: BigQuery runs the SQL, one query at a time" },
    { mark: "green", label: "Logged success (status + timestamps)" },
    { mark: "red", label: "Logged failure (error + status)" },
  ],
  caption:
    "The same six steps as the sequence diagram, as a machine. The job starts (1) and fetches its group's active queries (2). They run one after another, never in parallel (3), and every run is logged whether it succeeds (4) or fails (5). When the hopper is empty the job exits (6); a failure never stops the rest of the group.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Execution flow marble run. Click to make the next query fail.">${svg}</div>`,
});

writePage(k, { name: "bq-marbles.html", title: "Execution flow", body, live, css });
