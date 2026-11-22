# Decision log

## 2026-11-22 — Lightweight static-first stack
**Decision:** Use plain HTML, CSS, and JavaScript for the first game; keep it static and browser-based.
**Reason:** Reduce complexity, cost, dependencies, and setup friction. The game should load from a URL without app installation.
**Status:** Accepted.

## 2026-11-22 — Hosting with Vercel Hobby
**Decision:** Use Vercel for initial deployment, subject to Hobby plan use restrictions and limits.
**Reason:** GitHub-connected deployment and simple static hosting.
**Status:** Accepted; setup pending.

## 2026-11-22 — Supabase optional, not required for prototype
**Decision:** Start with local guest state. Add Supabase Free only if cloud progress/accounts/leaderboard become necessary.
**Reason:** Avoid backend complexity in the first milestone.
**Status:** Accepted.

## 2026-11-22 — No login in MVP
**Decision:** Players can use nickname and optional avatar without an account. Account login may be added later.
**Reason:** Easier access for elementary students and less personal data collection.
**Status:** Accepted.

## 2026-11-22 — Guest play plus optional account (future)
**Decision:** Guest mode remains available; optional accounts can be added for persistent cloud progress.
**Reason:** Lower barrier to play.
**Status:** Accepted; future.

## 2026-11-22 — Public leaderboard privacy
**Decision:** Nickname only; no email or legal names.
**Reason:** Protect students' privacy.
**Status:** Accepted.

## 2026-11-22 — Score integrity
**Decision:** Cloud leaderboard scores must be validated by trusted server-side logic; client score writes are untrusted.
**Reason:** Prevent score manipulation.
**Status:** Accepted.

## 2026-11-22 — Five themed regions
**Decision:** Use five regions for progression.
**Reason:** Clear structure and reward milestones.
**Status:** Accepted; question mapping still draft.
