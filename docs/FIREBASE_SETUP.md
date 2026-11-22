# Firebase setup checklist — Game Ujian

Project: **Game Ujian**. Authentication is already enabled; the rest of this checklist is to be completed in Firebase Console. Menu names can shift slightly over time.

## A. Register the web app
1. Open Firebase Console and select project **Game Ujian**.
2. On Project Overview, click **Add app** / web icon (`</>`).
3. App nickname: `Game Ujian Web` (no need to enable Hosting from this wizard if we configure Hosting later).
4. Register app and copy the Firebase web configuration. Store it locally in `.env` when the code scaffold exists. Do not send it here or commit real `.env` values.
5. If an app already exists, use its web config instead of creating duplicates.

## B. Authentication providers
1. Build → Authentication → Sign-in method.
2. Keep **Anonymous** enabled (guest play; only enable if we decide guest cloud saves are needed).
3. Enable **Google**. Choose a public-facing project name and support email, then Save.
4. Authentication → Settings → Authorized domains: verify the local development domain and Hosting domain are listed. Add only domains we actually use.
5. Google sign-in is optional in the game. Use nickname for game display; never show the account email on leaderboard.

## C. Cloud Firestore
1. Build → Firestore Database → Create database.
2. Choose **Production mode** (not test mode) as the starting posture; we will deploy reviewed Rules before connecting the client.
3. Choose a database location near expected users. Location cannot easily be changed after creation; Indonesia-region availability may vary, so choose carefully based on available locations, latency, and data governance.
4. Create database.
5. Do not create collections manually yet; the app and schema plan will define them.
6. Do not publish or deploy with permissive rules. We will author and test Rules using Emulator Suite before enabling client writes.

## D. Firebase Hosting
Hosting can wait until the frontend prototype is ready.
1. Install Node.js LTS on the development computer.
2. Open a terminal in the project folder and install Firebase CLI: `npm install -g firebase-tools`.
3. Sign in: `firebase login`.
4. Initialize Hosting when the app scaffold is ready: `firebase init hosting`.
5. Select the **Game Ujian** project; choose the generated `dist` directory as the public folder for Vite.
6. For SPA behavior, configure the single-page rewrite if prompted; avoid overwriting the existing app files.
7. Test locally with `npm run build` and `firebase emulators:start` / Hosting emulator as configured.
8. Deploy only after checks pass: `firebase deploy --only hosting`.

## E. App Check (later, before wider public release)
- Consider Firebase App Check for abuse protection after initial integration and test plan.
- Select an appropriate web provider and verify compatibility before enforcing.

## F. Firestore Rules / emulator
- Rules must be reviewed and tested with the Firebase Emulator Suite.
- Private data reads/writes should be limited to authenticated owner.
- Public leaderboard access should expose only safe display fields and server-validated entries.
- Do not use client writes to set arbitrary leaderboard scores.

## Setup confirmation checklist
- [ ] Web app registered and config captured locally
- [ ] Google provider enabled and support email selected
- [ ] Anonymous provider enabled if guest cloud saves are desired
- [ ] Authorized domains checked
- [ ] Firestore created in production mode and location selected
- [ ] No test-mode/open rules deployed
- [ ] Hosting not initialized until scaffold is ready

## Official documentation
- Firebase web setup: https://firebase.google.com/docs/web/setup
- Authentication web: https://firebase.google.com/docs/auth/web/start
- Google sign-in: https://firebase.google.com/docs/auth/web/google-signin
- Hosting quickstart: https://firebase.google.com/docs/hosting/quickstart
