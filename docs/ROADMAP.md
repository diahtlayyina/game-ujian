# Development Roadmap

## Phase 0 — Project and service setup (current)
- [x] Repository exists and is accessible
- [ ] Firebase project settings reviewed and web app registered
- [ ] Authentication provider decisions/configuration
- [ ] Firestore database created
- [ ] Rules drafted and tested (never launch with test mode)
- [ ] Hosting ready

## Phase 1 — Content and design blueprint
- [ ] Extract/verify all 35 source questions, keys, and explanations
- [ ] Classify content, difficulty, answer type, and points
- [ ] Balance five regions and their unlock/reward conditions
- [ ] Confirm scoring and interaction rules
- [ ] Wireframes for start, map, question, feedback, and summary

## Phase 2 — Frontend prototype (no backend)
- [ ] Scaffold Vite + vanilla JavaScript modules
- [ ] Start screen and player nickname
- [ ] Map with five regions and locked/unlocked state
- [ ] Question rendering and answer selection
- [ ] Multi-select confirmation
- [ ] Short-answer input and human-friendly normalization
- [ ] Supportive feedback and explanations
- [ ] Progress, points, streak, rewards, end screen
- [ ] Sound effects with mute toggle
- [ ] Responsive layout and accessibility pass
- [ ] Local test content and review-wrong-answers flow

## Phase 3 — GitHub collaboration and quality
- [ ] Commit app scaffold and documentation
- [ ] Add issue templates/checklist for bugs and features
- [ ] Add automated lint/build checks
- [ ] Keep project state updated in `docs/IMPLEMENTATION_STATE.md`

## Phase 4 — Firebase integration
- [ ] Add Firebase web SDK and environment configuration
- [ ] Anonymous/guest authentication (optional identity, avoid unnecessary PII)
- [ ] Google sign-in (optional, with consent and domain setup)
- [ ] Firestore user profile and session model
- [ ] Save progress and best score
- [ ] Security Rules and validation
- [ ] Test rules in Emulator Suite

## Phase 5 — Leaderboard
- [ ] Define ranking policy (best score, XP, or season)
- [ ] Nickname-only public display
- [ ] Server-side validation/controlled score writes; don't trust client-provided score fields
- [ ] Pagination and tie-break policy
- [ ] Abuse/privacy review

## Phase 6 — Deploy and pilot
- [ ] Firebase Hosting deployment
- [ ] Test on phone/tablet/laptop and supported browsers
- [ ] Accessibility, performance, and privacy checks
- [ ] Pilot with a small group; gather feedback
- [ ] Fix bugs before wider sharing

## Phase 7 — Post-MVP
- [ ] Teacher dashboard and question bank editor
- [ ] Class/session mode
- [ ] Additional subjects and reusable content packs
- [ ] Multiplayer/room challenge (only after core stability)
- [ ] Seasonal badges and achievements

## Definition of done for MVP
- All question types work and content is verified
- No dead-end navigation; restart/retry works
- Feedback is understandable and encouraging
- Score and progress are consistent
- Sound can be muted
- Responsive and keyboard-usable
- No personal data unnecessarily exposed
- Security rules are tested; no public score manipulation
- Deployment URL loads over HTTPS
