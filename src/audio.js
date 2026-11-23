// Tiny WebAudio sound effects. No audio files, nothing to load.
let ctx = null;
export const played = []; // debug/test hook: names of effects that actually played
const PATTERNS = {
  tap: [[520, 0, 0.08]],
  correct: [[523, 0, 0.14], [659, 0.1, 0.14], [784, 0.2, 0.2], [1047, 0.32, 0.32]],
  wrong: [[330, 0, 0.18, "sine"], [262, 0.16, 0.3, "sine"]],
  reward: [[523, 0, 0.15], [659, 0.13, 0.15], [784, 0.26, 0.15], [1047, 0.4, 0.2], [784, 0.56, 0.12], [1047, 0.66, 0.12], [1319, 0.8, 0.55]],
};
export function unlockAudio() {
  try {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; ctx = new C(); }
    if (ctx.state === "suspended") ctx.resume();
  } catch (e) { /* audio is optional */ }
}
function tone(freq, t0, dur, type = "triangle", vol = 0.11) {
  const now = ctx.currentTime + t0, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(vol, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + dur + 0.05);
}
export function sfx(name, enabled) {
  if (!enabled) return;
  played.push(name);
  try { unlockAudio(); if (ctx) (PATTERNS[name] || []).forEach((p) => tone(p[0], p[1], p[2], p[3])); } catch (e) { /* ignore */ }
}
