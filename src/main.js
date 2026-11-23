import { questions } from "./questions.js";
import * as G from "./game.js";
import { LANDMARKS, LOGO, CHEST } from "./art.js";
import { sfx, unlockAudio, played } from "./audio.js";

const KEY = "treasureQuiz_v3", LEGACY = "treasureQuiz_v02";
const root = document.getElementById("app");
const fx = document.getElementById("fx");
const reduceMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const LETTERS = "ABCD";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- persistence (validated on every load) ---------- */
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ } }
function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return G.sanitize(JSON.parse(raw));
    const old = localStorage.getItem(LEGACY);
    if (old) return G.sanitize(G.migrateLegacy(JSON.parse(old)));
  } catch (e) { /* corrupted -> fresh */ }
  return G.emptyState();
}
let state = loadState();
persist();
const setState = (s) => { state = s; persist(); };

/* ---------- UI state ---------- */
const ui = { view: "welcome", region: 0, qi: 0, review: { scope: "all", region: 0, back: "map", filter: "all" }, modal: null, draftAvatar: null };
const portrait = window.matchMedia ? matchMedia("(max-width: 720px)") : { matches: false };

/* ---------- shared pieces ---------- */
const soundBtn = () => `<button class="icon-btn" data-action="sound" aria-pressed="${state.sound}" aria-label="${state.sound ? "Matikan suara" : "Nyalakan suara"}"><span aria-hidden="true">${state.sound ? "🔊" : "🔇"}</span><span class="lbl">${state.sound ? "Suara" : "Hening"}</span></button>`;
const topbar = (extra = "") => `<header class="topbar"><div class="brand">${LOGO}<div><b>Treasure Quiz</b><small>The Lost Treasure of Knowledge</small></div></div><div class="top-actions">${extra}${soundBtn()}</div></header>`;
const scorePill = () => `<div class="pill score" id="score" title="Skor kamu"><span aria-hidden="true">⭐</span> <b>${G.overall(state).score}</b></div>`;

/* ---------- views ---------- */
function vWelcome() {
  const o = G.overall(state), has = !!state.name, started = o.answered > 0;
  return `${topbar()}
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Petualangan Bahasa Indonesia · Kelas 4</p>
      <h1 data-autofocus tabindex="-1">The Lost Treasure<br><span>of Knowledge</span></h1>
      <p class="lead">Jelajahi lima wilayah ajaib, jawab pertanyaan, kumpulkan kunci dan permata, lalu temukan harta karun terakhir!</p>
      <ul class="chips"><li>🗺️ 5 wilayah</li><li>📜 35 tantangan</li><li>⭐ 3.500 poin</li></ul>
      ${has ? `<p class="welcome-back">Halo lagi, <b>${state.avatar} ${esc(state.name)}</b>!${started ? ` Kamu sudah menjawab ${o.answered} dari ${G.TOTAL} tantangan.` : ""}</p>` : ""}
      <div class="row">
        <button class="btn primary big" id="start" data-action="${has ? "goMap" : "goProfile"}">${started ? "Lanjutkan Petualangan" : "Mulai Petualangan"} <span aria-hidden="true">→</span></button>
        ${has ? `<button class="btn secondary" data-action="goProfile">Ganti penjelajah</button>` : ""}
        ${started ? `<button class="btn ghost" data-action="restart">Petualangan baru</button>` : ""}
      </div>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="sun"></div><div class="cloud c1"></div><div class="cloud c2"></div><div class="hills"></div>
      ${LANDMARKS.map((l, i) => `<div class="lm lm${i + 1}">${l}</div>`).join("")}
    </div>
  </section>`;
}

function vProfile() {
  const av = ui.draftAvatar || state.avatar;
  return `${topbar()}
  <section class="card profile">
    <h2 data-autofocus tabindex="-1">Siapa namamu, Penjelajah?</h2>
    <form data-form="profile" novalidate>
      <label for="nick">Nama panggilan</label>
      <input id="nick" class="input" name="nick" maxlength="${G.NAME_MAX}" autocomplete="off" autocapitalize="words" placeholder="Contoh: Dina" value="${esc(state.name)}" aria-describedby="nickHint nickErr">
      <p class="hint" id="nickHint">Cukup nama panggilan saja. Jangan tulis nama lengkap atau data pribadi.</p>
      <p class="err" id="nickErr" role="alert"></p>
      <fieldset class="avatars"><legend>Pilih temanmu</legend>
        ${G.AVATARS.map((a) => `<button type="button" class="avatar${a === av ? " chosen" : ""}" data-action="avatar" data-v="${a}" aria-pressed="${a === av}" aria-label="Teman ${a}">${a}</button>`).join("")}
      </fieldset>
      <div class="row end"><button type="button" class="btn ghost" data-action="goWelcome">← Kembali</button><button class="btn primary" type="submit">Ke Peta →</button></div>
    </form>
  </section>`;
}

const LAYOUTS = {
  land: [[12, 68], [31, 33], [50, 68], [69, 31], [88, 60]],
  port: [[27, 87], [72, 70], [28, 52], [72, 34], [40, 15]],
};
function pathD(pts, a, b) {
  const p = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const seg = (i) => { const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    return `M${p1[0]} ${p1[1]} C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`; };
  let d = ""; for (let i = a; i < b; i++) d += seg(i); return d;
}
function flowers(n) {
  let seed = 7, out = "";
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const cols = ["#fff", "#ffd1e0", "#ffe27a", "#d9ccff"];
  for (let i = 0; i < n; i++) out += `<i class="fl" style="left:${(rnd() * 96 + 2).toFixed(1)}%;top:${(rnd() * 42 + 55).toFixed(1)}%;background:${cols[i % 4]}"></i>`;
  return out;
}
function vMap() {
  const o = G.overall(state), lay = portrait.matches ? "port" : "land", pts = LAYOUTS[lay], cur = G.currentRegion(state);
  const doneUpTo = G.REGIONS.reduce((n, _, r) => (G.regionStatus(state, r) === "completed" && n === r ? r + 1 : n), 0);
  const next = G.REGIONS[cur];
  const nodes = G.REGIONS.map((R, r) => {
    const st = G.regionStatus(state, r), s = G.regionStats(state, r), [x, y] = pts[r];
    const label = st === "locked" ? "Terkunci" : st === "completed" ? `Selesai · ${s.correct}/${G.PER_REGION} benar` : s.answered ? `Lanjut · ${s.answered}/${G.PER_REGION}` : "Ayo mulai!";
    const badge = st === "locked" ? `<span class="badge">🔒</span>` : st === "completed" ? `<span class="badge done">✓</span>` : "";
    const you = r === cur && !o.complete ? `<span class="you">${state.avatar}</span>` : "";
    return `<button class="node ${st}" style="left:${x}%;top:${y}%" data-action="region" data-r="${r}" ${st === "locked" ? 'aria-disabled="true"' : ""} aria-label="${R.name}. ${label}.">
      <span class="art">${LANDMARKS[r]}${badge}${you}</span><span class="nlabel"><b>${R.name}</b><small>${label}</small></span></button>`;
  }).join("");
  return `${topbar()}
  <section class="map-screen">
    <div class="map-head">
      <div class="player"><span class="av" aria-hidden="true">${state.avatar}</span><div><b>${esc(state.name || "Penjelajah")}</b><small>Penjelajah</small></div></div>
      <div class="stats"><div class="pill"><span aria-hidden="true">⭐</span> <b>${o.score}</b> <small>poin</small></div><div class="pill"><span aria-hidden="true">🗺️</span> <b>${o.regionsDone}/5</b> <small>wilayah</small></div><div class="pill"><span aria-hidden="true">✅</span> <b>${o.answered}/${G.TOTAL}</b> <small>tantangan</small></div></div>
    </div>
    <h1 class="sr-only" data-autofocus tabindex="-1">Peta Petualangan</h1>
    <div class="map-wrap map-${lay}">
      <svg class="scene" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd3ff"/><stop offset=".55" stop-color="#d8f4ff"/></linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9be08f"/><stop offset="1" stop-color="#5ec47b"/></linearGradient></defs>
        <rect width="100" height="100" fill="url(#sky)"/>
        <path d="M0 52 Q22 36 44 50 T100 44 V100 H0Z" fill="#b7ebb0"/>
        <path d="M0 62 Q30 50 60 62 T100 58 V100 H0Z" fill="url(#grass)"/>
        <path d="${pathD(pts, 0, 4)}" fill="none" stroke="#fff7d6" stroke-width="16" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".9"/>
        <path d="${pathD(pts, 0, 4)}" fill="none" stroke="#e6c987" stroke-width="3" stroke-dasharray="1 14" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        ${doneUpTo > 0 ? `<path d="${pathD(pts, 0, Math.min(doneUpTo, 4))}" fill="none" stroke="#ffc83d" stroke-width="8" stroke-linecap="round" vector-effect="non-scaling-stroke"/>` : ""}
      </svg>
      <div class="sunmap"></div><div class="cloud c1"></div><div class="cloud c2"></div>${flowers(18)}${nodes}
    </div>
    <div class="map-foot">
      <p class="hint-line" id="toast" role="status" aria-live="polite">${o.complete ? "Kamu sudah menyelesaikan semua wilayah! Buka harta karunnya!" : `Berikutnya: <b>${next.name}</b> — ${next.blurb}.`}</p>
      <div class="row">
        ${o.complete ? `<button class="btn primary big" data-action="final">🎁 Buka Harta Karun!</button>` : `<button class="btn primary big" data-action="region" data-r="${cur}">${G.regionStats(state, cur).answered ? "Lanjutkan" : "Mulai"} ${next.name} →</button>`}
        ${o.answered ? `<button class="btn secondary" data-action="review" data-scope="all" data-back="map">📖 Review jawaban</button>` : ""}
        <button class="btn ghost" data-action="goProfile">Ubah penjelajah</button>
        ${o.answered ? `<button class="btn ghost" data-action="restart">Petualangan baru</button>` : ""}
      </div>
    </div>
  </section>`;
}

const FB_OK = ["Benar! Kamu hebat!", "Tepat sekali!", "Keren, jawabanmu benar!", "Mantap, terus semangat!"];
const FB_TRY = ["Belum tepat, tapi kamu berani mencoba!", "Hampir! Yuk kita pelajari bersama.", "Tidak apa-apa, salah itu bagian dari belajar!", "Semangat! Lihat jawaban yang benar ya."];
function vQuiz() {
  const r = ui.region, R = G.REGIONS[r], q = G.qOf(r, ui.qi), a = state.answers[q.id], answered = !!a, ok = answered && a.choice === q.answer;
  const last = ui.qi === G.PER_REGION - 1;
  const dots = Array.from({ length: G.PER_REGION }, (_, i) => { const qq = G.qOf(r, i), aa = state.answers[qq.id];
    return `<li class="${aa ? (aa.choice === qq.answer ? "ok" : "miss") : ""}${i === ui.qi ? " now" : ""}" aria-label="Soal ${i + 1}${aa ? (aa.choice === qq.answer ? " benar" : " belum tepat") : ""}"></li>`; }).join("");
  const opts = q.opts.map((o, j) => {
    const cls = !answered ? "" : j === q.answer ? " correct" : j === a.choice ? " wrong" : " dim";
    const mark = !answered ? "" : j === q.answer ? "✓" : j === a.choice ? "✗" : "";
    return `<button class="opt${cls}" data-action="answer" data-c="${j}" ${answered ? "disabled" : ""}><span class="ltr">${LETTERS[j]}</span><span class="otxt">${esc(o)}</span><span class="mark" aria-hidden="true">${mark}</span></button>`;
  }).join("");
  const msg = (ok ? FB_OK : FB_TRY)[(r + ui.qi) % 4];
  const fb = answered ? `<div class="feedback ${ok ? "good" : "try"}" role="status"><div class="fb-head"><span class="fb-emoji" aria-hidden="true">${ok ? "🎉" : "💪"}</span><div><b>${msg}</b><span class="pts${ok ? "" : " soft"}">${ok ? "+100 poin" : "+0 poin · ayo belajar bersama!"}</span></div></div>
      <p><b>Jawaban benar:</b> ${LETTERS[q.answer]}. ${esc(q.opts[q.answer])}</p><p><b>Penjelasan:</b> ${esc(q.why)}</p></div>
      <button class="btn primary big" data-action="next" data-autofocus>${last ? "Selesaikan Wilayah 🏁" : "Pertanyaan Berikutnya →"}</button>` : "";
  return `${topbar(`<button class="btn ghost small" data-action="goMap">← Peta</button>`)}
  <section class="quiz">
    <div class="quiz-head"><div class="region-tag"><span aria-hidden="true">${R.icon}</span> ${R.name}</div>${scorePill()}</div>
    <ol class="dots" aria-label="Kemajuan: soal ${ui.qi + 1} dari ${G.PER_REGION}">${dots}</ol>
    <article class="card q-card">
      <p class="topic">Tantangan ${ui.qi + 1} dari ${G.PER_REGION} · ${esc(q.topic)}</p>
      <h1 class="question" ${answered ? "" : "data-autofocus"} tabindex="-1">${esc(q.q)}</h1>
      <div class="opts" role="group" aria-label="Pilihan jawaban">${opts}</div>
      ${fb}
    </article>
  </section>`;
}

function vReward() {
  const r = ui.region, R = G.REGIONS[r], s = G.regionStats(state, r), o = G.overall(state), nextR = G.REGIONS[r + 1];
  const perfect = s.correct === G.PER_REGION;
  return `${topbar()}
  <section class="reward card">
    <div class="medal" aria-hidden="true">${perfect ? "🏆" : "🎖️"}</div>
    <p class="eyebrow">Wilayah selesai!</p>
    <h1 data-autofocus tabindex="-1">${perfect ? "Sempurna!" : "Kerja bagus"}, ${esc(state.name)}!</h1>
    <p class="lead">Kamu menyelesaikan <b>${R.name}</b>.</p>
    <div class="tally"><div><small>Poin wilayah ini</small><b>+${s.score}</b></div><div><small>Jawaban benar</small><b>${s.correct}/${G.PER_REGION}</b></div><div><small>Total poin</small><b>${o.score}</b></div></div>
    <div class="loot"><span class="loot-ico" aria-hidden="true">${R.rewardIcon}</span><div><small>Hadiah baru</small><b>${R.reward}</b></div></div>
    ${nextR ? `<p class="unlock">🔓 Wilayah baru terbuka: <b>${nextR.name}</b></p>` : `<p class="unlock">🎁 Harta karun terakhir menantimu!</p>`}
    <div class="progress" role="img" aria-label="${o.regionsDone} dari 5 wilayah selesai"><span style="width:${(o.regionsDone / 5) * 100}%"></span></div>
    <p class="hint">${o.regionsDone} dari 5 wilayah selesai</p>
    <div class="row">
      <button class="btn secondary" data-action="review" data-scope="region" data-region="${r}" data-back="reward">📖 Review jawaban</button>
      ${nextR ? `<button class="btn primary big" data-action="goMap">Ke Peta Petualangan →</button>` : `<button class="btn primary big" data-action="final">🎁 Buka Harta Karun!</button>`}
    </div>
  </section>`;
}

function vReview() {
  const { scope, region, filter } = ui.review;
  const qs = scope === "region" ? Array.from({ length: G.PER_REGION }, (_, i) => G.qOf(region, i)) : questions;
  const items = qs.map((q) => ({ q, a: state.answers[q.id] })).filter((x) => x.a);
  const wrong = items.filter((x) => x.a.choice !== x.q.answer);
  const shown = filter === "wrong" ? wrong : items;
  const title = scope === "region" ? `Review: ${G.REGIONS[region].name}` : "Review semua jawaban";
  const body = !items.length
    ? `<div class="empty"><div aria-hidden="true">🧭</div><p>Belum ada jawaban untuk ditinjau di sini. Mainkan wilayah ini dulu ya!</p>${scope === "region" && G.regionStatus(state, region) !== "locked" ? `<button class="btn primary" data-action="region" data-r="${region}">Mulai ${G.REGIONS[region].name}</button>` : `<button class="btn primary" data-action="goMap">Ke Peta</button>`}</div>`
    : !shown.length ? `<div class="empty"><div aria-hidden="true">🌟</div><p>Tidak ada jawaban yang perlu dipelajari lagi. Hebat!</p></div>`
    : shown.map(({ q, a }) => { const ok = a.choice === q.answer;
        return `<article class="rv ${ok ? "good" : "try"}"><header><span class="num">${G.numberOf(q)}</span><span class="topic">${esc(q.topic)}</span><span class="tag ${ok ? "good" : "try"}">${ok ? "✓ Benar" : "Belum tepat"}</span></header>
        <h3>${esc(q.q)}</h3>
        <p><b>Jawabanmu:</b> ${LETTERS[a.choice]}. ${esc(q.opts[a.choice])}</p>
        ${ok ? "" : `<p><b>Jawaban benar:</b> ${LETTERS[q.answer]}. ${esc(q.opts[q.answer])}</p>`}
        <p class="why"><b>Penjelasan:</b> ${esc(q.why)}</p></article>`; }).join("");
  return `${topbar(`<button class="btn ghost small" data-action="reviewBack">← Kembali</button>`)}
  <section class="review">
    <h1 data-autofocus tabindex="-1">${title}</h1>
    <p class="lead">${items.length ? `${items.length - wrong.length} benar dari ${items.length} soal yang sudah dijawab.` : ""}</p>
    ${items.length ? `<div class="filters" role="group" aria-label="Saring"><button class="chip${filter === "all" ? " on" : ""}" data-action="filter" data-f="all" aria-pressed="${filter === "all"}">Semua (${items.length})</button><button class="chip${filter === "wrong" ? " on" : ""}" data-action="filter" data-f="wrong" aria-pressed="${filter === "wrong"}">Perlu dipelajari (${wrong.length})</button></div>` : ""}
    <div class="rv-list">${body}</div>
  </section>`;
}

function vFinal() {
  const o = G.overall(state), rk = G.rank(o.percent);
  const rows = G.REGIONS.map((R, r) => { const s = G.regionStats(state, r);
    return `<li><span class="ico" aria-hidden="true">${R.rewardIcon}</span><div class="grow"><b>${R.name}</b><small>${R.reward}</small><div class="bar" aria-hidden="true"><span style="width:${(s.correct / G.PER_REGION) * 100}%"></span></div></div><span class="sc">${s.correct}/${G.PER_REGION}</span></li>`; }).join("");
  return `${topbar()}
  <section class="final card">
    <div class="chest" id="chest" aria-hidden="true">${CHEST}</div>
    <p class="eyebrow">Harta karun ditemukan!</p>
    <h1 data-autofocus tabindex="-1">Selamat, ${esc(state.name)}!</h1>
    <p class="rank">${rk.title}</p><p class="lead">${rk.text}</p>
    <div class="tally big"><div><small>Skor akhir</small><b>⭐ ${o.score}</b><em>dari ${G.MAX_SCORE}</em></div><div><small>Jawaban benar</small><b>${o.correct}/${G.TOTAL}</b><em>${o.percent}%</em></div><div><small>Wilayah</small><b>${o.regionsDone}/5</b><em>selesai</em></div></div>
    <ul class="breakdown">${rows}</ul>
    <div class="row">
      <button class="btn secondary" data-action="review" data-scope="all" data-back="final">📖 Review jawaban</button>
      <button class="btn secondary" data-action="goMap">🗺️ Lihat peta</button>
      <button class="btn primary" data-action="restart">🔁 Main lagi</button>
    </div>
  </section>`;
}

const modalHTML = () => `<div class="modal-back" data-action="closeModal" data-backdrop><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt">
  <h3 id="mt">Mulai petualangan baru?</h3><p>Semua skor dan jawabanmu akan dihapus. Nama dan temanmu tetap tersimpan.</p>
  <div class="row end"><button class="btn ghost" data-action="closeModal" data-autofocus>Batal</button><button class="btn danger" data-action="confirmRestart">Ya, mulai baru</button></div></div></div>`;

const VIEWS = { welcome: vWelcome, profile: vProfile, map: vMap, quiz: vQuiz, reward: vReward, review: vReview, final: vFinal };

/* ---------- rendering ---------- */
function render({ scroll = false } = {}) {
  root.innerHTML = `<div class="shell">${VIEWS[ui.view]()}</div>${ui.modal ? modalHTML() : ""}`;
  document.body.dataset.view = ui.view;
  if (scroll) window.scrollTo(0, 0);
  const f = root.querySelector("[data-autofocus]");
  if (f) f.focus({ preventScroll: true });
  if (ui.view === "final") setTimeout(() => document.getElementById("chest")?.classList.add("open"), 150);
}
function go(view) { ui.view = view; ui.modal = null; render({ scroll: true }); }

function burst(n = 70) {
  if (reduceMotion() || !fx) return;
  const cols = ["#ffc83d", "#ff6b5e", "#34d399", "#2f80ed", "#7a5cff", "#ff8fc1"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span"); s.className = "confetti";
    s.style.cssText = `--x:${Math.random() * 100}vw;--c:${cols[i % cols.length]};--d:${1.8 + Math.random() * 1.6}s;--r:${Math.random() * 720 - 360}deg;--w:${6 + Math.random() * 8}px;animation-delay:${Math.random() * 0.4}s`;
    fx.appendChild(s); setTimeout(() => s.remove(), 4200);
  }
}
function toast(msg) { const el = document.getElementById("toast"); if (!el) return; el.innerHTML = msg; el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }

/* ---------- actions (single delegated handler) ---------- */
function startRegion(r) {
  const st = G.regionStatus(state, r);
  if (st === "locked") { toast(`🔒 Selesaikan <b>${G.REGIONS[r - 1].name}</b> dulu untuk membuka <b>${G.REGIONS[r].name}</b>.`); sfx("tap", state.sound); return; }
  if (st === "completed") { ui.review = { scope: "region", region: r, back: "map", filter: "all" }; go("review"); return; }
  ui.region = r; ui.qi = G.nextQuestionIndex(state, r); sfx("tap", state.sound); go("quiz");
}
const actions = {
  goWelcome: () => go("welcome"),
  goProfile: () => { ui.draftAvatar = state.avatar; go("profile"); },
  goMap: () => { sfx("tap", state.sound); go("map"); },
  avatar: (el) => { ui.draftAvatar = el.dataset.v; root.querySelectorAll(".avatar").forEach((b) => { const on = b.dataset.v === ui.draftAvatar; b.classList.toggle("chosen", on); b.setAttribute("aria-pressed", on); }); sfx("tap", state.sound); },
  sound: () => { setState({ ...state, sound: !state.sound }); root.querySelectorAll('[data-action="sound"]').forEach((b) => { b.outerHTML = soundBtn(); }); sfx("tap", state.sound); },
  region: (el) => startRegion(Number(el.dataset.r)),
  answer: (el) => {
    if (ui.view !== "quiz") return;
    const res = G.answerQuestion(state, ui.region, ui.qi, Number(el.dataset.c));
    if (!res.accepted) return; // duplicate / invalid click: ignored, score untouched
    setState(res.state); sfx(res.correct ? "correct" : "wrong", state.sound); render();
    document.getElementById("score")?.classList.add("bump");
    root.querySelector(".feedback")?.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
    if (res.correct) burst(22);
  },
  next: () => {
    if (!state.answers[G.qOf(ui.region, ui.qi).id]) return;
    if (ui.qi < G.PER_REGION - 1) { ui.qi++; render({ scroll: true }); }
    else { sfx("reward", state.sound); go("reward"); burst(110); }
  },
  review: (el) => { ui.review = { scope: el.dataset.scope, region: Number(el.dataset.region || 0), back: el.dataset.back || "map", filter: "all" }; go("review"); },
  reviewBack: () => go(ui.review.back === "reward" ? "reward" : ui.review.back === "final" ? "final" : "map"),
  filter: (el) => { ui.review.filter = el.dataset.f; render(); },
  final: () => { if (!G.overall(state).complete) { go("map"); return; } sfx("reward", state.sound); go("final"); burst(140); },
  restart: () => { ui.modal = "restart"; render(); },
  closeModal: () => { ui.modal = null; render(); },
  confirmRestart: () => { setState(G.resetProgress(state)); ui.modal = null; ui.region = 0; ui.qi = 0; go(state.name ? "map" : "welcome"); },
};
root.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || !root.contains(el)) return;
  if (el.hasAttribute("data-backdrop") && e.target !== el) return;
  unlockAudio();
  const fn = actions[el.dataset.action];
  if (fn) fn(el, e);
});
root.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.dataset.form !== "profile") return;
  const input = e.target.querySelector("#nick"), name = input.value.replace(/\s+/g, " ").trim().slice(0, G.NAME_MAX);
  if (!name) { root.querySelector("#nickErr").textContent = "Tulis nama panggilanmu dulu ya."; input.focus(); return; }
  setState({ ...state, name, avatar: ui.draftAvatar || state.avatar }); sfx("tap", state.sound); go("map");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ui.modal) { actions.closeModal(); return; }
  if (ui.view !== "quiz" || ui.modal || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.key.length !== 1) return;
  const k = e.key.toUpperCase(), idx = "1234".includes(k) ? Number(k) - 1 : LETTERS.indexOf(k);
  if (idx >= 0 && idx < 4) { const b = root.querySelector(`[data-action="answer"][data-c="${idx}"]`); if (b && !b.disabled) b.click(); }
});
if (portrait.addEventListener) portrait.addEventListener("change", () => { if (ui.view === "map") render(); });

/* ---------- service worker: network-first, auto-reload on update ---------- */
if ("serviceWorker" in navigator) {
  const hadController = !!navigator.serviceWorker.controller; let reloaded = false;
  navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then((reg) => reg.update && reg.update()).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (!hadController || reloaded) return; reloaded = true; location.reload(); });
}

window.__treasureQuiz = { get state() { return state; }, ui, played, G };
render();
