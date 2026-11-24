// Pure game logic (no DOM). Everything is derived from one record: state.answers.
// This makes scoring exactly-once and progress impossible to desynchronise.
import { questions } from "./questions.js";

export const PER_REGION = 7;
export const POINTS = 100;
export const TOTAL = questions.length;
export const MAX_SCORE = TOTAL * POINTS;
export const NAME_MAX = 14;
export const AVATARS = ["🦊", "🐼", "🐯", "🐰", "🐨", "🦄", "🐙", "🦉"];
export const REGIONS = [
  { name: "Grammar Village", icon: "🏡", reward: "Bronze Key", rewardIcon: "🗝️", blurb: "Kata, kalimat, dan paragraf" },
  { name: "Enchanted Forest", icon: "🌲", reward: "Forest Gem", rewardIcon: "💚", blurb: "Majas, imbuhan, dan ide pokok" },
  { name: "Crystal River", icon: "🌊", reward: "Crystal Key", rewardIcon: "🔑", blurb: "Keterangan, jenis teks, dan imbuhan" },
  { name: "Wisdom Mountain", icon: "⛰️", reward: "Golden Compass", rewardIcon: "🧭", blurb: "Ide pokok, persuasi, dan paragraf" },
  { name: "Treasure Castle", icon: "🏰", reward: "Legendary Treasure", rewardIcon: "👑", blurb: "Tantangan terakhir!" },
];
export const DATA_OK = questions.length === REGIONS.length * PER_REGION;

const byId = new Map(questions.map((q) => [q.id, q]));
export const qOf = (r, i) => questions[r * PER_REGION + i];
export const numberOf = (q) => questions.indexOf(q) + 1;

export const emptyState = () => ({ v: 3, name: "", avatar: AVATARS[0], sound: true, answers: {} });

/** Validate + repair any stored value (never trusts it). */
export function sanitize(raw) {
  const s = emptyState();
  if (!raw || typeof raw !== "object") return s;
  if (typeof raw.name === "string") s.name = raw.name.replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
  if (AVATARS.includes(raw.avatar)) s.avatar = raw.avatar;
  if (typeof raw.sound === "boolean") s.sound = raw.sound;
  const src = raw.answers && typeof raw.answers === "object" ? raw.answers : {};
  const tmp = {};
  for (const [k, v] of Object.entries(src)) {
    const q = byId.get(Number(k));
    if (q && v && Number.isInteger(v.choice) && v.choice >= 0 && v.choice < q.opts.length) tmp[q.id] = { choice: v.choice };
  }
  // Keep only a consistent prefix: questions in order, regions in order.
  let open = true;
  for (let r = 0; r < REGIONS.length; r++) {
    let gap = !open, n = 0;
    for (let i = 0; i < PER_REGION; i++) {
      const q = qOf(r, i);
      if (!gap && tmp[q.id]) { s.answers[q.id] = tmp[q.id]; n++; } else gap = true;
    }
    if (n < PER_REGION) open = false;
  }
  return s;
}

/** Convert the old v0.2 save (attempts per region) into the new model. */
export function migrateLegacy(old) {
  const out = { name: old && old.name, avatar: old && old.avatar, answers: {} };
  const at = old && old.attempts;
  if (at && typeof at === "object")
    for (const list of Object.values(at))
      if (Array.isArray(list)) for (const it of list) if (it && Number.isInteger(it.id) && Number.isInteger(it.choice)) out.answers[it.id] = { choice: it.choice };
  return out;
}

export function regionStats(s, r) {
  let answered = 0, correct = 0;
  for (let i = 0; i < PER_REGION; i++) {
    const q = qOf(r, i), a = s.answers[q.id];
    if (a) { answered++; if (a.choice === q.answer) correct++; }
  }
  return { answered, correct, complete: answered === PER_REGION, score: correct * POINTS };
}
export function regionStatus(s, r) {
  if (regionStats(s, r).complete) return "completed";
  if (r === 0 || regionStats(s, r - 1).complete) return "available";
  return "locked";
}
export function nextQuestionIndex(s, r) {
  for (let i = 0; i < PER_REGION; i++) if (!s.answers[qOf(r, i).id]) return i;
  return PER_REGION;
}
export function overall(s) {
  let answered = 0, correct = 0, regionsDone = 0;
  for (let r = 0; r < REGIONS.length; r++) {
    const st = regionStats(s, r);
    answered += st.answered; correct += st.correct; if (st.complete) regionsDone++;
  }
  return { answered, correct, score: correct * POINTS, regionsDone, percent: Math.round((correct / TOTAL) * 100), complete: answered === TOTAL };
}
export const currentRegion = (s) => { for (let r = 0; r < REGIONS.length; r++) if (regionStatus(s, r) === "available") return r; return REGIONS.length - 1; };

/** The only way to record an answer. Rejects duplicates, locked regions and out-of-order answers. */
export function answerQuestion(s, r, i, choice) {
  const rej = (reason) => ({ accepted: false, reason, state: s });
  if (!Number.isInteger(r) || r < 0 || r >= REGIONS.length || !Number.isInteger(i) || i < 0 || i >= PER_REGION) return rej("range");
  const q = qOf(r, i);
  if (!Number.isInteger(choice) || choice < 0 || choice >= q.opts.length) return rej("choice");
  if (regionStatus(s, r) === "locked") return rej("locked");
  if (s.answers[q.id]) return rej("already");
  if (i !== nextQuestionIndex(s, r)) return rej("order");
  const correct = choice === q.answer;
  return { accepted: true, correct, points: correct ? POINTS : 0, state: { ...s, answers: { ...s.answers, [q.id]: { choice } } } };
}
export const resetProgress = (s) => ({ ...s, answers: {} });

export function rank(percent) {
  if (percent >= 90) return { title: "Penjelajah Legendaris", text: "Luar biasa! Hampir semua jawabanmu benar." };
  if (percent >= 70) return { title: "Petualang Hebat", text: "Hebat sekali! Kamu menguasai banyak hal." };
  if (percent >= 50) return { title: "Penjelajah Tangguh", text: "Kerja bagus! Sedikit latihan lagi, kamu makin jago." };
  return { title: "Penjelajah Pemberani", text: "Kamu berhasil sampai akhir! Review jawabanmu supaya makin jago." };
}
