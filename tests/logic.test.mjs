// Run: node tests/logic.test.mjs
import assert from "node:assert/strict";
import { questions } from "../src/questions.js";
import * as G from "../src/game.js";

let n = 0;
const t = (name, fn) => { fn(); n++; console.log("ok -", name); };

t("question bank integrity (35 = 5 x 7, unique ids, 4 options, valid key, explanation)", () => {
  assert.equal(questions.length, 35);
  assert.equal(G.DATA_OK, true);
  assert.equal(new Set(questions.map((q) => q.id)).size, 35);
  for (const q of questions) {
    assert.equal(q.opts.length, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.ok(q.q && q.why);
  }
  assert.equal(G.MAX_SCORE, 3500);
});

t("fresh state: only region 1 is available", () => {
  const s = G.emptyState();
  assert.deepEqual([0, 1, 2, 3, 4].map((r) => G.regionStatus(s, r)), ["available", "locked", "locked", "locked", "locked"]);
});

t("points awarded exactly once; duplicate answers rejected", () => {
  let s = G.emptyState();
  const q = G.qOf(0, 0);
  const a = G.answerQuestion(s, 0, 0, q.answer);
  assert.ok(a.accepted && a.correct && a.points === 100);
  s = a.state;
  for (let k = 0; k < 10; k++) { const d = G.answerQuestion(s, 0, 0, q.answer); assert.equal(d.accepted, false); assert.equal(d.reason, "already"); s = d.state; }
  assert.equal(G.overall(s).score, 100);
});

t("wrong answer scores 0 and still counts as answered", () => {
  const q = G.qOf(0, 0);
  const wrong = (q.answer + 1) % 4;
  const a = G.answerQuestion(G.emptyState(), 0, 0, wrong);
  assert.ok(a.accepted && !a.correct && a.points === 0);
  assert.equal(G.overall(a.state).score, 0);
  assert.equal(G.regionStats(a.state, 0).answered, 1);
});

t("cannot skip ahead, answer in a locked region, or use bad input", () => {
  const s = G.emptyState();
  assert.equal(G.answerQuestion(s, 0, 3, 0).reason, "order");
  assert.equal(G.answerQuestion(s, 1, 0, 0).reason, "locked");
  assert.equal(G.answerQuestion(s, 0, 0, 9).reason, "choice");
  assert.equal(G.answerQuestion(s, 0, 0, "1").reason, "choice");
  assert.equal(G.answerQuestion(s, 9, 0, 0).reason, "range");
});

const playAll = (s, upToRegion = 5, correct = true) => {
  for (let r = 0; r < upToRegion; r++) for (let i = 0; i < 7; i++) {
    const q = G.qOf(r, i); s = G.answerQuestion(s, r, i, correct ? q.answer : (q.answer + 1) % 4).state;
  }
  return s;
};

t("completing region 1 unlocks region 2 only", () => {
  const s = playAll(G.emptyState(), 1);
  assert.deepEqual([0, 1, 2, 3, 4].map((r) => G.regionStatus(s, r)), ["completed", "available", "locked", "locked", "locked"]);
  assert.equal(G.overall(s).score, 700);
  assert.equal(G.currentRegion(s), 1);
});

t("perfect game = 3500, all complete, wrong game = 0 but still complete", () => {
  const perfect = G.overall(playAll(G.emptyState()));
  assert.equal(perfect.score, 3500); assert.ok(perfect.complete); assert.equal(perfect.percent, 100);
  const worst = G.overall(playAll(G.emptyState(), 5, false));
  assert.equal(worst.score, 0); assert.ok(worst.complete);
});

t("restart clears answers, keeps profile", () => {
  const s = { ...playAll(G.emptyState()), name: "Dina", avatar: "🐼" };
  const r = G.resetProgress(s);
  assert.deepEqual(r.answers, {}); assert.equal(r.name, "Dina"); assert.equal(r.avatar, "🐼");
  assert.equal(G.regionStatus(r, 0), "available");
});

t("REGRESSION: stale/inconsistent saves can never lock or blank Grammar Village", () => {
  // These are the exact shapes that broke the live site (v0.2 save format).
  const bad = [
    { completedRegions: [0], attempts: {}, name: "Tes" },
    { completedRegions: [1], attempts: {}, name: "Tes" },
    { completedRegions: [0, 1, 2, 3, 4], attempts: {}, name: "Tes", totalScore: 3500 },
    { completedRegions: [0, 0], totalScore: 700, regionScores: { 0: 700 }, attempts: {} },
    null, undefined, "garbage", 42, [], { answers: "nope" }, { answers: { 1: { choice: 99 }, 2: null, x: { choice: 1 } } },
  ];
  for (const raw of bad) {
    const s = G.sanitize(G.migrateLegacy(raw)); const s2 = G.sanitize(raw);
    for (const st of [s, s2]) {
      assert.equal(G.regionStatus(st, 0), "available", JSON.stringify(raw));
      assert.equal(G.overall(st).score, 0);
    }
  }
});

t("sanitize repairs: drops gaps, drops answers past an incomplete region, ignores bad choices", () => {
  const a = {};
  for (let i = 0; i < 7; i++) a[G.qOf(0, i).id] = { choice: 0 };      // region 1 complete
  a[G.qOf(1, 0).id] = { choice: 1 };                                   // region 2 q1 ok
  a[G.qOf(1, 2).id] = { choice: 1 };                                   // gap (q2 missing) -> dropped
  a[G.qOf(2, 0).id] = { choice: 1 };                                   // region 3 while region 2 incomplete -> dropped
  const s = G.sanitize({ name: "  Budi   Kecil  ", avatar: "💩", sound: "yes", answers: a });
  assert.equal(s.name, "Budi Kecil"); assert.equal(s.avatar, G.AVATARS[0]); assert.equal(s.sound, true);
  assert.equal(G.regionStats(s, 0).answered, 7);
  assert.equal(G.regionStats(s, 1).answered, 1);
  assert.equal(G.regionStats(s, 2).answered, 0);
  assert.equal(G.nextQuestionIndex(s, 1), 1);
});

t("legacy v0.2 attempts migrate into answers (progress is repaired, not deleted)", () => {
  const q = (i) => G.qOf(0, i);
  const old = { name: "Sari", avatar: "🐼", completedRegions: [0], attempts: { 0: [0, 1, 2, 3, 4, 5, 6].map((i) => ({ id: q(i).id, choice: q(i).answer, ok: true })) } };
  const s = G.sanitize(G.migrateLegacy(old));
  assert.equal(s.name, "Sari"); assert.equal(G.regionStatus(s, 0), "completed"); assert.equal(G.overall(s).score, 700);
});

t("name length and avatar whitelist are enforced (privacy / safety)", () => {
  const s = G.sanitize({ name: "x".repeat(200), avatar: "<img>" });
  assert.equal(s.name.length, G.NAME_MAX); assert.equal(s.avatar, G.AVATARS[0]);
});

t("rank thresholds", () => {
  assert.equal(G.rank(100).title, "Penjelajah Legendaris"); assert.equal(G.rank(70).title, "Petualang Hebat");
  assert.equal(G.rank(50).title, "Penjelajah Tangguh"); assert.equal(G.rank(0).title, "Penjelajah Pemberani");
});

console.log(`\n${n} logic tests passed`);
