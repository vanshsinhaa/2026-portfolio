// Fig 1 for the SaveMyGrade case study, drawn with the Anatomy kit
// (figures/anatomy-kit, MIT). Run `node figures/study-catalog/build.mjs` to
// write public/figures/study-catalog.html.
//
// The machine is the system:
//   conveyor + captures = everything you braindump: PDFs, lecture recordings,
//                         whiteboard photos, YouTube lectures, slides
//   intake + tube       = multimodal embedding of each capture into chunks
//   card catalog        = the vector store, one drawer per topic. A capture's
//                         chunks are filed into the drawer of the topic they
//                         are nearest to.
//   drawer LEDs/gauges  = the gap view: red drawers are topics you have barely
//                         covered, green ones are well stocked
//   card printer        = one-click flashcards drawn from the drawer just filed
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../anatomy-kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const kitScript = () => readFileSync(join(HERE, "..", "anatomy-kit", "iso-kit.mjs"), "utf8").replace(/^export /gm, "");

const WIDTH = 640;
const HEIGHT = 430;

// ---- world
const PLATE = { x: -172, y: -60, w: 284, d: 132, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

const BELT = { x: -164, y: -11, w: 104, d: 24, r: 2 };
const BELT_Z = 12;
const BELT_TOP = 16;
const ITEM = { w: 16, d: 18, h: 1.2 };
const ITEM_Y = BELT.y + (BELT.d - ITEM.d) / 2;
const ITEM_FROM = -162;
const ITEM_TO = -60;

const INLET = { x: -62, y: -15, w: 18, d: 32, r: 2 };
const INLET_H = 30;

// the catalog cabinet: 4 x 4 drawers on its +y face
const CAB = { x: -32, y: -28, w: 66, d: 44, r: 2 };
const CAB_Z = 3; // sits on a plinth
const CAB_H = 62;
const CAB_TOP = CAB_Z + CAB_H;
const FRONT = CAB.y + CAB.d;
const COLS = 4, ROWS = 4;
const DW = 12.6, DH = 11.4, GAP = 2.2;
const DX0 = CAB.x + (CAB.w - (COLS * DW + (COLS - 1) * GAP)) / 2;
const DZ0 = CAB_Z + 5;
const PROUD = 1.4; // a closed drawer front stands this far out of the face
const OPEN = 15; // how far a drawer slides out
const TOPICS = ["TREES", "GRAPHS", "DP", "RECUR", "OS", "NETS", "SQL", "HASH", "SORT", "HEAPS", "BIG-O", "MUTEX", "CACHE", "TCP", "REGEX", "PROB"];
const drawerAt = (i) => { const col = i % COLS, row = ROWS - 1 - Math.floor(i / COLS); return { x: DX0 + col * (DW + GAP), z: DZ0 + row * (DH + GAP) }; };

const PRINTER = { x: 50, y: 12, w: 38, d: 30, r: 3 };
const PRINTER_H = 22;
const SLOT_Y = PRINTER.y + 15;
const CARD = { x0: 56, x1: 82, h: 15 };
const STACK = { x: 55, y: 50, w: 26, d: 15 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [CAB.x, CAB.y, CAB_TOP + 10], [CAB.x + CAB.w, FRONT + OPEN, CAB_TOP], [CARD.x1, SLOT_Y, PRINTER_H + CARD.h + 6]],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 40 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
const f1 = (n) => (Math.round(n * 10) / 10).toString();

// ---------------------------------------------------------------- bench
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 24)) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(slab(PLATE, -PLATE_H, PLATE_H, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const label = { x: -150, y: PLATE.y + PLATE.d - 18, w: 46, d: 11, r: 1.2 };
  out.push(S(slab(label, 0, 0.8, 3, 0.3), { tone: "mid", crease: "none" }));
  out.push(D(k.corners(label, 2).map(([x, y]) => at([x, y, 0.8])), { size: 0.4 }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 5, label.y + 4.6], 0.8, P, "x"), "STUDY-01", { size: 3, tone: "mid" }));
  out.push(L([0, 1].map((i) => k.lineOnTop([label.x + 5, label.y + 6.8 + i * 1.6], [label.x + 5 + (i ? 22 : 34), label.y + 6.8 + i * 1.6], 0.8, P)).join(""), { tone: "faint", free: true }));
  return out.join("");
}

// ---------------------------------------------------------------- conveyor + captures
function belt() {
  const out = [];
  for (const x of [BELT.x + 8, BELT.x + BELT.w - 14]) {
    out.push(S(slab({ x, y: BELT.y + 2, w: 6, d: BELT.d - 4, r: 1 }, 0, 1.6, 3, 0.3), { tone: "lo" }));
    out.push(S(slab({ x: x + 1.5, y: BELT.y + 5, w: 3, d: BELT.d - 10, r: 0.8 }, 1.6, BELT_Z - 1.6, 2), { tone: "mid" }));
  }
  out.push(S(slab(BELT, BELT_Z, BELT_TOP - BELT_Z, 3, 0.5), { tone: "mid" }));
  for (const x of [BELT.x + 4, BELT.x + BELT.w - 4]) out.push(L(k.pathOf(Array.from({ length: 17 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return at([x + Math.cos(a) * 2.6, BELT.y + BELT.d, BELT_Z + 2 + Math.sin(a) * 1.6]); }), true), { tone: "lo" }));
  out.push(D([at([BELT.x + 4, BELT.y + BELT.d, BELT_Z + 2]), at([BELT.x + BELT.w - 4, BELT.y + BELT.d, BELT_Z + 2])], { size: 0.5, tone: "mid" }));
  out.push(`<path data-part="dashes" class="iso-line" data-tone="lo" d=""/>`);
  return out.join("");
}
const ICONS = {
  pdf: `<rect class="ic-paper" x="1" y="1" width="14" height="16" rx=".6"/><path class="ic-fold" d="M11 1 15 5H11Z"/>${[4, 6.2, 8.4, 10.6].map((y, i) => `<path class="ic-ink" d="M3 ${y}H${i % 2 ? 10 : 12}"/>`).join("")}<rect class="ic-red" x="2.4" y="12.4" width="7" height="3.4" rx=".5"/><text class="ic-tag" x="5.9" y="15" font-size="2.3" text-anchor="middle">PDF</text>`,
  video: `<rect class="ic-dark" x="1" y="1" width="14" height="16" rx="1"/><path class="ic-white" d="M6 6.2 11.2 9 6 11.8Z"/><path class="ic-ink-lo" d="M3 14.6H13"/><path class="ic-red-line" d="M3 14.6H7.4"/>`,
  whiteboard: `<rect class="ic-paper" x="1" y="1" width="14" height="16" rx=".4"/><rect class="ic-board" x="2.2" y="2.2" width="11.6" height="10.4"/><path class="ic-blue" d="M3.6 5.2c1.4-1.6 2.6 1.4 4-.2s2.2.8 3.4-.6"/><path class="ic-red-line" d="M3.8 8.6h3.6m-1.8-1.8v3.6"/><rect class="ic-blue-box" x="8.6" y="7.2" width="3.6" height="3.2"/>`,
  youtube: `<rect class="ic-paper" x="1" y="1" width="14" height="16" rx="1"/><rect class="ic-red" x="2.6" y="4.4" width="10.8" height="7.6" rx="2"/><path class="ic-white" d="M7 6.2 10.2 8.2 7 10.2Z"/><path class="ic-ink" d="M3 14.4H11"/>`,
  slides: `<rect class="ic-paper" x="1" y="1" width="14" height="16" rx=".6"/><path class="ic-ink" d="M3 3.6H11"/><rect class="ic-blue-fill" x="3.4" y="10" width="2" height="4.6"/><rect class="ic-blue-fill" x="6.6" y="7.4" width="2" height="7.2"/><rect class="ic-blue-fill" x="9.8" y="8.8" width="2" height="5.8"/>`,
};
const TYPES = Object.keys(ICONS);
const SLOTS = 3;
function itemSlot(slot) {
  const plan = { x: ITEM_FROM, y: ITEM_Y, w: ITEM.w, d: ITEM.d, r: 0.8 };
  const body = S(slab(plan, BELT_TOP, ITEM.h, 2, 0.2), { tone: "hi", crease: "none" });
  const faces = TYPES.map((t) => `<g data-type="${t}" style="display:none" transform="${k.topMatrix([ITEM_FROM, ITEM_Y], BELT_TOP + ITEM.h, P, "x")}">${ICONS[t]}</g>`).join("");
  return `<g data-item="${slot}" style="opacity:0">${body}${faces}</g>`;
}
function inlet() {
  const out = [];
  out.push(S(slab(INLET, 0, INLET_H, 3, 0.8), { tone: "mid" }));
  out.push(S(slab(k.insetPlan(INLET, 3), INLET_H, 3, 3, 0.4), { tone: "mid" }));
  out.push(L([8, 11, 14, 17].map((z) => k.segment([INLET.x + 3, INLET.y + INLET.d, z], [INLET.x + INLET.w - 3, INLET.y + INLET.d, z], P)).join(""), { tone: "faint" }));
  out.push(k.faceTextSvg(k.sideMatrix([INLET.x + INLET.w / 2, INLET.y + INLET.d], 24, P, "left"), "EMBED", { size: 2.4, tone: "lo", anchor: "middle" }));
  out.push(`<g data-part="inlet-led">${D([at([INLET.x + INLET.w - 3, INLET.y + INLET.d, 4])], { size: 0.8, tone: "hi" })}</g>`);
  out.push(D(k.corners(k.insetPlan(INLET, 3), 1.6).map(([x, y]) => at([x, y, INLET_H + 3])), { size: 0.4 }));
  return out.join("");
}
// tube: intake top -> up -> across into the hopper on the cabinet roof
const HOPPER = [CAB.x + 14, CAB.y + 14];
const TUBE = [
  [INLET.x + INLET.w / 2, 0, INLET_H + 3],
  [INLET.x + INLET.w / 2, 0, CAB_TOP + 12],
  [HOPPER[0], HOPPER[1], CAB_TOP + 12],
  [HOPPER[0], HOPPER[1], CAB_TOP + 5],
];
function tube() {
  const pts = TUBE.map(at);
  const d = k.pathOf(pts);
  return `<path class="tube" d="${d}"/><path class="iso-line" data-tone="mid" d="${d}"/>${D([pts[0]], { size: 0.9, tone: "mid" })}<circle data-part="pulse" class="pulse" r="2.2" cx="${f1(pts[0][0])}" cy="${f1(pts[0][1])}" style="opacity:0"/>`;
}

// ---------------------------------------------------------------- the catalog cabinet
function cabinet() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CAB, 0, CAB_H, P)}"/>`];
  out.push(S(slab(k.insetPlan(CAB, 2.5), 0, CAB_Z, 4, 0.4), { tone: "lo" }));
  out.push(S(slab(CAB, CAB_Z, CAB_H, 4, 1.2), { tone: "mid" }));
  // crown moulding and the hopper on the roof
  out.push(S(slab({ x: CAB.x - 1.5, y: CAB.y - 1.5, w: CAB.w + 3, d: CAB.d + 3, r: 2.6 }, CAB_TOP, 2.4, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(CAB, 4), CAB_TOP + 2.4, P, 4), { tone: "faint" }));
  out.push(S(k.cylinder(HOPPER[0], HOPPER[1], 6, CAB_TOP + 2.4, 2.6, P, 32, 0.4), { tone: "mid" }));
  out.push(L(k.ring(HOPPER[0], HOPPER[1], 3.6, CAB_TOP + 5, P, 28), { tone: "lo" }));
  // side (+x) panel: frame and screws
  const sx = CAB.x + CAB.w;
  const panel = [[CAB.y + 4, CAB_Z + 4], [FRONT - 4, CAB_Z + 4], [FRONT - 4, CAB_TOP - 4], [CAB.y + 4, CAB_TOP - 4]];
  out.push(L(k.pathOf(panel.map(([y, z]) => at([sx, y, z])), true), { tone: "faint" }));
  out.push(D(panel.map(([y, z]) => at([sx, y, z])), { size: 0.45 }));
  // brass plate across the top of the front face
  const lz = CAB_TOP - 3.2;
  out.push(k.faceTextSvg(k.sideMatrix([CAB.x + CAB.w / 2, FRONT], lz, P, "left"), "CORPUS  ·  ONE DRAWER PER TOPIC", { size: 2.2, tone: "lo", anchor: "middle" }));
  out.push(L(k.segment([CAB.x + 4, FRONT, CAB_TOP - 5.6], [CAB.x + CAB.w - 4, FRONT, CAB_TOP - 5.6], P), { tone: "faint" }));
  // dark wells behind every drawer front (seen when a drawer is pulled)
  for (let i = 0; i < TOPICS.length; i++) {
    const { x, z } = drawerAt(i);
    const hole = [[x + 0.6, z + 0.6], [x + DW - 0.6, z + 0.6], [x + DW - 0.6, z + DH - 0.6], [x + 0.6, z + DH - 0.6]];
    out.push(`<path class="well" d="${k.pathOf(hole.map(([hx, hz]) => at([hx, FRONT, hz])), true)}"/>`);
  }
  return out.join("");
}
// a drawer front: label, pull, LED and a fill gauge. Built in the face plane.
function drawerFront(i) {
  const { x, z } = drawerAt(i);
  const out = [];
  out.push(S(slab({ x, y: FRONT, w: DW, d: PROUD, r: 0.8 }, z, DH, 3, 0.4), { tone: "mid" }));
  const fy = FRONT + PROUD;
  // label holder with the topic engraved
  const holder = [[x + 2.2, z + DH - 2], [x + DW - 2.2, z + DH - 2], [x + DW - 2.2, z + DH - 5.2], [x + 2.2, z + DH - 5.2]];
  out.push(L(k.pathOf(holder.map(([hx, hz]) => at([hx, fy, hz])), true), { tone: "lo" }));
  out.push(k.faceTextSvg(k.sideMatrix([x + DW / 2, fy], z + DH - 2.75, P, "left"), TOPICS[i], { size: 1.9, tone: "mid", anchor: "middle" }));
  // pull
  out.push(S(slab({ x: x + DW / 2 - 2.4, y: fy, w: 4.8, d: 1, r: 0.5 }, z + 3.6, 1.4, 2), { tone: "hi", crease: "none" }));
  // fill gauge track + live bar, and the gap LED
  const g0 = [x + 1.8, fy, z + 1.4], g1 = [x + DW - 1.8, fy, z + 1.4];
  out.push(L(k.segment(g0, g1, P), { tone: "faint" }));
  out.push(`<path data-gauge="${i}" class="gauge" d=""/>`);
  const led = at([x + DW - 1.6, fy, z + DH - 1.2]);
  out.push(`<circle data-led="${i}" class="led" r=".85" cx="${f1(led[0])}" cy="${f1(led[1])}"/>`);
  return `<g data-drawer="${i}">${out.join("")}</g>`;
}

// ---------------------------------------------------------------- flashcard printer
function printer() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PRINTER, 0, PRINTER_H, P)}" style="filter:blur(5px)"/>`];
  out.push(S(slab(PRINTER, 0, PRINTER_H, 4, 1), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PRINTER, 3), PRINTER_H, P, 4), { tone: "faint" }));
  const slot = [[CARD.x0 - 1.5, SLOT_Y - 1.2], [CARD.x1 + 1.5, SLOT_Y - 1.2], [CARD.x1 + 1.5, SLOT_Y + 1.2], [CARD.x0 - 1.5, SLOT_Y + 1.2]];
  out.push(`<path class="slot" d="${k.pathOf(slot.map(([x, y]) => at([x, y, PRINTER_H])), true)}"/>`);
  out.push(L(k.pathOf(slot.map(([x, y]) => at([x, y, PRINTER_H])), true), { tone: "lo" }));
  out.push(L([0, 1, 2, 3, 4].map((i) => k.segment([PRINTER.x + PRINTER.w, PRINTER.y + 6 + i * 4, 6], [PRINTER.x + PRINTER.w, PRINTER.y + 6 + i * 4, 15], P)).join(""), { tone: "faint" }));
  out.push(k.faceTextSvg(k.sideMatrix([PRINTER.x + PRINTER.w / 2, PRINTER.y + PRINTER.d], 9, P, "left"), "FLASHCARDS", { size: 2.6, tone: "lo", anchor: "middle" }));
  out.push(S(k.cylinder(PRINTER.x + 7, PRINTER.y + PRINTER.d - 6, 2.4, PRINTER_H, 1.4, P, 20), { tone: "hi", crease: "none" }));
  out.push(D(k.corners(k.insetPlan(PRINTER, 3), 1.6).map(([x, y]) => at([x, y, PRINTER_H])), { size: 0.4 }));
  return out.join("");
}
function card() {
  const clip = [[CARD.x0 - 4, PRINTER_H], [CARD.x1 + 4, PRINTER_H], [CARD.x1 + 4, PRINTER_H + 60], [CARD.x0 - 4, PRINTER_H + 60]].map(([x, z]) => at([x, SLOT_Y, z]));
  const body = S(slab({ x: CARD.x0, y: SLOT_Y - 0.5, w: CARD.x1 - CARD.x0, d: 1, r: 0.3 }, PRINTER_H - CARD.h, CARD.h, 2), { tone: "hi", crease: "none" });
  const face = `<g transform="${k.sideMatrix([CARD.x0, SLOT_Y + 0.5], PRINTER_H, P, "left")}"><text class="card-q" x="${(CARD.x1 - CARD.x0) / 2}" y="5" font-size="2.4" text-anchor="middle" data-part="card-text">Q</text><path class="card-rule" d="M4 8.6H${CARD.x1 - CARD.x0 - 4}"/><path class="card-rule" d="M6 11H${CARD.x1 - CARD.x0 - 6}"/></g>`;
  return `<clipPath id="card-clip"><path d="${k.pathOf(clip, true)}"/></clipPath><g clip-path="url(#card-clip)"><g data-part="card" style="opacity:0">${body}${face}</g></g>`;
}
const STACK_MAX = 8;
function stack() {
  return Array.from({ length: STACK_MAX }, (_, i) => `<g data-stack="${i}" style="opacity:0">${S(slab({ ...STACK, x: STACK.x + (i % 2) * 0.6, r: 0.6 }, i * 0.9, 0.9, 2), { tone: "hi", crease: "none" })}</g>`).join("");
}

// ---------------------------------------------------------------- assemble
// drawers paint bottom row first, then left to right; the one being pulled is moved to the top layer
const drawerOrder = TOPICS.map((_, i) => i).sort((a, b) => drawerAt(a).z - drawerAt(b).z || drawerAt(a).x - drawerAt(b).x);
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A study machine on a bench. A conveyor carries captures (a PDF, a lecture video, a whiteboard photo, a YouTube lecture, a slide deck) into an intake that embeds them. A tube carries each one into a card-catalog cabinet with sixteen drawers, one per topic; the topic's drawer slides out, a card is filed, and its gauge and light update, red for thin topics and green for well covered ones. A printer beside it prints a flashcard for that topic onto a stack.",
  body: [
    plate(),
    belt(),
    ...Array.from({ length: SLOTS }, (_, i) => itemSlot(i)),
    inlet(),
    cabinet(),
    `<g data-part="drawers">${drawerOrder.map(drawerFront).join("")}</g>`,
    `<g data-part="open-layer"></g>`,
    tube(),
    printer(),
    card(),
    stack(),
  ],
});

const CAPTURES = [
  { type: "pdf", name: "lecture-07.pdf", chunks: 24, topic: "TREES" },
  { type: "whiteboard", name: "whiteboard-tue.jpg", chunks: 3, topic: "GRAPHS" },
  { type: "video", name: "recursion-recording.mp4", chunks: 41, topic: "RECUR" },
  { type: "youtube", name: "youtube · dijkstra explained", chunks: 18, topic: "GRAPHS" },
  { type: "slides", name: "week-5-slides.pdf", chunks: 30, topic: "OS" },
  { type: "pdf", name: "hw3-solutions.pdf", chunks: 12, topic: "DP" },
  { type: "video", name: "networking-lab.mp4", chunks: 26, topic: "NETS" },
  { type: "whiteboard", name: "office-hours-board.jpg", chunks: 4, topic: "MUTEX" },
];
const QUESTIONS = { TREES: "Q: AVL vs red-black?", GRAPHS: "Q: Dijkstra vs BFS?", RECUR: "Q: base case of fib?", OS: "Q: what is paging?", DP: "Q: knapsack recurrence?", NETS: "Q: TCP vs UDP?", MUTEX: "Q: mutex vs semaphore?" };
const START = [6, 2, 5, 1, 2, 1, 7, 4, 8, 3, 6, 1, 4, 2, 5, 3];

const live = `
const P = ${JSON.stringify(P)};
const TYPES = ${JSON.stringify(TYPES)};
const CAPTURES = ${JSON.stringify(CAPTURES)};
const QUESTIONS = ${JSON.stringify(QUESTIONS)};
const TOPICS = ${JSON.stringify(TOPICS)};
const START = ${JSON.stringify(START)};
const SLOTS = ${SLOTS}, STACK_MAX = ${STACK_MAX};
const ITEM_FROM = ${ITEM_FROM}, ITEM_TO = ${ITEM_TO}, BELT = ${JSON.stringify(BELT)}, BELT_TOP = ${BELT_TOP};
const TUBE = ${JSON.stringify(TUBE.map(at))};
const FRONT = ${FRONT}, PROUD = ${PROUD}, OPEN = ${OPEN}, DW = ${DW}, DH = ${DH}, COLS = ${COLS}, ROWS = ${ROWS};
const DX0 = ${DX0}, DZ0 = ${DZ0}, GAP = ${GAP};
const CARD_RISE = ${CARD.h + 2}, FULL = 12;
const drawerAt = ${drawerAt.toString()};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (q) => svg.querySelector(q);
const items = Array.from({ length: SLOTS }, (_, i) => $('[data-item="' + i + '"]'));
const drawers = TOPICS.map((_, i) => $('[data-drawer="' + i + '"]'));
const gauges = TOPICS.map((_, i) => $('[data-gauge="' + i + '"]'));
const leds = TOPICS.map((_, i) => $('[data-led="' + i + '"]'));
const drawerHome = $('[data-part="drawers"]'), openLayer = $('[data-part="open-layer"]');
const stackEls = Array.from({ length: STACK_MAX }, (_, i) => $('[data-stack="' + i + '"]'));
const pulse = $('[data-part="pulse"]'), cardEl = $('[data-part="card"]'), cardText = $('[data-part="card-text"]'), dashes = $('[data-part="dashes"]'), inletLed = $('[data-part="inlet-led"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");

// ---- model
const counts = [...START];
const T_BELT = 2.2, T_TUBE = 0.7, T_OPEN = 0.45, T_FILE = 0.45, T_CLOSE = 0.45, T_CARD = 1.1, EVERY = 3.0;
let flights = [], spawnAt = 0, clock = 0, next = 0, slot = 0, cards = 0, filed = 0, text = "", openFx = null;
const thin = () => TOPICS.filter((_, i) => counts[i] <= 2);

function spawn() {
  const c = CAPTURES[next++ % CAPTURES.length];
  const s = slot++ % SLOTS;
  items[s].querySelectorAll("[data-type]").forEach((g) => (g.style.display = g.dataset.type === c.type ? "" : "none"));
  flights.push({ c, s, t: 0, filed: false, carded: false, stacked: false, drawer: TOPICS.indexOf(c.topic) });
}
function pointOn(u) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < TUBE.length; i++) { const l = Math.hypot(TUBE[i][0] - TUBE[i - 1][0], TUBE[i][1] - TUBE[i - 1][1]); segs.push(l); total += l; }
  let d = u * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [TUBE[i][0] + (TUBE[i + 1][0] - TUBE[i][0]) * f, TUBE[i][1] + (TUBE[i + 1][1] - TUBE[i][1]) * f]; }
    d -= segs[i];
  }
}

// ---- the pulled drawer is rebuilt every frame from the kit: tray floor, side walls, the cards inside, the front
function openDrawer(i, out, drop) {
  const { x, z } = drawerAt(i);
  const y0 = FRONT - 1, y1 = FRONT + out;
  const parts = [];
  if (out > 0.3) {
    parts.push(solidSvg(slabOf({ x: x + 0.4, y: y0, w: DW - 0.8, d: y1 - y0, r: 0.3 }, z + 0.4, 0.9, P, 2), { tone: "lo", crease: "none" }));
    parts.push(solidSvg(slabOf({ x: x + 0.4, y: y0, w: 0.8, d: y1 - y0, r: 0.2 }, z + 0.4, DH - 3, P, 2), { tone: "mid", crease: "none" }));
    // index cards standing in the tray (only the part that has come out of the cabinet)
    const n = Math.min(counts[i], 12);
    for (let c = 0; c < n; c++) {
      const cy = y1 - 1.6 - c * 1.1;
      if (cy < FRONT + 0.2) break;
      parts.push(solidSvg(slabOf({ x: x + 1.6, y: cy - 0.35, w: DW - 3.2, d: 0.35, r: 0 }, z + 1.3, DH - 4.4, P, 1), { tone: "hi", crease: "none" }));
    }
    if (drop >= 0) {
      const cz = z + 1.3 + (1 - drop) * 16;
      parts.push('<g class="new-card">' + solidSvg(slabOf({ x: x + 1.6, y: y1 - 3.2, w: DW - 3.2, d: 0.4, r: 0 }, cz, DH - 4.4, P, 1), { tone: "hi", crease: "none", lit: true }) + "</g>");
    }
    parts.push(solidSvg(slabOf({ x: x + DW - 1.2, y: y0, w: 0.8, d: y1 - y0, r: 0.2 }, z + 0.4, DH - 3, P, 2), { tone: "mid", crease: "none" }));
  }
  openLayer.innerHTML = parts.join("");
  const front = drawers[i];
  if (front.parentNode !== openLayer) openLayer.appendChild(front);
  else openLayer.appendChild(front);
  front.setAttribute("transform", translateAlong(P, [0, out, 0]));
}
function closeDrawer(i) {
  const front = drawers[i];
  front.removeAttribute("transform");
  openLayer.innerHTML = "";
  // put it back in paint order
  const order = TOPICS.map((_, j) => j).sort((a, b) => drawerAt(a).z - drawerAt(b).z || drawerAt(a).x - drawerAt(b).x);
  const after = order.slice(order.indexOf(i) + 1).map((j) => drawers[j]).find((el) => el.parentNode === drawerHome);
  drawerHome.insertBefore(front, after || null);
}
function paintGauges() {
  TOPICS.forEach((_, i) => {
    const { x, z } = drawerAt(i);
    const f = Math.min(1, counts[i] / FULL);
    const a = iso([x + 1.8, FRONT + PROUD, z + 1.4], P), b = iso([x + 1.8 + (DW - 3.6) * f, FRONT + PROUD, z + 1.4], P);
    gauges[i].setAttribute("d", f > 0 ? "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1) : "");
    const state = counts[i] <= 2 ? "thin" : counts[i] <= 5 ? "some" : "good";
    leds[i].setAttribute("class", "led " + state);
    gauges[i].setAttribute("class", "gauge " + state);
  });
}

function draw() {
  let pulseAt = -1, cardLift = -1, active = null;
  flights.forEach((f) => {
    const el = items[f.s];
    const tb = Math.min(1, f.t / T_BELT);
    el.style.opacity = f.t < T_BELT ? "1" : "0";
    el.setAttribute("transform", translateAlong(P, [(ITEM_TO - ITEM_FROM) * tb, 0, 0]));
    const tt = (f.t - T_BELT) / T_TUBE;
    if (tt >= 0 && tt <= 1) pulseAt = tt;
    const td = f.t - T_BELT - T_TUBE;
    if (td >= 0 && td <= T_OPEN + T_FILE + T_CLOSE) active = { f, td };
    const tc = (f.t - T_BELT - T_TUBE - T_OPEN) / T_CARD;
    if (tc >= 0 && tc <= 1) cardLift = tc;
  });
  if (pulseAt >= 0) { const p = pointOn(pulseAt); pulse.setAttribute("cx", p[0].toFixed(1)); pulse.setAttribute("cy", p[1].toFixed(1)); pulse.style.opacity = "1"; }
  else pulse.style.opacity = "0";
  inletLed.style.opacity = pulseAt >= 0 ? "1" : ".25";
  const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  if (active) {
    const { f, td } = active;
    let out, drop = -1;
    if (td < T_OPEN) out = OPEN * ease(td / T_OPEN);
    else if (td < T_OPEN + T_FILE) { out = OPEN; drop = ease((td - T_OPEN) / T_FILE); }
    else out = OPEN * (1 - ease((td - T_OPEN - T_FILE) / T_CLOSE));
    openDrawer(f.drawer, out, drop);
    openFx = f.drawer;
  } else if (openFx !== null) { closeDrawer(openFx); openFx = null; }
  if (cardLift >= 0) {
    const up = cardLift < 0.6 ? cardLift / 0.6 : 1;
    const e = 1 - Math.pow(1 - up, 3);
    cardEl.style.opacity = cardLift < 0.85 ? "1" : String(Math.max(0, 1 - (cardLift - 0.85) / 0.15));
    cardEl.setAttribute("transform", translateAlong(P, [0, 0, e * CARD_RISE]));
  } else cardEl.style.opacity = "0";
  stackEls.forEach((s, i) => (s.style.opacity = i < cards ? "1" : "0"));
  const off = (clock * ((ITEM_TO - ITEM_FROM) / T_BELT)) % 8;
  let d = "";
  for (let x = BELT.x + 3 + off; x < BELT.x + BELT.w - 3; x += 8) { const a = iso([x, BELT.y + 2, BELT_TOP], P), b = iso([x, BELT.y + BELT.d - 2, BELT_TOP], P); d += "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1); }
  dashes.setAttribute("d", d);
  if (readout.textContent !== text) readout.textContent = text;
}
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
  last = now;
  clock += dt;
  spawnAt -= dt;
  if (spawnAt <= 0 && flights.length < SLOTS) { spawn(); spawnAt = EVERY; }
  flights.forEach((f) => {
    f.t += dt;
    if (!f.routed && f.t >= T_BELT) { f.routed = true; text = f.c.name + " · " + f.c.chunks + " chunks embedded"; }
    if (!f.filed && f.t >= T_BELT + T_TUBE + T_OPEN + T_FILE * 0.8) {
      f.filed = true; filed++;
      counts[f.drawer] = Math.min(FULL, counts[f.drawer] + 1);
      paintGauges();
      const gaps = thin();
      text = f.c.name + " → " + f.c.topic + " drawer · " + counts[f.drawer] + " cards" + (gaps.length ? " · thin: " + gaps.slice(0, 3).join(", ") : " · no gaps");
    }
    if (!f.carded && f.t >= T_BELT + T_TUBE + T_OPEN) { f.carded = true; cardText.textContent = QUESTIONS[f.c.topic] || "Q: " + f.c.topic.toLowerCase(); }
    if (!f.stacked && f.t >= T_BELT + T_TUBE + T_OPEN + T_CARD) { f.stacked = true; cards = cards >= STACK_MAX ? 1 : cards + 1; }
  });
  flights = flights.filter((f) => !f.stacked);
  // after a full pass, start a new semester: drawers back to where they began
  if (filed >= CAPTURES.length * 2 && !flights.length) { filed = 0; START.forEach((v, i) => (counts[i] = v)); paintGauges(); text = "new semester · drawers reset"; }
  draw();
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "80px 0px" }).observe(stage);
// click (or Enter) drops the next capture on the belt right away
const drop = () => { if (flights.length < SLOTS) { spawn(); spawnAt = EVERY; run(); } };
stage.addEventListener("click", drop);
stage.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); drop(); } });
paintGauges();
text = still.matches ? "thin: " + thin().join(", ") : "waiting for the first capture";
draw();
`;

const EMBED = `
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
const fit = () => { try { if (frameElement && !COMPACT) frameElement.style.height = Math.ceil(document.querySelector(".iso-page").getBoundingClientRect().height) + "px"; } catch (e) {} };
addEventListener("load", fit); addEventListener("resize", fit); fit();
`;

const EXTRA_CSS = `
html,body{color-scheme:normal!important;background:transparent!important;margin:0}
.iso-page{width:100%!important;margin:0!important}
.iso-figure{margin:0!important}
.iso-plate{--anatomy-card:transparent;box-shadow:none}
html.compact,html.compact body,html.compact .iso-page,html.compact .iso-figure,html.compact .iso-plate{height:100%}
html.compact .iso-legend{display:none}
html.compact .iso-plate-corners{top:64px;left:max(20px,calc((100vw - 1100px) / 2));right:max(20px,calc((100vw - 1100px) / 2))}
html.compact .iso-plate{display:flex;align-items:center;justify-content:center;padding:44px 18px;box-shadow:none;border-radius:inherit;background:transparent;--anatomy-card:transparent}
html.compact .iso-stage{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
html.compact .iso-svg{width:100%;height:100%;max-height:100%}
.iso{--thin:#e5484d;--some:#f5a524;--good:#46c97a}
.iso[data-theme="light"]{--thin:#d93d42;--some:#c98500;--good:#2f9e5b}
.iso-stage{outline:none;cursor:pointer}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-mid);outline-offset:4px}
.well{fill:var(--anatomy-shade-0)}
.led{fill:var(--anatomy-lo)}
.led.thin{fill:var(--thin);filter:drop-shadow(0 0 1.5px var(--thin))}
.led.some{fill:var(--some)}
.led.good{fill:var(--good)}
.gauge{fill:none;stroke-width:1.1px;stroke-linecap:round;vector-effect:non-scaling-stroke}
.gauge.thin{stroke:var(--thin)}.gauge.some{stroke:var(--some)}.gauge.good{stroke:var(--good)}
.tube{fill:none;stroke:var(--anatomy-shade-2);stroke-width:3.2px;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.pulse{fill:#7aa2ff;filter:drop-shadow(0 0 3px #7aa2ff)}
.slot{fill:var(--anatomy-shade-0)}
.card-q{fill:var(--anatomy-text);font-family:var(--anatomy-mono)}
.card-rule{stroke:var(--anatomy-faint);stroke-width:.4}
.ic-paper{fill:#f4f3ef}.ic-fold{fill:#d9d6cc}.ic-ink{stroke:#9a9a9a;stroke-width:.7;stroke-linecap:round}.ic-ink-lo{stroke:#555;stroke-width:.8}
.ic-red{fill:#e5484d}.ic-red-line{fill:none;stroke:#e5484d;stroke-width:.9;stroke-linecap:round}.ic-tag{fill:#fff;font-family:var(--anatomy-mono);font-weight:700}
.ic-dark{fill:#1d1f24}.ic-white{fill:#fff}
.ic-board{fill:#fff;stroke:#c8c8c8;stroke-width:.3}.ic-blue{fill:none;stroke:#3e63dd;stroke-width:.8;stroke-linecap:round}.ic-blue-box{fill:none;stroke:#3e63dd;stroke-width:.6}.ic-blue-fill{fill:#3e63dd}
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Study catalog",
  hint: "Click to drop in a capture",
  readout: "waiting for the first capture",
  keys: [
    { mark: "raised", label: "Captures: PDFs, recordings, whiteboard photos, YouTube, slides" },
    { mark: "lit", label: "Catalog: one drawer per topic, filed by embedding similarity" },
    { mark: "red", label: "Red light: a thin topic (the gap view)" },
    { mark: "green", label: "Green light: well covered" },
  ],
  caption:
    "Everything you learn goes on the belt. The intake embeds each capture into chunks (Gemini multimodal embeddings into ChromaDB) and files them in the drawer of the topic they sit closest to. Each drawer's gauge shows how much you have on that topic, and its light turns red when it is thin, which is the gap view. The printer turns what was just filed into a flashcard.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Study catalog machine. Click or press Enter to drop in another capture.">${svg}</div>`,
});
const html = k.pageHtml({ title: "Study catalog", theme: "dark", body, script: kitScript() + live + EMBED }).replace("</style>", EXTRA_CSS + "</style>");
const out = join(ROOT, "public", "figures", "study-catalog.html");
writeFileSync(out, html);
console.log("wrote", out, Math.round(html.length / 1024) + " KB");
