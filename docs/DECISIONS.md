# Decision log

## 2026-11-22 — Frontend prototype before Firebase
**Decision:** Build a functional local prototype first; integrate Authentication and Firestore after the question/game loop is stable.
**Reason:** Faster iteration and avoids Firebase configuration blocking gameplay design.
**Status:** Accepted.

## 2026-11-22 — Guest play plus optional Google account
**Decision:** Guest mode should be available without forcing Google login; Google account is optional for persistence.
**Reason:** Reduce barriers for elementary students. Account use should be age-appropriate and school/parent approved.
**Status:** Accepted; implementation pending.

## 2026-11-22 — Public leaderboard privacy
**Decision:** Display nickname only; do not show emails, full legal names, or other personal data.
**Reason:** Student privacy.
**Status:** Accepted.

## 2026-11-22 — Client score writes are untrusted
**Decision:** Leaderboard scores require trusted validation before ranking; no direct arbitrary client score writes.
**Reason:** Prevent manipulation and protect fair ranking.
**Status:** Accepted.

## 2026-11-22 — Five themed regions (draft)
**Decision:** Use five regions as the narrative structure.
**Reason:** Simple progression and clear reward milestones.
**Status:** Accepted as structure; question grouping remains provisional.
