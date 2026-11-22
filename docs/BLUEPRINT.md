# Blueprint — Treasure Quiz

## 1. Working title and premise
**Treasure Quiz: The Lost Treasure of Knowledge**. Players explore five regions on a map, answering questions to earn points, XP, stars, coins, and collectible artifacts. The narrative is a light adventure: knowledge unlocks the path to a treasure.

## 2. Target audience
Grade 4 elementary students (roughly 9–10 years old). Interface text should be short, friendly, readable, and accessible. Avoid time pressure as the default; students should be able to think.

## 3. Core loop
Start → choose Guest or Google account → enter/display nickname and avatar → map → choose unlocked region → answer question → receive immediate feedback and explanation → earn rewards → continue → summary and review.

## 4. Regions (draft; revise after question-level review)
| Level | Region | Draft question range | Reward |
|---|---|---|
| 1 | Grammar Village | Q1–7 | Bronze Key |
| 2 | Enchanted Forest | Q8–14 | Forest Gem |
| 3 | Crystal River | Q15–21 | Crystal Key |
| 4 | Wisdom Mountain | Q22–28 | Golden Compass |
| 5 | Treasure Castle | Q29–35 | Legendary Treasure |

The grouping above is only a placeholder by question number. Final level grouping must be based on actual content, difficulty, answer type, and balance. Do not assume Q1–35 mapping is final.

## 5. Question bank baseline
Source document: **ASAS Bahasa Indonesia Kls 4.docx.pdf** in the user's Drive folder. A previous review identified 35 items:
- Q1–15: single-answer multiple choice
- Q16–25: multiple-answer (two correct answers per item, subject to source verification)
- Q26–30: short answer
- Q31–35: essay / analysis / sentence or paragraph creation

Topics noted from the source include SPOK, homonyms, deductive and inductive paragraphs, narrative, argumentation, persuasion, personification, prefixes *me-* and *ber-*, main idea, and simple/compound sentences. Verify exact question text, keys, and explanations against the source before implementation.

## 6. Question representation (proposed)
Each question should have a stable ID, level ID, type, prompt, options when applicable, accepted answer(s), explanation, difficulty, points, and optional media. Keep content in a separate data module or JSON file, not embedded in UI components.

## 7. UX / visual direction
- Modern, bright adventure UI; colorful but not cluttered.
- Treasure map, region cards, chest/gem/scroll motifs.
- Friendly feedback with sound and accessible text; sound toggle and reduced-motion-friendly behavior.
- Responsive layout; large tap targets; readable contrast; avoid tiny text.
- Avoid avatars or illustrations that require detailed faces; optional simple icon avatars.

## 8. MVP boundary
Include start screen, nickname guest mode, map/level selection, single-answer and multi-answer mechanics, short-answer review, feedback/explanations, progress, score, basic audio toggle, and end summary/retry. Account login, cloud progress, leaderboard, and teacher dashboard are staged behind MVP unless needed for architecture.

## 9. Future expansion
Reuse the engine and player model for other subjects, question sets, class challenges, teacher dashboard, and multiplayer/room mode. Do not implement multiplayer in MVP.
