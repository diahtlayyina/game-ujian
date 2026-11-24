# Implementation State / Handoff

Updated: 2026-11-24 (rebuild v3)

## Status: playable, deployed, browser-tested — with the limitations listed below
**Treasure Quiz — The Lost Treasure of Knowledge** is a static browser game (plain HTML/CSS/ES modules, no build step) for Grade 4 students.
Production: https://game-ujian.vercel.app · Repo: https://github.com/diahtlayyina/game-ujian · Vercel project: https://vercel.com/diah-layyina/game-ujian

## Root causes of the reported breakage (reproduced in a real browser against the old live site)
1. **Invalid CSS.** `linear-gradient(180, …)` (missing `deg`) is dropped by browsers, so the sky/scene backgrounds computed to `none` and the app looked like an unstyled skeleton.
2. **Fragile saved progress.** Progress was stored as separate `completedRegions` / `totalScore` / `attempts` values. With stale or inconsistent saved data, Grammar Village either opened a **blank review screen with zero questions** (region marked done but no attempts) or became **locked** (out-of-order completion). Reproduced with four saved-state shapes. On a clean profile the old click did work, which is why it looked random.
3. **Cache-first service worker** that never revalidated and answered failed JS/CSS requests with `index.html`.
4. Scoring was applied only when a region finished, so state was inconsistent mid-region; a legacy duplicate `src_main.js` also existed (removed; `index.html` always loaded `src/main.js`).

## What was built
- `src/game.js` — pure logic. One record (`answers`) drives score, status, unlocks, resume. `answerQuestion` rejects duplicates, locked regions, out-of-order and invalid input. `sanitize` repairs any stored data; `migrateLegacy` converts the old v0.2 save.
- `src/main.js` — all screens (welcome, profile, illustrated map, quiz, region reward, review, final treasure, restart dialog) using one delegated click handler (no per-screen handler binding).
- `src/art.js` — hand-drawn inline SVG landmarks for the five regions and the treasure chest. `src/audio.js` — WebAudio effects (correct, wrong, tap, reward) with a persisted sound toggle.
- `styles.css` — bright storybook theme, large touch targets, responsive map (landscape and portrait layouts), reduced-motion support.
- `sw.js` — network-first, versioned cache; `vercel.json` serves `sw.js` with `no-cache`; the page reloads once when a new worker takes over. `index.html` has a "clean reload" safety net if the game fails to boot.
- `src/questions.js` — **unchanged** (35 questions, 7 per region, 100 points each, 3,500 maximum).

## Game rules as implemented
100 points per correct answer; wrong answers score 0 with encouraging feedback and the correct answer plus explanation. Region N+1 unlocks when region N has all 7 questions answered. Completed regions open a review (never blank). "Petualangan baru" clears answers but keeps nickname/avatar. Nickname max 14 chars, avatar from a fixed emoji list, no other personal data.

## Tests actually run
- `node tests/logic.test.mjs`: **13/13 passed** (data integrity, exactly-once scoring, ordering/locking, perfect = 3,500, restart, regression for the stale-save shapes, repair + legacy migration, input limits).
- `tests/e2e.py` (Playwright, Chromium): **68/68 passed** on a local server, on the Vercel preview for the branch, and on **production https://game-ujian.vercel.app**. Covers: landing/design applied, profile validation, map states, locked-region tap, **Grammar Village opens question 1**, wrong/correct feedback, correct answer + explanation, repeated/rapid clicks cannot inflate score, keyboard answers, reload + resume mid-region, all 7 questions, reward screen, unlock, region review + filter, sound toggle (no effects while muted), full 35-question playthrough with deliberate mistakes (final score 3,200/3,500 verified), final review of 35, restart (cancel / Escape / confirm), six stale/corrupt saved-data cases, legacy-save migration, mobile (375px) / tablet (768px) / desktop (1280px) overflow, node overlap and tap-target size, no console errors, service worker registered and network-first.
- Upgrade test (real old service worker → new deploy, same browser profile, local origin): **7/7 passed**. A returning user may see the old page **once** (the old worker serves it); the next load shows v3, the old cache is deleted, and progress is migrated with scores recomputed from answers.
- A real layout bug found by the suite (two map nodes touching at 375px) was fixed and retested.

## Deployment
- Production deploy of commit `ec55d84` (merge of branch `rebuild-v3`, Vercel deployment `dpl_4BGV3Dni7rDpDFU6xTCu7jMiqZSs`); verified live: v3 shell served, `sw.js` has `no-cache`, e2e 68/68. Existing Vercel project and repo were used; nothing new was created. Branch `rebuild-v3` is kept for reference. Docs-only commits after this redeploy the same code.
- `.github/workflows/validate.yml` now syntax-checks all modules and runs the logic tests.

## Remaining limitations / not verified (be honest)
- **Question bank is still unverified against the original source** (`ASAS Bahasa Indonesia Kls 4.docx.pdf`). Google Drive was not connected, so it could not be read. Note the blueprint describes Q16–25 as multiple-answer, Q26–30 short answer and Q31–35 essay, while the bank is 35 single-answer, four-option questions — treat this as a possible content discrepancy to resolve against the source. Content was not changed.
- **No human visual review by the developer.** Design quality was checked through computed styles and geometry (backgrounds applied, no overflow/overlap, tap targets), not by looking at screenshots. Please look at it on a real phone and tell me what to adjust.
- Browser coverage is Chromium only (no Safari/Firefox/real iOS/Android devices). Actual audio output was not audible-verified; the toggle and effect dispatch were.
- Progress is stored in the browser (localStorage) per device. No cloud save, accounts or leaderboard (Supabase intentionally not integrated).
- Fonts load from Google Fonts with a system fallback; they are not cached for offline use. Emoji avatars depend on the device's emoji font.
- `docs/ARCHITECTURE.md` still lists an older suggested file layout; the actual layout is in README.md.
