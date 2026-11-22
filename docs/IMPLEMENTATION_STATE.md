# Implementation state / handoff checkpoint

Updated: 2026-11-22

## Prototype
Treasure Quiz v0.1 is in GitHub main:
- https://github.com/diahtlayyina/game-ujian
- Opening/profile/map, first region playable with 7 provisional questions, feedback, sound toggle, score, local progress, results/review/reset.
- Runtime/browser QA is still pending.

## Supabase
- Project ref: qfccpriurdvjacqvzovu (ACTIVE_HEALTHY)
- Schema migration `treasure_quiz_initial_schema` applied.
- Tables: `players`, `game_sessions`, `question_attempts`.
- RLS enabled, no public policies intentionally yet.
- Migration `index_game_sessions_player_id` applied to index FK `game_sessions.player_id`.
- Database TypeScript types generated.
- Security advisor's no-policy findings are expected until safe backend access is implemented. No service-role keys in browser.

## Vercel
- User manually created project and shared dashboard URL: https://vercel.com/diah-layyina/game-ujian
- Attempted to inspect via connected Vercel MCP, but API returned 404 Project not found in currently scoped team context. Listing projects in the team context returned 0.
- Do not create another project. Need resolve correct Vercel account/team scope or project identifier/connection before inspecting or deploying.
- Deployment URL/status has not been verified.

## Important caveat
Questions in `src/questions.js` are provisional examples, not checked against the source assessment. Do not use for formal assessment before verification.

## Next steps
1. Resolve Vercel scope/project visibility for the existing project (dashboard link provided by user).
2. Deploy/confirm preview and run browser QA.
3. Verify original exam questions and answer keys.
4. Implement trusted score persistence/server-side validation before public leaderboard.
5. Add login only after guest gameplay and backend persistence are stable.
