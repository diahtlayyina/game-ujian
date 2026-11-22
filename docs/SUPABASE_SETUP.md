# Supabase setup (optional backend)

Supabase is not needed for the first static prototype. Create a project only when we want accounts, cross-device progress, and a leaderboard. Free plan limits and pause policy can change; review official pricing before launch.

## Later setup
1. Go to https://supabase.com and create a project on the Free plan.
2. Choose a strong database password and keep it outside GitHub/chat.
3. Select a region after reviewing available locations and expected users.
4. Create Auth providers only if needed. Email/password is optional; do not force student accounts for gameplay.
5. Database schema and Row Level Security policies will be supplied after the game model is finalized. Do not create open tables or disable RLS for public access.
6. Use the public/publishable project key in frontend only with RLS policies enabled and tested. Never expose the service-role key.
7. Add project URL and publishable key to Vercel environment variables when integration is ready. Avoid committing `.env`.

## Free-plan notes (checked Nov 2026; verify before use)
Supabase Free currently lists a 500 MB database, 50,000 monthly active users, 1 GB storage, 5 GB egress, and two active free projects. Free projects may pause after one week of inactivity. It is a good prototype option but not a guaranteed permanent uptime service.

Official docs:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/billing-on-supabase
