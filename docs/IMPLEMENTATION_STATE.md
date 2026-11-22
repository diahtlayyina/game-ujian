# Implementation state / handoff checkpoint

Update this document after each meaningful session. New AI/developer should read README, this file, and relevant docs before continuing. Record verified facts only.

## Last updated
2026-11-22

## Current phase
Phase 0 setup / Phase 1 content blueprint. No application code yet.

## Verified facts
- GitHub repository: `diahtlayyina/game-ujian`
- URL: https://github.com/diahtlayyina/game-ujian
- Default branch: `main`
- Repository is public (confirmed)
- Firebase project `Game Ujian` exists and Authentication is enabled (user-reported, not independently verified)
- Current technical direction: plain HTML/CSS/JS, GitHub, Vercel Hobby, optional Supabase Free
- Firebase is no longer required for MVP
- Exam source previously accessed: `ASAS Bahasa Indonesia Kls 4.docx.pdf`; verify exact text, answer keys, and explanations before game implementation

## Completed
- [x] Initial project docs committed
- [x] Simplified stack decision documented
- [x] Vercel and optional Supabase plan documented
- [x] Login removed from MVP

## Next actions
1. Verify all source questions, answer keys, and explanations
2. Categorize by topic/difficulty/type
3. Balance questions across five regions
4. Finalize game scoring/rewards and interaction rules
5. Build static frontend prototype
6. Connect repo to Vercel and test deployment
7. Add Supabase only if account/cloud save/leaderboard are needed

## Not implemented
- Game UI and gameplay
- Question pack verification
- Audio and rewards
- Local save logic
- Vercel deployment
- Supabase Auth/database
- Leaderboard
- Tests

## Handoff notes
- Start from this file and README.
- Do not assume Firebase is configured or use it in code unless decision changes.
- Guest nickname/local save is the first implementation target.
- Never put passwords, service keys, or student PII in repository.
- Update this file with changed files, tests, commits, and blockers after every session.
