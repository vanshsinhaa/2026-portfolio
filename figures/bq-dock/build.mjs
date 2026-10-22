// Fig 2 for the BigQuery Rerun Manager case study: the architecture as a dock.
// Run `node figures/bq-dock/build.mjs` to write public/figures/bq-dock.html.
//
//   crane + cron clock   = the Kubernetes CronJob that starts a Job on schedule
//   shipping container   = the Docker image running the Python app
//   pod pad              = where Kubernetes runs it; the pod is cleaned up after
//   three tanks          = BigQuery: query_metadata (read), the engine (execute
//                          SQL), query_run_log (write)
//   pipes                = the service-account connections; flow shows direction
import * as k from "../anatomy-kit/iso-kit.mjs";
import { writePage } from "../shared.mjs";

const WIDTH = 640;
const HEIGHT = 400;

const QUAY = { x: -158, y: -76, w: 300, d: 140, r: 10 };
const QUAY_H = 10;
const FOOT_H = 5;

const TOWER = [-134, 18];
const TOWER_W = 9;
const JIB_Z = 118;
const JIB = { x0: -158, x1: -8 };
const TROLLEY_HOME = -108;

const PAD = { x: -72, y: 2, w: 56, d: 32, r: 2 };
const PAD_H = 1.6;
const CONT = { x: -64, y: 9, w: 40, d: 18, r: 1 };
const CONT_H = 17;
const HANG_Z = 66; // container bottom while it hangs from the crane
const CONT_MID_X = CONT.x + CONT.w / 2;

const TANKS = [
  { id: "meta", name: "query_metadata", x: 26, y: -48, r: 16, h: 52, label: "read" },
  { id: "engine", name: "BigQuery", x: 76, y: -30, r: 21, h: 42, label: "execute" },
  { id: "log", name: "query_run_log", x: 112, y: 6, r: 16, h: 52, label: "write" },
];

const P = k.fitProjection(
  [...k.boxCorners(QUAY, -QUAY_H - FOOT_H, 0), [TOWER[0], TOWER[1], JIB_Z + 10], [JIB.x1, TOWER[1], JIB_Z + 8], [JIB.x0, TOWER[1], JIB_Z + 8]],
  WIDTH,
  HEIGHT,
  { pad: 18, azimuth: 40 },
);
const CAM = k.cameraOf(P);
const A = Math.atan2(CAM.sinA, CAM.cosA);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
const f1 = (n) => (Math.round(n * 10) / 10).toString();

// ---------------------------------------------------------------- quay
function quay() {
  const out = [`<path class="iso-halo" d="${k.haloOf(QUAY, -QUAY_H - FOOT_H, QUAY_H, P)}"/>`];
  for (const [x, y] of k.corners(QUAY, 24)) {
    out.push(S(k.cylinder(x, y, 7, -QUAY_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -QUAY_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(slab(QUAY, -QUAY_H, QUAY_H, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(QUAY, 5), 0, P), { tone: "lo" }));
  // painted lane lines and bollards along the front edge
  out.push(L([PAD.y - 6, PAD.y + PAD.d + 6].map((y) => k.lineOnTop([PAD.x - 8, y], [PAD.x + PAD.w + 30, y], 0, P)).join(""), { tone: "faint", dashed: true }));
  const bollards = [-140, -100, -60, -20, 20, 60, 100, 132].map((x) => [x, QUAY.y + QUAY.d - 8]);
  for (const [x, y] of bollards) {
    out.push(S(k.cylinder(x, y, 2.6, 0, 4, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 3.4, 4, 1.2, P, 16), { tone: "mid" }));
  }
  const screws = k.corners(QUAY, 10);
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// ---------------------------------------------------------------- crane (Kubernetes CronJob)
function crane() {
  const [tx, ty] = TOWER;
  const h = TOWER_W / 2;
  const base = { x: tx - 11, y: ty - 11, w: 22, d: 22, r: 2 };
  const out = [`<path class="iso-halo" d="${k.haloOf(base, 0, 4, P)}"/>`];
  out.push(S(slab(base, 0, 4, 4, 0.6), { tone: "lo" }));
  out.push(D(k.corners(base, 2.4).map(([x, y]) => at([x, y, 4])), { size: 0.45 }));
  // lattice mast: four chords and X bracing on the two faces we can see
  const corners = [[tx - h, ty - h], [tx + h, ty - h], [tx + h, ty + h], [tx - h, ty + h]];
  for (const [x, y] of corners) out.push(S(k.cylinder(x, y, 0.9, 4, JIB_Z - 4, P, 10), { tone: "mid", crease: "none" }));
  const brace = [];
  for (let z = 4; z < JIB_Z - 10; z += 12) {
    brace.push(k.segment([tx - h, ty + h, z], [tx + h, ty + h, z + 12], P), k.segment([tx + h, ty + h, z], [tx - h, ty + h, z + 12], P));
    brace.push(k.segment([tx + h, ty - h, z], [tx + h, ty + h, z + 12], P), k.segment([tx + h, ty + h, z], [tx + h, ty - h, z + 12], P));
    brace.push(k.segment([tx - h, ty + h, z], [tx + h, ty + h, z], P), k.segment([tx + h, ty - h, z], [tx + h, ty + h, z], P));
  }
  out.push(L(brace.join(""), { tone: "lo" }));
  // cab under the slewing ring
  const cab = { x: tx - 6, y: ty - 6, w: 12, d: 12, r: 1.2 };
  out.push(S(slab(cab, JIB_Z - 14, 10, 3, 0.5), { tone: "mid" }));
  // helm-wheel emblem on the cab's front face (Kubernetes)
  const wc = [tx, ty + 6.1, JIB_Z - 8];
  const wheel = [];
  const rr = 2.6;
  const ringPts = Array.from({ length: 41 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return at([wc[0] + Math.cos(a) * rr, wc[1], wc[2] + Math.sin(a) * rr]); });
  wheel.push(k.pathOf(ringPts));
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2 - Math.PI / 2; wheel.push(k.segment([wc[0], wc[1], wc[2]], [wc[0] + Math.cos(a) * (rr + 0.9), wc[1], wc[2] + Math.sin(a) * (rr + 0.9)], P)); }
  out.push(`<path class="helm" d="${k.pathOf(Array.from({ length: 41 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return at([wc[0] + Math.cos(a) * (rr + 3.2), wc[1], wc[2] + Math.sin(a) * (rr + 1.4)]); }), true)}"/>`);
  out.push(L(wheel.join(""), { tone: "hi" }));
  out.push(S(k.cylinder(tx, ty, 7, JIB_Z - 4, 2, P, 32, 0.4), { tone: "mid" }));
  return out.join("");
}
function cronBox() {
  // control box with the schedule dial
  const box = { x: TOWER[0] - 8, y: TOWER[1] + 16, w: 16, d: 14, r: 1.6 };
  const out = [S(slab(box, 0, 12, 3, 0.6), { tone: "mid" })];
  const c = [box.x + box.w / 2, box.y + box.d / 2];
  out.push(L(k.ring(c[0], c[1], 5.4, 12, P, 40), { tone: "lo" }));
  const t = k.radialTicks(c[0], c[1], 4.6, 12, 3, 12, [0.8, 1.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(k.faceTextSvg(k.sideMatrix([c[0], box.y + box.d], 6, P, "left"), "CRON", { size: 2.4, tone: "lo", anchor: "middle" }));
  out.push(`<path data-part="needle" class="iso-line" data-tone="lit" d="" style="stroke-width:1"/>`);
  return { svg: out.join(""), center: c };
}
const CRON = cronBox();
const needleAt = (turn) => {
  const a = turn * Math.PI * 2;
  const [x, y] = CRON.center;
  return lineOnTop([x, y], [x + Math.sin(a) * 4.2, y - Math.cos(a) * 4.2], 12.2, P);
};

function jib() {
  const [tx, ty] = TOWER;
  const out = [];
  out.push(S(slab({ x: JIB.x0, y: ty - 3, w: JIB.x1 - JIB.x0, d: 6, r: 1 }, JIB_Z, 4, 3, 0.4), { tone: "mid" }));
  // truss lines on the jib's front face
  const truss = [];
  for (let x = tx + 6; x < JIB.x1 - 4; x += 8) truss.push(k.segment([x, ty + 3, JIB_Z], [x + 4, ty + 3, JIB_Z + 4], P), k.segment([x + 4, ty + 3, JIB_Z + 4], [x + 8, ty + 3, JIB_Z], P));
  out.push(L(truss.join(""), { tone: "faint" }));
  // counterweight and the tip
  out.push(S(slab({ x: JIB.x0 + 2, y: ty - 5, w: 14, d: 10, r: 1 }, JIB_Z - 9, 9, 3, 0.5), { tone: "lo" }));
  out.push(S(slab({ x: JIB.x1 - 4, y: ty - 4, w: 4, d: 8, r: 1 }, JIB_Z + 4, 2, 2), { tone: "mid" }));
  // apex with tie cables
  out.push(S(slab({ x: tx - 2, y: ty - 2, w: 4, d: 4, r: 0.6 }, JIB_Z + 4, 14, 2), { tone: "mid" }));
  out.push(L(k.segment([tx, ty, JIB_Z + 18], [JIB.x1 - 2, ty, JIB_Z + 4], P) + k.segment([tx, ty, JIB_Z + 18], [JIB.x0 + 8, ty, JIB_Z + 4], P), { tone: "lo" }));
  return out.join("");
}
function trolley() {
  // built at x = 0; the live script slides it along the jib
  const ty = TOWER[1];
  return S(slab({ x: -5, y: ty - 5, w: 10, d: 10, r: 1.2 }, JIB_Z - 4, 4, 3, 0.4), { tone: "hi", crease: "lo" });
}

// ---------------------------------------------------------------- pad + container
function pad() {
  const out = [S(slab(PAD, 0, PAD_H, 3, 0.3), { tone: "lo" })];
  out.push(L(k.planOutline(k.insetPlan(PAD, 2.5), PAD_H, P, 3), { tone: "faint", dashed: true }));
  out.push(k.faceTextSvg(k.topMatrix([PAD.x + 4, PAD.y + PAD.d - 3], PAD_H, P, "x"), "POD", { size: 3, tone: "lo" }));
  return out.join("");
}
function container() {
  // built resting on the pad; the live script lifts it
  const z0 = PAD_H;
  const out = [`<path class="iso-halo" data-part="cont-halo" d="${k.haloOf(CONT, z0, CONT_H, P)}" style="filter:blur(5px)"/>`];
  out.push(S(slab(CONT, z0, CONT_H, 3, 0.4), { tone: "mid" }));
  // corrugation on the long (+y) side, doors and lock bars on the +x end
  const fy = CONT.y + CONT.d;
  const ribs = [];
  for (let x = CONT.x + 3; x < CONT.x + CONT.w - 2; x += 2.6) ribs.push(k.segment([x, fy, z0 + 1.5], [x, fy, z0 + CONT_H - 1.5], P));
  out.push(L(ribs.join(""), { tone: "faint" }));
  const ex = CONT.x + CONT.w;
  const doors = [k.segment([ex, CONT.y + CONT.d / 2, z0 + 1], [ex, CONT.y + CONT.d / 2, z0 + CONT_H - 1], P)];
  for (const y of [CONT.y + 3, CONT.y + 6.5, CONT.y + 11.5, CONT.y + 15]) doors.push(k.segment([ex, y, z0 + 1.5], [ex, y, z0 + CONT_H - 1.5], P));
  out.push(L(doors.join(""), { tone: "lo" }));
  out.push(D([CONT.y + 3, CONT.y + 6.5, CONT.y + 11.5, CONT.y + 15].map((y) => at([ex, y, z0 + CONT_H / 2])), { size: 0.5, tone: "mid" }));
  // corner castings
  for (const [x, y] of [[CONT.x, CONT.y + CONT.d - 2], [CONT.x + CONT.w - 2, CONT.y + CONT.d - 2], [CONT.x + CONT.w - 2, CONT.y]]) {
    out.push(S(slab({ x, y, w: 2, d: 2, r: 0.3 }, z0 + CONT_H - 1.6, 1.8, 1), { tone: "lo", crease: "none" }));
  }
  // stencil
  out.push(k.faceTextSvg(k.sideMatrix([CONT.x + CONT.w / 2 - 1, fy], z0 + CONT_H * 0.62, P, "left"), "PYTHON APP", { size: 3.2, tone: "hi", anchor: "middle" }));
  out.push(k.faceTextSvg(k.sideMatrix([CONT.x + CONT.w / 2 - 1, fy], z0 + CONT_H * 0.33, P, "left"), "docker image · runs once", { size: 2, tone: "lo", anchor: "middle" }));
  // lifting eye on the roof
  out.push(S(slab({ x: CONT_MID_X - 2, y: CONT.y + CONT.d / 2 - 2, w: 4, d: 4, r: 1 }, z0 + CONT_H, 1.6, 2), { tone: "mid" }));
  return out.join("");
}

// ---------------------------------------------------------------- tanks (BigQuery tables)
function tank(t) {
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: t.x - t.r - 3, y: t.y - t.r - 3, w: t.r * 2 + 6, d: t.r * 2 + 6, r: t.r + 3 }, 0, 3, P)}"/>`];
  out.push(S(k.cylinder(t.x, t.y, t.r + 3, 0, 3, P, 48, 0.4), { tone: "lo" }));
  out.push(S(k.cylinder(t.x, t.y, t.r, 3, t.h - 3, P, 56, 0.8), { tone: t.id === "engine" ? "hi" : "mid", crease: "lo" }));
  const bands = t.id === "engine" ? [9, 13, 17, 21, 25, 29] : [10, t.h - 8];
  out.push(L(bands.map((z) => k.sideArc(t.x, t.y, t.r, z, P, 40)).join(""), { tone: t.id === "engine" ? "lo" : "faint" }));
  out.push(S(k.cylinder(t.x, t.y, t.r - 2.5, t.h, 2.6, P, 48, 0.6), { tone: "mid" }));
  out.push(S(k.cylinder(t.x + t.r * 0.35, t.y - t.r * 0.2, 2, t.h + 2.6, 5, P, 16), { tone: "mid" }));
  out.push(S(k.cylinder(t.x + t.r * 0.35, t.y - t.r * 0.2, 3, t.h + 7.6, 1.2, P, 16), { tone: "mid" }));
  if (t.id === "engine") {
    // the engine's fan turns while SQL runs
    out.push(L(k.ring(t.x, t.y, t.r - 5, t.h + 2.6, P, 40), { tone: "lo" }));
    out.push(`<path data-part="fan" class="iso-line" data-tone="hi" d="" style="stroke-width:1.1"/>`);
  } else {
    // sight glass on the front with a level that rises as rows land
    const a0 = A - 0.13, a1 = A + 0.13, z0 = 8, z1 = t.h - 6;
    const glass = [[a0, z0], [a1, z0], [a1, z1], [a0, z1]].map(([a, z]) => at([t.x + Math.cos(a) * t.r, t.y + Math.sin(a) * t.r, z]));
    out.push(`<path class="glass" d="${k.pathOf(glass, true)}"/>`);
    out.push(`<path data-level="${t.id}" class="level" d=""/>`);
    out.push(L(k.pathOf(glass, true), { tone: "lo" }));
  }
  // name plate on the quay in front of the tank
  const plate = { x: t.x - 15, y: t.y + t.r + 5, w: 30, d: 7, r: 1 };
  out.push(S(slab(plate, 0, 0.8, 3, 0.3), { tone: "mid", crease: "none" }));
  out.push(k.faceTextSvg(k.topMatrix([t.x, plate.y + 4.6], 0.8, P, "x"), t.name, { size: 2.9, tone: "hi", anchor: "middle" }));
  return `<g class="tank" data-tank="${t.id}">${out.join("")}</g>`;
}
// sight-glass level as a path for a fill fraction (used live)
const levelAt = (t, f) => {
  const a0 = A - 0.11, a1 = A + 0.11, z0 = 8.6, z1 = 8.6 + (t.h - 15.2) * f;
  return pathOf([[a0, z0], [a1, z0], [a1, z1], [a0, z1]].map(([a, z]) => iso([t.x + Math.cos(a) * t.r, t.y + Math.sin(a) * t.r, z], P)), true);
};

// ---------------------------------------------------------------- pipes
const PORTS = { meta: [CONT.x + CONT.w, CONT.y + 4, PAD_H + 4], engine: [CONT.x + CONT.w, CONT.y + CONT.d / 2, PAD_H + 4], log: [CONT.x + CONT.w, CONT.y + CONT.d - 4, PAD_H + 4] };
function pipeRoute(t) {
  const from = PORTS[t.id];
  const dx = from[0] - t.x, dy = from[1] - t.y, m = Math.hypot(dx, dy);
  const end = [t.x + (dx / m) * t.r, t.y + (dy / m) * t.r, 6];
  const mid = [from[0] + 10, from[1], from[2]];
  return [from, mid, [mid[0] + 6, (mid[1] + end[1]) / 2, 5], end];
}
function pipes() {
  return TANKS.map((t) => {
    const pts = pipeRoute(t).map(at);
    const d = k.pathOf(pts);
    const rev = k.pathOf([...pts].reverse());
    return `<g class="pipe" data-pipe="${t.id}" style="opacity:0"><path class="tube" d="${d}"/><path class="iso-line" data-tone="mid" d="${d}"/><path data-flow="${t.id}" class="flow" d="${t.id === "meta" ? rev : d}"/><path data-back="${t.id}" class="flow back" d="${rev}"/>${D([pts[0], pts[pts.length - 1]], { size: 1, tone: "mid" })}</g>`;
  }).join("");
}

// ---------------------------------------------------------------- assemble
const tanksByDepth = [...TANKS].sort((a, b) => k.depthOf([a.x, a.y, 0], P) - k.depthOf([b.x, b.y, 0], P));
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "The architecture as a dock. A crane marked with a helm wheel, run by a cron clock, lowers a shipping container labelled Python app onto a pod pad. Pipes couple it to three tanks: query_metadata, which it reads from; BigQuery, which runs its SQL; and query_run_log, which it writes to. When the run ends the pipes uncouple and the crane lifts the container away.",
  body: [
    quay(),
    crane(),
    CRON.svg,
    pad(),
    pipes(),
    `<g data-part="container" transform="${k.translateAlong(P, [TROLLEY_HOME - CONT_MID_X, 0, HANG_Z])}">${container()}</g>`,
    `<path data-part="cable" class="iso-line" data-tone="hi" d=""/>`,
    ...tanksByDepth.map(tank),
    jib(),
    `<g data-part="trolley" transform="${k.translateAlong(P, [TROLLEY_HOME, 0, 0])}">${trolley()}</g>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const TANKS = ${JSON.stringify(TANKS)};
const A = ${A};
const TROLLEY_HOME = ${TROLLEY_HOME}, HANG_Z = ${HANG_Z}, JIB_Z = ${JIB_Z}, TY = ${TOWER[1]};
const CONT_MID_X = ${CONT_MID_X}, CONT_TOP = ${PAD_H + CONT_H + 1.6}, CONT_CY = ${CONT.y + CONT.d / 2};
const CRON = { center: ${JSON.stringify(CRON.center)} };
const needleAt = ${needleAt.toString()};
const levelAt = ${levelAt.toString()};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (q) => svg.querySelector(q);
const cont = $('[data-part="container"]'), trolleyEl = $('[data-part="trolley"]'), cable = $('[data-part="cable"]'), needle = $('[data-part="needle"]'), fan = $('[data-part="fan"]');
const pipesEl = Object.fromEntries(TANKS.map((t) => [t.id, $('[data-pipe="' + t.id + '"]')]));
const flow = Object.fromEntries(TANKS.map((t) => [t.id, $('[data-flow="' + t.id + '"]')]));
const back = $('[data-back="engine"]');
const levels = { meta: $('[data-level="meta"]'), log: $('[data-level="log"]') };
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");

const QUERIES = ["q-0101", "q-0102", "q-0103", "q-0104", "q-0105", "q-0106"];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
let trolleyX = TROLLEY_HOME, contZ = HANG_Z, contShown = 1, coupled = 0, active = { meta: 0, engine: 0, log: 0, back: 0 };
let turn = 0.3, spin = 0, logLevel = 0.18, text = "", runs = 0, failAt = 3;

// ---- the run, as timed steps
const steps = [];
const step = (dur, fn, done) => steps.push({ dur, fn, done });
function plan() {
  failAt = (runs * 2 + 3) % QUERIES.length;
  step(1.2, (t) => { turn = lerp(turn % 1, 1, ease(t)); }, () => { turn = 0; text = "cron fires · Kubernetes starts a Job"; });
  step(1.6, (t) => { trolleyX = lerp(TROLLEY_HOME, CONT_MID_X, ease(t)); contShown = Math.min(1, t * 3); });
  step(1.3, (t) => { contZ = lerp(HANG_Z, 0, ease(t)); }, () => { text = "container lands on its pod · connecting to BigQuery"; });
  step(0.5, (t) => { coupled = t; });
  step(1.4, () => { active.meta = 1; }, () => { active.meta = 0; text = "read query_metadata · " + QUERIES.length + " active queries in group A"; });
  QUERIES.forEach((q, i) => {
    const fails = i === failAt;
    step(0.5, () => { active.engine = 1; active.back = 1; text = "execute SQL · " + q; });
    step(0.45, () => { active.engine = 0; active.back = 0; active.log = 1; logLevel = Math.min(1, logLevel + 0.02); }, () => { active.log = 0; text = q + (fails ? " · error logged with failure status" : " · success logged with timestamps"); });
  });
  step(0.5, (t) => { coupled = 1 - t; }, () => { text = "job done · " + QUERIES.length + " runs in query_run_log"; });
  step(1.2, (t) => { contZ = lerp(0, HANG_Z, ease(t)); });
  step(1.4, (t) => { trolleyX = lerp(CONT_MID_X, TROLLEY_HOME, ease(t)); contShown = 1 - t; }, () => { text = "pod cleaned up · nothing left running"; runs++; if (logLevel > 0.9) logLevel = 0.18; });
  step(1.6, () => {});
}

function draw(now) {
  cont.setAttribute("transform", translateAlong(P, [trolleyX - CONT_MID_X, 0, contZ]));
  cont.style.opacity = contShown.toFixed(2);
  trolleyEl.setAttribute("transform", translateAlong(P, [trolleyX, 0, 0]));
  // the cable runs from the trolley down to the lifting eye
  const a = iso([trolleyX, TY, JIB_Z - 4], P), b = iso([trolleyX, CONT_CY, CONT_TOP + contZ], P);
  cable.setAttribute("d", contShown > 0.02 ? "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1) : "");
  cable.style.opacity = contShown.toFixed(2);
  needle.setAttribute("d", needleAt(turn));
  for (const t of TANKS) {
    pipesEl[t.id].style.opacity = coupled.toFixed(2);
    flow[t.id].classList.toggle("on", !!active[t.id]);
  }
  back.classList.toggle("on", !!active.back);
  levels.log.setAttribute("d", levelAt(TANKS[2], logLevel));
  levels.meta.setAttribute("d", levelAt(TANKS[0], 0.72));
  if (active.engine) spin += 0.25;
  const e = TANKS[1], fz = e.h + 2.7;
  let fd = "";
  for (let i = 0; i < 3; i++) { const ang = spin + (i * Math.PI * 2) / 3; const p0 = iso([e.x, e.y, fz], P), p1 = iso([e.x + Math.cos(ang) * (e.r - 6), e.y + Math.sin(ang) * (e.r - 6), fz], P); fd += "M" + p0[0].toFixed(1) + " " + p0[1].toFixed(1) + "L" + p1[0].toFixed(1) + " " + p1[1].toFixed(1); }
  fan.setAttribute("d", fd);
  const shown = hoverText || text;
  if (readout.textContent !== shown) readout.textContent = shown;
}

let frame = 0, last = 0, visible = false, current = null, elapsed = 0, hoverText = "";
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  if (!current) { if (!steps.length) plan(); current = steps.shift(); elapsed = 0; }
  elapsed += dt;
  const t = Math.min(1, elapsed / current.dur);
  current.fn(t);
  if (t >= 1) { current.done?.(); current = null; }
  turn += dt * 0.03;
  draw(now);
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "80px 0px" }).observe(stage);

// hover a tank to read what it is
const ROLE = { meta: "query_metadata · the queries to run, grouped, with is_active flags", engine: "BigQuery · executes each query's SQL", log: "query_run_log · one row per run: status, error, started_at, finished_at" };
svg.querySelectorAll("[data-tank]").forEach((g) => {
  g.addEventListener("pointerenter", () => { hoverText = ROLE[g.dataset.tank]; g.classList.add("hot"); draw(); });
  g.addEventListener("pointerleave", () => { hoverText = ""; g.classList.remove("hot"); draw(); });
});
if (still.matches) { trolleyX = CONT_MID_X; contZ = 0; coupled = 1; active.meta = 0; text = "container on its pod, coupled to BigQuery"; }
else text = "cron · waiting for the schedule";
draw();
`;

const css = `
.tube{fill:none;stroke:var(--anatomy-shade-2);stroke-width:3.4px;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.flow{fill:none;stroke:#5b8cff;stroke-width:1.6px;stroke-dasharray:2.5 5;vector-effect:non-scaling-stroke;opacity:0;transition:opacity .2s}
.flow.on{opacity:1;animation:dock-flow .6s linear infinite}
.flow.back.on{stroke:#7ee2a8}
@keyframes dock-flow{to{stroke-dashoffset:-15}}
.pipe{transition:opacity .2s}
.glass{fill:var(--anatomy-shade-0)}
.level{fill:#5b8cff;opacity:.85}
.helm{fill:#326ce5;opacity:.9}
.tank{cursor:help}
.tank.hot .iso-edge{stroke:var(--anatomy-lit)}
`;

const body = k.plateHtml({
  fig: "Fig 2",
  title: "Architecture",
  hint: "Hover a tank to see what it holds",
  readout: "cron · waiting for the schedule",
  keys: [
    { mark: "lit", label: "Crane: the Kubernetes CronJob / Job" },
    { mark: "raised", label: "Container: the Dockerized Python app, on its pod" },
    { mark: "blue", label: "Flow: reads, SQL execution, log writes" },
  ],
  caption:
    "On schedule, the CronJob starts a Job and Kubernetes runs the Docker image on a pod. The Python app reads the group's active queries from query_metadata, executes each one in BigQuery, and writes the result of every run to query_run_log. Then it exits and the pod is cleaned up: nothing stays running between runs.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Architecture figure: a crane-run container coupled to three BigQuery tanks.">${svg}</div>`,
});

writePage(k, { name: "bq-dock.html", title: "Architecture", body, live, css });
