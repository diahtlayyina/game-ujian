# Game Ujian

**Treasure Quiz — The Lost Treasure of Knowledge** is a lightweight browser-based educational quiz adventure for Grade 4 students. It is designed to be opened directly through a URL, with no app installation.

## Current approach
- Frontend: plain HTML, CSS, and JavaScript (small, modular files; no heavy framework)
- Source and question pack: GitHub
- Hosting: Vercel Hobby (subject to its personal/non-commercial use policy and current limits)
- Optional accounts and shared score storage: Supabase Free (only after privacy and security setup)
- First prototype: no backend; local guest nickname and local progress

## Project docs
- [Blueprint](docs/BLUEPRINT.md)
- [Roadmap](docs/ROADMAP.md)
- [Features](docs/FEATURES.md)
- [Gameplay rules](docs/GAME_RULES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Supabase setup](docs/SUPABASE_SETUP.md)
- [Firebase setup (legacy/optional)](docs/FIREBASE_SETUP.md)
- [Implementation state](docs/IMPLEMENTATION_STATE.md)
- [Decision log](docs/DECISIONS.md)

## Principles
1. Lightweight and fast, usable on phones, tablets, and laptops.
2. Guest play works without account creation.
3. Helpful feedback, not harsh punishment.
4. Collect minimal personal data; public rankings use nickname only.
5. Never store passwords in GitHub or plain database fields.
6. Do not expose personal student data or internal exam material in a public repository.
7. Backend features are optional and staged after the frontend prototype.

