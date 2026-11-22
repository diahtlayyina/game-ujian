# Implementation state / handoff checkpoint

> Update this file after every meaningful development session. A new ChatGPT conversation or another AI should read this file first, then README and the linked docs. Record actual state, not intended state.


## Last updated
2026-11-22

## Current phase
Phase 0 — Project and service setup / Phase 1 blueprint. No application code has been committed.

## Verified facts
- GitHub repository: `diahtlayyina/game-ujian`
- Repository URL: https://github.com/diahtlayyina/game-ujian
- Default branch: `main`
- Repository visibility: **public** (confirmed from repository metadata)
- Repo was empty before this documentation commit.
- Firebase project display name: `Game Ujian` (user-confirmed)
- Firebase Authentication is enabled (user-confirmed); Google provider status is not independently verified.
- Firebase connector previously returned permission denied for Identity Toolkit. This does not necessarily mean the user's Firebase Console setup is invalid; use the Firebase Console setup steps and don't assume connector access.
- Google Drive exam source previously read: `ASAS Bahasa Indonesia Kls 4.docx.pdf`; exact keys/explanations still need a fresh source-level verification before coding.

## Completed in this session
- [x] Project documentation structure and initial blueprint/roadmap/rules drafted
- [x] Firebase setup checklist added

## In progress / next
1. User completes Firebase Console setup checklist in `docs/FIREBASE_SETUP.md` and reports which items are done.
2. Verify source question text, answer keys, and explanations; map 35 questions into five balanced regions.
3. Finalize scoring and answer-evaluation rules.
4. Scaffold frontend-only prototype using Vite/vanilla JS; Firebase integration later.

## Not implemented yet
- Frontend game, sound, gameplay, map, scoring
- Firebase SDK/config in code
- Auth flows (guest/Google)
- Firestore schema/rules
- Leaderboard
- Hosting/deployment
- Tests/CI

## Decisions to revisit
- Google sign-in vs guest persistence and migration
- Whether anonymous Auth is required for guest cloud progress or guests remain local-only
- Exact score/stars/streak balancing
- Leaderboard scope and privacy
- Essay evaluation/self-check experience

## Handoff prompt
Read `README.md` and all `docs/*.md`, especially this file. Continue from the current phase; don't claim incomplete items are done. Keep this file updated, and append noteworthy technical decisions to `docs/DECISIONS.md`.
