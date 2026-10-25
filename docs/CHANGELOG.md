# Changelog

## 2026-10-25: Plan section built (as-is)
- Built Plan from `docs/screens/03_Plan`: Plan home (current + previous plans), Create a new meal plan sheet, building screen, plan detail (PLAN tab with Delete / Swap / + Add per meal, LIST tab shopping list), Add meal sheet (Search / Favourites / own recipe), Update meal plan sheet.
- Known issues kept as-is and marked in code: Plan !1 (15 s build, no cancel), !2 (instant Swap, sideways day rows), !3 (three input styles in Add meal), !4 (Update sheet drops AI/focus, small Delete/Remove links).
- Mock data: five new recipes (two breakfasts, three lunches) so every meal slot can be filled; three previous plans; a static shopping list (not derived from the plan's recipes).
- Plans are saved to localStorage (`dk-plans`) so created and edited plans survive a reload; clear that key to reset.
- Not captured in the audit, so left inert: the pencil next to each day name and the shopping list Share button.

## 2026-10-25: Saved section built (as-is)
- Built Saved from `docs/screens/04_Saved`: Saved home (three collections and the two fixed lists), collection screen with Edit menu (Rename, Delete) and a Delete pill per recipe, Edit collection name sheet, Your rated recipes, Recipes you've cooked.
- Rebuilt the Recipe detail Save sheet from `02_Recipe-detail/07` and `08` (Add to a favourites collection, Create new collection), so collections can be filled and created.
- Known issues kept as-is and marked in code: Saved !1 (no create/manage control on Saved home), !2 (Edit menu stays open behind Rename), !3 (any collection, Favourites included, can be deleted; the warning does not say what happens to its recipes).
- Plan's Add meal FAVOURITES tab now reads the Favourites collection instead of its own mock list.
- Collections are saved to localStorage (`dk-saved`); clear that key to reset. Ratings and cooked recipes are fixed mock data.

## 2026-10-25: About removed
- About exists only on the website, not in the app, so it is out of scope: removed the About tab and route (bottom bar now has five tabs), its reference screenshots (`docs/screens/07_About`), its section in `docs/APP_MAP.md` and About !1 to !3 in `docs/ISSUES.md`.
- U15 reworded to drop the About point; the rest of the finding still applies.

## 2026-10-25: Progress section built (as-is)
- Built Progress from `docs/screens/05_Progress`: day view (date arrows, week strip with mini rings, fibre and protein rings, inflammation score bar, plant points this week), info sheets, Add meal sheet with its four routes, logged meal rows, Edit recipe sheet, and the toasts.
- Route A opens Recipe search with `?log=<date>`; each result gets a "+ Add" tab that logs the recipe and returns to that day. Route B adds one of five mock "your recipes". Route D guesses ingredients from keywords in the description (a stand-in for the live app's AI) and shows "Calculating nutritional info…" for 60 s. Route C (Upload photo) was not captured in the audit, so it behaves like route D with no ingredients guessed.
- Known issues kept as-is and marked in code: Progress !1 to !10 (two Add meal buttons, Save on the info sheet, four controls in one sheet, route A gives no day, instant Delete with no undo, Edit vs Delete tabs, small delete link, "uploaded" toast, slow calculation and shortened title, butter added to guesses).
- Nutrition per recipe, the ingredient table and the info sheet text are made up for the prototype. Inflammation is the average of the day's meals; plant points add up each meal's plants for the week (not unique plants).
- The log is saved to localStorage (`dk-progress`); clear that key to reset. The two days before today start with a few meals; today starts empty.
