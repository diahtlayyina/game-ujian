# Lightweight technical architecture

## Stack (current decision)
- Plain HTML, CSS, and JavaScript (ES modules); no framework for the first prototype
- GitHub repository for code and static question packs
- Vercel Hobby for deployment (check plan restrictions, especially personal/non-commercial use)
- Supabase Free as an optional backend: Auth + PostgreSQL + APIs

## Stages
1. Build an entirely static/local prototype. The game must run without a database.
2. Guest identity and progress initially live in browser localStorage; clearly explain that this is browser/device-local and can be lost.
3. If cross-device progress and rankings are wanted, integrate Supabase Auth and database tables.
4. Use Supabase Row Level Security; never expose service-role keys in client code.
5. Deploy through Vercel connected to GitHub; preview deployments for changes and production deployment from main.

## Suggested file structure
- `index.html`: app shell
- `css/styles.css`: visual styling and responsive rules
- `js/main.js`: routing/screen coordination
- `js/game-state.js`: state and progression
- `js/questions.js` or `data/questions.json`: content pack
- `js/scoring.js`: answer evaluation and points
- `js/audio.js`: sound controls
- `js/storage.js`: localStorage persistence
- `js/ui/`: reusable rendering modules, only as needed
- `supabase/`: SQL schema and policies, introduced in backend phase

## Future Supabase tables (draft)
- `profiles`: user ID, nickname, avatar, created_at (minimal data)
- `game_sessions`: user_id, pack_id/version, score, answer summary, timestamps
- `player_progress`: user_id, pack_id, unlocked levels, rewards, best score
- `leaderboard_view` or validated score table: nickname and safe aggregate only

## Authentication
- MVP: guest/nickname only, local storage
- Later: Supabase Auth (email/password or supported OAuth) optional
- Avoid collecting children's email addresses where possible. Follow school and parent privacy requirements before accounts or public rankings.

## Score integrity
Client-only game scores are easy to modify; local prototype scores are for personal practice only. For a public leaderboard, score submissions must be validated through trusted server-side logic or carefully designed database policies. Never let clients write arbitrary ranking totals.

## Security
- Supabase anon/publishable key may be used client-side only with RLS policies enabled and tested.
- Never commit service-role key, private keys, passwords, `.env` secrets, or student records.
- Public GitHub should contain only safe code, docs, and content cleared for public use.
- Test policies before deploying.
