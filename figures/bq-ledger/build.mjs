// Fig 4 for the BigQuery Rerun Manager case study: the data model as a card
// file and receipt spikes. Run `node figures/bq-ledger/build.mjs` to write
// public/figures/bq-ledger.html.
//
//   card file      = QUERY_METADATA: one card per query (query_id, group_label,
//                    sql_text, is_active, created_at)
//   receipt spikes = QUERY_RUN_LOG: one spike per query_id; every run prints a
//                    receipt (status, error_message, started_at, finished_at)
//                    onto its query's spike. One card, many receipts: 1 → many.
import * as k from "../anatomy-kit/iso-kit.mjs";
import { writePage } from "../shared.mjs";

const WIDTH = 640;
const HEIGHT = 400;

const PLATE = { x: -122, y: -46, w: 248, d: 92, r: 9 };
const PLATE_H = 8;
const FOOT_H = 4;

const TRAY = { x: -112, y: -34, w: 50, d: 44, r: 2 };
const TRAY_H = 12;
const CARD = { x: -108, w: 42, h: 30, d: 0.7 };
const CARD_YS = [-28, -19, -10, -1];
const CARD_Z = 1.2;
const LIFT = 27;

const RACK = { x: -46, y: -14, w: 164, d: 26, r: 2 };
const RACK_H = 5;
const SPIKES = [-24, 18, 60, 102];
const SPIKE_Y = RACK.y + RACK.d / 2;
const SPIKE_H = 34;
const RECEIPT = { w: 22, d: 18, h: 0.55 };
const MAX_RECEIPTS = 16;

const QUERIES = [
  { id: "q-0101", group: "A", sql: "SELECT … FROM orders", active: "true", created: "2025-01-14" },
  { id: "q-0102", group: "A", sql: "MERGE daily_revenue …", active: "true", created: "2025-01-14" },
  { id: "q-0103", group: "B", sql: "INSERT INTO churn …", active: "true", created: "2025-02-03" },
  { id: "q-0104", group: "B", sql: "UPDATE ltv SET …", active: "false", created: "2025-02-21" },
];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [CARD.x, CARD_YS[0], CARD_Z + CARD.h + LIFT + 2], [SPIKES[3] + 11, SPIKE_Y, RACK_H + SPIKE_H]],
  WIDTH,
  HEIGHT,
  { pad: 18, azimuth: 36 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 20)) {
    out.push(S(k.cylinder(x, y, 6, -PLATE_H - FOOT_H, 1.4, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 4.6, -PLATE_H - FOOT_H + 1.4, FOOT_H - 1.4, P, 24), { tone: "mid" }));
  }
  out.push(S(slab(PLATE, -PLATE_H, PLATE_H, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 4.5), 0, P), { tone: "lo" }));
  out.push(D(k.corners(PLATE, 9).map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// ---------------------------------------------------------------- QUERY_METADATA: the card file
function trayBack() {
  const w = 1.4;
  return [
    `<path class="iso-halo" d="${k.haloOf(TRAY, 0, 2, P)}" style="filter:blur(5px)"/>`,
    S(slab(TRAY, 0, 1.4, 4, 0.3), { tone: "lo" }),
    S(slab({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: w, r: 0.4 }, 1.4, TRAY_H), { tone: "mid" }),
    S(slab({ x: TRAY.x, y: TRAY.y, w: w, d: TRAY.d, r: 0.4 }, 1.4, TRAY_H), { tone: "mid" }),
  ].join("");
}
function trayFront() {
  const w = 1.4;
  const fy = TRAY.y + TRAY.d;
  const out = [
    S(slab({ x: TRAY.x, y: fy - w, w: TRAY.w, d: w, r: 0.4 }, 1.4, TRAY_H), { tone: "mid" }),
    S(slab({ x: TRAY.x + TRAY.w - w, y: TRAY.y, w: w, d: TRAY.d, r: 0.4 }, 1.4, TRAY_H), { tone: "mid" }),
  ];
  // brass label holder on the front
  const lh = [[TRAY.x + 9, 10], [TRAY.x + TRAY.w - 9, 10], [TRAY.x + TRAY.w - 9, 5], [TRAY.x + 9, 5]];
  out.push(L(k.pathOf(lh.map(([x, z]) => at([x, fy, z])), true), { tone: "lo" }));
  out.push(k.faceTextSvg(k.sideMatrix([TRAY.x + TRAY.w / 2, fy], 8.3, P, "left"), "QUERY_METADATA", { size: 2.4, tone: "hi", anchor: "middle" }));
  out.push(D([at([TRAY.x + 7, fy, 7.5]), at([TRAY.x + TRAY.w - 7, fy, 7.5])], { size: 0.45 }));
  return out.join("");
}
const FIELDS = (q) => [
  ["query_id", q.id],
  ["group_label", q.group],
  ["sql_text", q.sql],
  ["is_active", q.active],
  ["created_at", q.created],
];
function card(q, i) {
  const y = CARD_YS[i];
  const out = [S(slab({ x: CARD.x, y, w: CARD.w, d: CARD.d, r: 0.3 }, CARD_Z, CARD.h, 2), { tone: "hi", crease: "none" })];
  // index tab on top
  const tabX = CARD.x + 4 + i * 9;
  out.push(S(slab({ x: tabX, y, w: 8, d: CARD.d, r: 0.3 }, CARD_Z + CARD.h, 3.2, 2), { tone: "hi", crease: "none" }));
  out.push(k.faceTextSvg(k.sideMatrix([tabX + 4, y + CARD.d], CARD_Z + CARD.h + 1, P, "left"), q.id.slice(2), { size: 1.7, tone: "lo", anchor: "middle" }));
  // the fields, in the upper part of the card face (the part that clears the tray when lifted)
  const face = k.sideMatrix([CARD.x, y + CARD.d], CARD_Z + CARD.h, P, "left");
  const rows = FIELDS(q).map(([name, value], r) => `<text class="f-name" x="3" y="${7.4 + r * 4.2}" font-size="2.6">${name}</text><text class="f-val" x="17.5" y="${7.4 + r * 4.2}" font-size="2.6">${value}</text>`).join("");
  out.push(`<g class="fields" transform="${face}"><text class="f-head" x="3" y="3.6" font-size="2.2">QUERY_METADATA</text><path class="f-rule" d="M3 4.8H${CARD.w - 3}"/>${rows}<path class="f-rule" d="M15.6 5.4V${7.4 + 4 * 4.2 + 1.2}"/></g>`);
  return `<g data-card="${i}">${out.join("")}</g>`;
}

// ---------------------------------------------------------------- QUERY_RUN_LOG: the spike rack
function rack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(RACK, 0, RACK_H, P)}" style="filter:blur(5px)"/>`];
  out.push(S(slab(RACK, 0, RACK_H, 4, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(RACK, 2.5), RACK_H, P, 4), { tone: "faint" }));
  const fy = RACK.y + RACK.d;
  out.push(k.faceTextSvg(k.sideMatrix([RACK.x + 6, fy], 3.2, P, "left"), "QUERY_RUN_LOG", { size: 2.2, tone: "hi" }));
  SPIKES.forEach((sx, i) => {
    out.push(S(k.cylinder(sx, SPIKE_Y, 4, RACK_H, 1.2, P, 24, 0.3), { tone: "mid" }));
    out.push(`<text class="spike-label" data-spike-label="${i}" transform="${k.sideMatrix([sx, fy], 3.2, P, "left")}" font-size="2" text-anchor="middle">${QUERIES[i].id}</text>`);
  });
  return out.join("");
}
function receiptStack(i) {
  const sx = SPIKES[i];
  const plan = { x: sx - RECEIPT.w / 2, y: SPIKE_Y - RECEIPT.d / 2, w: RECEIPT.w, d: RECEIPT.d, r: 0.6 };
  const items = Array.from({ length: MAX_RECEIPTS }, (_, n) => {
    const z = RACK_H + 1.2 + n * RECEIPT.h;
    const jitter = ((n * 37) % 7) / 7 - 0.5;
    const p = { ...plan, x: plan.x + jitter * 1.4, y: plan.y + (((n * 53) % 5) / 5 - 0.5) * 1.2 };
    const stripe = k.lineOnTop([p.x + 1.2, p.y + 1.6], [p.x + 1.2, p.y + p.d - 1.6], z + RECEIPT.h, P);
    return `<g data-receipt="${i}-${n}" style="opacity:0">${S(slab(p, z, RECEIPT.h, 2), { tone: "hi", crease: "none" })}<path class="stripe" d="${stripe}"/></g>`;
  }).join("");
  // the printed face of the top receipt; moved up as the stack grows
  const face = k.topMatrix([plan.x + 3, plan.y + 2], RACK_H + 1.2 + RECEIPT.h, P, "x");
  const text = `<g data-face="${i}"><g transform="${face}"><text class="r-text" data-r="${i}-0" x="0" y="2.4" font-size="2.4"></text><text class="r-text" data-r="${i}-1" x="0" y="5.6" font-size="2.4"></text><text class="r-text" data-r="${i}-2" x="0" y="8.8" font-size="2.4"></text><text class="r-text" data-r="${i}-3" x="0" y="12" font-size="2.4"></text></g></g>`;
  const spike = S(k.cylinder(sx, SPIKE_Y, 0.55, RACK_H + 1.2, SPIKE_H, P, 10), { tone: "hi", crease: "none" });
  return `<g data-stack="${i}">${items}${text}${spike}</g>`;
}

// ---------------------------------------------------------------- assemble
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "The data model as a card file and receipt spikes. A tray labelled QUERY_METADATA holds one card per query, printed with query_id, group_label, sql_text, is_active and created_at. A rack labelled QUERY_RUN_LOG has one spike per query_id, and every run of that query prints a receipt with its status, error and start and finish times onto that spike: one card, many receipts.",
  body: [
    plate(),
    rack(),
    ...SPIKES.map((_, i) => receiptStack(i)),
    trayBack(),
    ...QUERIES.map(card),
    trayFront(),
    // invisible: where the lifted card reaches, so the auto-crop leaves room for it
    `<path class="extent" d="${k.pathOf([[CARD.x, CARD_YS[0], CARD_Z + CARD.h + LIFT + 4], [CARD.x + CARD.w, CARD_YS[0], CARD_Z + CARD.h + LIFT + 4], [CARD.x + CARD.w, CARD_YS[3], CARD_Z + CARD.h + LIFT + 4]].map(at), true)}"/>`,
    `<path data-part="wire" class="wire" d=""/><circle data-part="wire-a" class="wire-end" r="1.6"/><circle data-part="wire-b" class="wire-end" r="1.6"/>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const QUERIES = ${JSON.stringify(QUERIES)};
const SPIKES = ${JSON.stringify(SPIKES)}, SPIKE_Y = ${SPIKE_Y}, RACK_H = ${RACK_H}, SPIKE_H = ${SPIKE_H};
const RECEIPT_H = ${RECEIPT.h}, MAX = ${MAX_RECEIPTS}, LIFT = ${LIFT};
const CARD = ${JSON.stringify(CARD)}, CARD_YS = ${JSON.stringify(CARD_YS)}, CARD_Z = ${CARD_Z};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (q) => svg.querySelector(q);
const cards = QUERIES.map((_, i) => $('[data-card="' + i + '"]'));
const receipts = SPIKES.map((_, i) => Array.from({ length: MAX }, (_, n) => $('[data-receipt="' + i + "-" + n + '"]')));
const faces = SPIKES.map((_, i) => $('[data-face="' + i + '"]'));
const lines = SPIKES.map((_, i) => [0, 1, 2, 3].map((r) => $('[data-r="' + i + "-" + r + '"]')));
const labels = SPIKES.map((_, i) => $('[data-spike-label="' + i + '"]'));
const wire = $('[data-part="wire"]'), wa = $('[data-part="wire-a"]'), wb = $('[data-part="wire-b"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---- model: runs per query, each with a status and times
const runs = [5, 3, 7, 2].map((n, i) => Array.from({ length: n }, (_, r) => ({ ok: (r + i) % 6 !== 4, t: 2 * 60 + r * 3 + i })));
let active = 0, lift = 0, dropping = -1, dropT = 0, text = "", clock = 0;
const hhmmss = (s) => "02:" + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

function paintStack(i) {
  const n = runs[i].length;
  receipts[i].forEach((el, k2) => {
    const shown = k2 < n;
    el.style.opacity = shown ? "1" : "0";
    el.classList.toggle("bad", shown && !runs[i][k2].ok);
    const fall = k2 === n - 1 && dropping === i ? (1 - ease(dropT)) * 22 : 0;
    el.setAttribute("transform", fall ? translateAlong(P, [0, 0, fall]) : "");
  });
  const top = runs[i][n - 1];
  const fall = dropping === i ? (1 - ease(dropT)) * 22 : 0;
  faces[i].setAttribute("transform", translateAlong(P, [0, 0, Math.max(0, n - 1) * RECEIPT_H + fall]));
  faces[i].style.opacity = n ? "1" : "0";
  if (top) {
    const set = (r, s) => { if (lines[i][r].textContent !== s) lines[i][r].textContent = s; };
    set(0, QUERIES[i].id + "  run " + n);
    set(1, "status  " + (top.ok ? "SUCCESS" : "FAILED"));
    set(2, "error   " + (top.ok ? "none" : "timeout"));
    set(3, hhmmss(top.t) + " → " + hhmmss(top.t + 14));
    lines[i][1].classList.toggle("bad", !top.ok);
  }
  labels[i].textContent = QUERIES[i].id + " · " + n + " runs";
}
function draw() {
  cards.forEach((c, i) => c.setAttribute("transform", i === active ? translateAlong(P, [0, 0, lift * LIFT]) : ""));
  cards.forEach((c, i) => c.classList.toggle("active", i === active));
  SPIKES.forEach((_, i) => paintStack(i));
  // the "executes" wire: from the lifted card's edge to the top of its spike
  const y = CARD_YS[active] + CARD.d;
  const a = iso([CARD.x + CARD.w, y, CARD_Z + CARD.h * 0.55 + lift * LIFT], P);
  const n = runs[active].length;
  const b = iso([SPIKES[active], SPIKE_Y, RACK_H + 1.2 + n * RECEIPT_H + 4], P);
  const mid = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 26];
  const show = lift > 0.6;
  wire.setAttribute("d", show ? "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "Q" + mid[0].toFixed(1) + " " + mid[1].toFixed(1) + " " + b[0].toFixed(1) + " " + b[1].toFixed(1) : "");
  [wa, wb].forEach((e, j) => { const p = j ? b : a; e.setAttribute("cx", p[0].toFixed(1)); e.setAttribute("cy", p[1].toFixed(1)); e.style.opacity = show ? "1" : "0"; });
  if (readout.textContent !== text) readout.textContent = text;
}

const steps = [];
const step = (dur, fn, done) => steps.push({ dur, fn, done });
function plan() {
  step(0.6, (t) => { lift = ease(t); }, () => { text = QUERIES[active].id + " · " + runs[active].length + " runs in query_run_log"; });
  for (let r = 0; r < 2; r++) {
    step(0.25, () => {});
    step(0.6, (t) => {
      if (dropping < 0) {
        const i = active;
        if (runs[i].length >= MAX) runs[i] = runs[i].slice(-4);
        const prev = runs[i][runs[i].length - 1];
        runs[i].push({ ok: Math.random() > 0.2, t: (prev ? prev.t : 120) + 37 });
        dropping = i;
      }
      dropT = t;
    }, () => {
      const top = runs[active][runs[active].length - 1];
      dropping = -1;
      text = QUERIES[active].id + " · run " + runs[active].length + " logged · " + (top.ok ? "success" : "failed, error saved") + " · still one card";
    });
  }
  step(1.4, () => {});
  step(0.5, (t) => { lift = 1 - ease(t); }, () => { active = (active + 1) % QUERIES.length; });
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
// click a card to pull that query
cards.forEach((c, i) => c.addEventListener("click", (e) => { e.stopPropagation(); steps.length = 0; current = null; lift = 0; active = i; go(); }));
if (still.matches) { lift = 1; text = QUERIES[0].id + " · " + runs[0].length + " runs in query_run_log"; }
else text = "query_metadata ← executes → query_run_log";
draw();
`;

const css = `
[data-card] .fields{opacity:0;transition:opacity .3s}
[data-card].active .fields{opacity:1}
.extent{fill:none;stroke:none}
.f-head{fill:var(--anatomy-muted);font-family:var(--anatomy-mono);letter-spacing:.06em}
.f-name{fill:var(--anatomy-muted);font-family:var(--anatomy-mono)}
.f-val{fill:var(--anatomy-strong);font-family:var(--anatomy-mono)}
.f-rule{fill:none;stroke:var(--anatomy-faint);stroke-width:.3}
.r-text{fill:var(--anatomy-text);font-family:var(--anatomy-mono)}
.r-text.bad{fill:#e5484d}
.spike-label{fill:var(--anatomy-text);font-family:var(--anatomy-mono)}
.stripe{fill:none;stroke:#46c97a;stroke-width:1.4px;vector-effect:non-scaling-stroke}
.bad .stripe{stroke:#e5484d}
.wire{fill:none;stroke:#5b8cff;stroke-width:1.2px;stroke-dasharray:3 3;vector-effect:non-scaling-stroke;animation:iso-flow 1.4s linear infinite}
.wire-end{fill:var(--anatomy-paper);stroke:#5b8cff;stroke-width:1px;vector-effect:non-scaling-stroke}
[data-card]{cursor:pointer}
`;

const body = k.plateHtml({
  fig: "Fig 4",
  title: "Data model",
  hint: "Click a card to pull that query",
  readout: "query_metadata ← executes → query_run_log",
  keys: [
    { mark: "raised", label: "Cards: QUERY_METADATA, one per query" },
    { mark: "raised", label: "Spikes: QUERY_RUN_LOG, one receipt per run" },
    { mark: "green", label: "Success" },
    { mark: "red", label: "Failed, error saved" },
    { mark: "blue", label: "executes: one query, many runs" },
  ],
  caption:
    "Two tables in BigQuery. QUERY_METADATA holds the queries themselves, so changing one is editing a row, not redeploying. QUERY_RUN_LOG gets a new row for every run, keyed by query_id, with its status, error and timings: one query, many runs. Both live in BigQuery, so debugging a failure is a SQL query over the log.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Data model figure: a card file of queries and receipt spikes of runs.">${svg}</div>`,
});

writePage(k, { name: "bq-ledger.html", title: "Data model", body, live, css });
