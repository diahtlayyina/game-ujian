# Implementation state / handoff checkpoint

Updated: 2026-11-22

## Phase
Phase 1 prototype started. Static frontend files are committed; gameplay is implemented in a first playable prototype.

## Verified repository
- GitHub repo: diahtlayyina/game-ujian
- URL: https://github.com/diahtlayyina/game-ujian
- Default branch: main
- Public repository
- GitHub connection active during development

## Stack
Plain HTML/CSS/JavaScript modules; GitHub; Vercel hosting (connection not yet confirmed in current Composio session); optional Supabase (connection not yet confirmed in current Composio session).

## Prototype v0.1
- Start screen, nickname/avatar setup, five-region map.
- Grammar Village has 7 playable provisional questions.
- Single-select choices, immediate feedback/explanation, score (100 per correct), generated sound toggle.
- Browser localStorage progress and basic reset.
- Result page and answer review.
- No authentication, remote database, leaderboard, or analytics.

## Content caveat
Questions in src/questions.js are authored sample items and are NOT verified against the original exam bank. Review the source question wording, answer keys and explanations before classroom use.

## Known limitations / next
1. Review and replace provisional questions with source-verified items.
2. Improve UX: map re-entry, progress tracking/stars, keyboard/accessibility and mobile QA.
3. Verify game behavior in browsers and deploy to Vercel.
4. Confirm Vercel and Supabase connections before using them.
5. Add online leaderboard only after database schema, security/RLS and server-side score validation are designed.
6. Supabase must not expose service-role keys in browser or GitHub.

## Prototype code
- index.html
- styles.css
- src/main.js
- src/questions.js
