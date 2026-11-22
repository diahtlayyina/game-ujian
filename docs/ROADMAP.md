# Development Roadmap

## Phase 0 — Simplified setup (current)
- [x] GitHub repo and project docs
- [x] Simplify technology stack to static web first
- [ ] Confirm Vercel account/project connection
- [ ] Create Supabase project only if cloud save/login is needed

## Phase 1 — Content blueprint
- [ ] Re-verify all 35 source questions, keys, and explanations
- [ ] Categorize topic, difficulty, and interaction type
- [ ] Balance five regions and question progression
- [ ] Confirm scoring and rewards

## Phase 2 — Static frontend prototype
- [ ] Plain HTML/CSS/JS scaffold
- [ ] Start screen and nickname/avatar
- [ ] Treasure map and five region progression
- [ ] Single choice, multi-select, short answer, guided essay
- [ ] Immediate feedback and explanations
- [ ] Points, stars, streak, collectibles, progress
- [ ] Sound effects + mute
- [ ] Review incorrect answers and end summary
- [ ] Responsive/accessibility checks
- [ ] Local guest save via localStorage

## Phase 3 — GitHub and Vercel
- [ ] Commit prototype
- [ ] Connect GitHub repo to Vercel
- [ ] Deploy preview and test on multiple devices
- [ ] Public deployment review for exam content/privacy

## Phase 4 — Optional Supabase backend
- [ ] Create Free project
- [ ] Enable Auth only if accounts are useful
- [ ] Design schema for profiles, progress, sessions
- [ ] Implement Row Level Security and test policies
- [ ] Add account creation/sign-in and guest upgrade path if feasible
- [ ] Persist progress and score safely

## Phase 5 — Leaderboard
- [ ] Decide leaderboard scope and ranking criteria
- [ ] Nickname-only public display; no email/full name
- [ ] Trusted score validation before ranking
- [ ] Pagination, tie rules, opt-out/privacy review

## Phase 6 — Release
- [ ] Test browser compatibility and performance
- [ ] Privacy/security review
- [ ] Deploy final Vercel URL
- [ ] Pilot with small group and collect feedback

## Phase 7 — Later ideas
- [ ] Teacher dashboard and question-pack editor
- [ ] Other subjects/grades
- [ ] Class challenge
- [ ] Multiplayer only if core game remains lightweight

## MVP completion criteria
- Questions and keys verified against source
- Every question type works
- Feedback/explanations and retry are clear
- Score and progression consistent
- Sound can be muted
- Responsive and keyboard-friendly
- No unnecessary personal data
- Deployed URL works over HTTPS
