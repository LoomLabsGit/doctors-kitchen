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

## 2026-10-25: Learn section built (as-is)
- Built Learn from `docs/screens/06_Learn`: Learn home (search, category chips, Nutrition basics course carousel, For you, Added recently, Ways to learn, protein calculator link), Learn search and no-results, What to eat for and Ingredients topic grids, category and topic pages, Read / Listen / Watch lists, article, podcast and video pages, and the protein calculator.
- Known issues kept as-is and marked in code: Learn !1 (chips in two sideways rows, Nutrition basics off-screen), !2 (no result count or type filter), !3 (plain no-results notice), !4 (a category picked from a filtered list can come back empty, with "click here" the only way out; reachable via Cooking skills from Read, or Mindset from Watch), !5 (Male pre-selected), !6 (999 kg rejected with no accepted range; the prototype accepts 30 to 250 kg or 66 to 550 lb).
- Content is mock data: titles are made up and article / episode text is a placeholder, so nothing from the live app is copied. The protein formula is also made up, tuned so the audited answers (70 kg, male, under 50, 1 or 2 sessions, healthy weight, maintain) give the same 84 g.
- Not captured in the audit, so left inert: course lesson playback and the "0 of 8" progress, the notification bell on topic pages, the share icon, and the Apple / Spotify / YouTube buttons. The Ingredients chip opens a small grid of three ingredient topics (not captured either).

## 2026-10-25: Profile section built (as-is)
- Built Profile from `docs/screens/08_Profile`: Profile home, Your food preferences, Your notification preferences, Your subscription (mock complimentary plan) and Virtual Dr Rupy chat history. Every section of the app is now built; the `Stub` screen is removed.
- Known issues kept as-is and marked in code: Profile !1 (three Update buttons; each one saves the whole page), !2 (floating Update button), !3 (three overlapping news/offers options), !4 (two date formats, UTC).
- Preferences are saved to localStorage (`dk-profile`) when Update is pressed. They do not yet feed Recipes filters or Plan.
- Left out or inert: Account info (its screens were removed because they showed personal details), Log out, Buy a subscription. Chat summaries and notification descriptions are reworded, not copied.
