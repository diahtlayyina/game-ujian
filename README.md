# Game Ujian

**Treasure Quiz — The Lost Treasure of Knowledge** is a browser-based educational quiz adventure for Grade 4 students. The first release turns exam questions into an approachable treasure-hunt game, with optional player identity, progress, rewards, and a leaderboard planned for later phases.

## Project status
- Phase: Planning / Firebase setup
- Gameplay prototype: not started
- Firebase backend: not configured yet
- Deployment: not started

## Start here
- [Blueprint](docs/BLUEPRINT.md)
- [Roadmap](docs/ROADMAP.md)
- [Features](docs/FEATURES.md)
- [Gameplay rules](docs/GAME_RULES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Firebase setup](docs/FIREBASE_SETUP.md)
- [Implementation state](docs/IMPLEMENTATION_STATE.md) — handoff checkpoint; update after every significant change
- [Decision log](docs/DECISIONS.md)

## Principles
1. Student-friendly, clear, and playful without being babyish.
2. Responsive on phone, tablet, and laptop; no app installation.
3. Guest play must remain available; Google sign-in is optional.
4. Feedback teaches: incorrect answers receive supportive explanation, not harsh punishment.
5. Collect minimal personal data. Never show emails or full names on public leaderboard.
6. Never deploy a public build with open Firestore rules or unreviewed score writes.
7. Keep the question bank separate from presentation so future subjects can reuse the engine.

## Proposed stack
Vanilla JavaScript (ES modules) with Vite, Firebase Authentication, Cloud Firestore, Firebase Hosting, and GitHub. Start with a frontend-only prototype before integrating cloud services.

## Development
Commands and Firebase config will be added when the prototype scaffolding is committed. Do not put service account credentials, private keys, or student personal data in GitHub. Firebase web config is client config, but security comes from Firebase Security Rules and server-side validation—not from hiding config.
