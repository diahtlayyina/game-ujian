# Treasure Quiz — The Lost Treasure of Knowledge

Petualangan kuis Bahasa Indonesia untuk siswa kelas 4 (9–10 tahun). Pemain menjelajahi peta bergambar dengan
lima wilayah, menjawab 35 pertanyaan (7 per wilayah), mengumpulkan poin dan hadiah, lalu menemukan harta karun terakhir.

Live: https://game-ujian.vercel.app

## Run locally
Plain static site (no build step). Serve the folder with any static server, e.g. `python3 -m http.server 8123`,
then open http://127.0.0.1:8123/ . (ES modules need a server; opening `index.html` as a file will not work.)

## Structure
- `index.html`, `styles.css` — shell and theme
- `src/main.js` — screens + event handling (single delegated click handler)
- `src/game.js` — pure game logic: scoring, unlocks, validation/repair of saved data (no DOM)
- `src/questions.js` — the 35-question bank (not modified by the rebuild)
- `src/art.js`, `src/audio.js` — inline SVG illustrations and WebAudio sound effects
- `sw.js` — network-first service worker (new deployments are always picked up when online)
- `tests/logic.test.mjs` — `node tests/logic.test.mjs`
- `tests/e2e.py` — Playwright browser suite: `BASE_URL=<url> python3 tests/e2e.py`

## Scoring
100 points per correct answer, 35 questions, 3,500 maximum. Progress is derived from one record of answers
(`answers[questionId] = {choice}`), so points are awarded exactly once and unlocks can never get out of sync.

## Privacy
Nickname + emoji avatar only, stored in the browser's localStorage. No accounts, no network calls for data.

See `docs/IMPLEMENTATION_STATE.md` for current status, test results and limitations.
