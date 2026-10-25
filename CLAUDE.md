# The Doctors Kitchen: mobile prototype

You are helping a Senior UX designer (joined The Doctors Kitchen, a UK nutrition and recipe app) redesign and improve the mobile experience. This repo is a clickable, front-end-only recreation of the current app so redesigns can be tried in code.

## Read first
- `docs/APP_MAP.md`: every section and screen, with the original URLs.
- `docs/ISSUES.md`: all UX issues found by using the app, plus the UI/UX design audit (Recipes done; other frames in progress).
- `docs/screens/<section>/`: 3x reference screenshots of the CURRENT app, numbered in flow order. Treat them as the ground truth for how things look today.

## How the code is organised
- React + Vite + Tailwind v4 + react-router (HashRouter). Run `npm install && npm run dev`.
- Design tokens live in `src/index.css` (`@theme`). Change tokens before changing components.
- `src/components/ui.tsx`: Chip, PageTitle, RecipeRow, Sheet, Photo. `FilterBar.tsx`: filter bar and Filters sheet. `Shell.tsx`: phone frame, header, bottom bar.
- `src/screens/`: Recipes (home, index, list, search), Recipe detail and Plan (home, create, building, plan detail with PLAN/LIST tabs, Add meal and Update sheets) and Saved (home, collection with Edit menu / Rename / Delete, the two fixed lists, plus the Recipe detail Save sheet) and Progress (day view with rings, week strip, inflammation score, plant points, info sheets, Add meal sheet with routes A to D, Edit recipe sheet) and Learn (home, search, category and topic pages, Read / Listen / Watch lists, article / podcast / video pages, protein calculator) are built. Profile is a `Stub` screen to be built from the screenshots.
- `src/data/plans.ts` and `src/lib/plans.tsx`: mock meal plans and a plan store saved to localStorage (`dk-plans`; clear it to get the mock plans back). Dates are local `YYYY-MM-DD` strings, see `src/lib/dates.ts`.
- `src/data/saved.ts` and `src/lib/saved.tsx`: mock collections and a store saved to localStorage (`dk-saved`). Plan's Add meal FAVOURITES tab reads the Favourites collection from here.
- `src/data/progress.ts` and `src/lib/progress.tsx`: food log, made-up nutrition per recipe, an ingredient table for Edit recipe, and a store saved to localStorage (`dk-progress`). Recipe search shows a "+ Add" tab when opened from Progress (`?log=<date>`).
- `src/data/learn.ts`: mock Learn content (articles, podcasts, videos), categories and topics. Titles and body text are made up or placeholders: do not copy the live app's content.
- `src/data/recipes.ts` is mock data. Photos are gradient placeholders on purpose: do not copy real recipe photos or content into the repo.
- The current app's known problems are kept AS-IS in the first version, with comments like `UX issue U4` so you can compare before and after. Fix them deliberately, one at a time, and note what changed in `docs/CHANGELOG.md`.

## Working rules (from the audit)
- The website's About section is not in the app and is out of scope; do not rebuild it.
- One set of bottom-bar entries; each decision point has one parent.
- Modals get their own branch in any flow documentation.
- Only note a UX issue where a genuine issue exists.
- No purchases, plan changes or account deletion flows are prototyped.
- Never comment on or rate individual recipes.
- Screens of a user's details were deliberately removed from `docs/screens`; do not add real personal data.

## Suggested next steps
1. Build the remaining sections from `docs/screens` (Profile is the last one; Plan, Saved, Progress and Learn are done).
2. Pick redesign targets from the High severity rows in `docs/ISSUES.md`.
3. Continue the UI/UX audit for Recipe detail, Plan, Saved, Progress, Learn, Profile, and add findings under "UI / UX design audit".
