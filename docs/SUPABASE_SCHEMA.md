# Treasure Quiz — Supabase schema

Migration applied: `treasure_quiz_initial_schema` on 2026-11-22.

## Tables
- `players`: id (uuid), nickname (1–24 chars), avatar, created_at.
- `game_sessions`: id, player_id, game_code, total_score, xp, completed_regions (0–5), completed_at, created_at.
- `question_attempts`: id, session_id, question_code, is_correct, points_awarded, answered_at.

## Security posture
Row Level Security is enabled on all tables. No client policies are defined yet, so access is intentionally restricted. Do not add public write policies for scores until score validation is handled by a trusted server-side function/backend. Supabase service-role credentials must never be shipped to the browser.

## Notes
Database types were generated after migration. The security advisor's no-policy notice is expected at this stage because access is deliberately closed.
