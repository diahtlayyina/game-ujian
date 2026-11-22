# Technical architecture (proposed)

## Stack
- Vite + vanilla JavaScript (ES modules) for a lightweight browser game
- Firebase JavaScript SDK
- Firebase Authentication: anonymous/guest first; Google sign-in optional
- Cloud Firestore: player profile, game sessions, progress, leaderboard data
- Firebase Hosting: HTTPS static web hosting
- GitHub: version control, documentation, issue tracking

## Stage strategy
1. Build the game loop offline/local first, with no Firebase dependency.
2. Keep content and game logic separate from rendering.
3. Introduce Firebase behind small service modules after prototype behavior stabilizes.
4. Use Firebase Emulator Suite to test Authentication, Firestore, and Rules locally.
5. Deploy only after Rules and score validation are reviewed.

## Suggested modules
- `src/main.js`: app entry point
- `src/ui/`: screen rendering, components, transitions
- `src/game/`: state, scoring, progression, answer evaluation
- `src/data/`: question packs and region metadata
- `src/audio/`: sound manager and mute preference
- `src/services/firebase.js`: Firebase initialization
- `src/services/auth.js`: guest/Google sign-in flows
- `src/services/progress.js`: progress/session persistence
- `src/services/leaderboard.js`: ranking queries (later)

## Data model (draft; revise before rules)
- `users/{uid}`: nickname, avatarId, createdAt, privacy settings (minimal)
- `gamePacks/{packId}`: metadata; question bank should be versioned/static or carefully controlled
- `sessions/{sessionId}`: uid, packId, questionPackVersion, score, accuracy, completion status, timestamps; avoid copying sensitive profile data
- `progress/{uid_packId}`: unlocked regions, best scores, collected rewards, updatedAt
- leaderboard: prefer server-validated aggregates or a callable backend; never accept arbitrary score totals from client writes


## Security and privacy
- Firestore rules deny access by default and grant only necessary permissions.
- Validate user ownership (`request.auth.uid`) for private profile/progress.
- Avoid collecting student full names, emails for display, birth dates, or location.
- Public leaderboard uses nickname and a safe score record only.
- Scores and rank must be server-validated (Cloud Functions or other trusted process) before they become leaderboard entries.
- Test rules with Emulator Suite; do not use Firestore test mode in public deployment.
- Firebase web config is not a server secret; never commit service-account keys or private credentials.

## Environment and secrets
- Use local `.env` for build-time configuration; commit `.env.example` with placeholders only.
- Ensure `.env`, credentials, service-account JSON, and student data are ignored.
- Do not paste credentials into chat or commit them to GitHub.
