# The Doctors Kitchen: mobile prototype

You are helping a Senior UX designer (joined The Doctors Kitchen, a UK nutrition and recipe app) redesign and improve the mobile experience. This repo is a clickable, front-end-only recreation of the current app so redesigns can be tried in code.

## Read first
- `docs/APP_MAP.md`: every section and screen, with the original URLs.
- `docs/ISSUES.md`: all UX issues found by using the app, plus the UI/UX design audit (Recipes done; other frames in progress).
- `docs/LOGGED_OUT.md`: the logged-out experience and the sign-up flow, screen by screen, with findings L1 to L23 and the plan. Screens in `docs/screens/09_Logged-out/`.
- `docs/screens/<section>/`: 3x reference screenshots of the CURRENT app, numbered in flow order. Treat them as the ground truth for how things look today.

## How the code is organised
- React + Vite + Tailwind v4 + react-router (HashRouter). Run `npm install && npm run dev`.
- Design tokens live in `src/index.css` (`@theme`). Change tokens before changing components.
- `src/components/ui.tsx`: Chip, PageTitle, RecipeRow, Sheet, Photo. `FilterBar.tsx`: filter bar and Filters sheet. `Shell.tsx`: phone frame, header, bottom bar.
- `src/screens/`: Recipes (home, index, list, search) and Recipe detail are built. Plan, Progress, Saved, Learn, About, Profile are `Stub` screens to be built from the screenshots.
- `src/data/recipes.ts` is mock data. Photos are gradient placeholders on purpose: do not copy real recipe photos or content into the repo.
- The current app's known problems are kept AS-IS in the first version, with comments like `UX issue U4` so you can compare before and after. Fix them deliberately, one at a time, and note what changed in `docs/CHANGELOG.md`.

## Working rules (from the audit)
- One set of bottom-bar entries; each decision point has one parent.
- Modals get their own branch in any flow documentation.
- Only note a UX issue where a genuine issue exists.
- No purchases, plan changes or account deletion flows are prototyped.
- Never comment on or rate individual recipes.
- Screens of a user's details were deliberately removed from `docs/screens`; do not add real personal data.

## Suggested next steps
1. Build the remaining sections from `docs/screens` (Plan, Saved, Progress first).
2. Pick redesign targets from the High severity rows in `docs/ISSUES.md`.
3. Continue the UI/UX audit for Recipe detail, Plan, Saved, Progress, Learn, About, Profile, and add findings under "UI / UX design audit".
