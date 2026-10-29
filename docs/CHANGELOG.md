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

## 2026-10-25: Fix Recipes !1, no default "No gluten" filter
- Lists and search start with no filters, and "Clear filters" and Reset go back to that. Before: "No gluten" was applied on every load and came back after clearing, hiding gluten recipes from everyone.
- Profile allergens are not wired to the filters yet; if they were, the default should come from there and say so on the chip.
- To compare with the live app, set `avoid` back to `['Gluten']` in `DEFAULT_FILTERS` (`src/lib/filters.tsx`).

## 2026-10-25: Fix Progress !5, Undo after deleting a logged meal
- Deleting a meal (the red Delete tab, or "Delete recipe from this day" in Edit recipe) still happens at once, but the toast now has an Undo button (44 px tall) and stays for 7 s instead of 4 s. Undo puts the meal back on the same day.
- Chosen over a confirmation dialog so logging stays quick; the Delete tab itself is unchanged and is a candidate for a later fix.

## 2026-10-25: Fix Saved !3, protect Favourites and explain deleting a collection
- Favourites is the default collection (Plan's Add meal FAVOURITES tab reads it), so its Edit menu no longer offers Delete and says why instead.
- Deleting any other collection opens a sheet that names the collection and says its recipes stay in the app and in any other collections, with "Keep it" and a red "Delete collection" button. Before: a browser confirm() that said only "Are you sure?".
- The Edit menu now closes when Delete is chosen; Rename still leaves it open (Saved !2, not fixed).

## 2026-10-25: Fix Learn !4, no more empty filtered lists
- Category and topic pages now have All / Articles / Podcasts / Videos tabs with counts; kinds with nothing in that category are greyed out and can't be picked.
- Arriving from a Read / Listen / Watch list with a kind the category doesn't have (e.g. Read → Cooking skills) shows everything, with a note saying there are no articles there yet. Before: an empty page saying "We're filtering this list", with a "click here" link as the only way out.

## 2026-10-25: Fix U1 and U2, Cuisines and Ingredients as a browse grid
- The Cuisines and Ingredients pages are now a two-column grid of tiles, with the full name under each image (no dark label bar, no truncation) and a recipe count.
- The unrelated recipe feed and filter bar under the tiles are gone; filters stay on the list you open from a tile. Before: one sideways row (about 2.7 tiles visible) above a recipe list that had nothing to do with the tiles.

## 2026-10-25: Fix U3, "Browse by" on Recipes home
- The Cuisines / Ingredients / Breakfast chip row is replaced by a "Browse by" section with three equal cards, all visible: Cuisines, Ingredients and Meal types.
- New Meal types page (`/meals`) in the same grid style as Cuisines and Ingredients; Breakfast is now one of its tiles rather than a peer of the two indexes. Before: two indexes and a single meal type side by side, in a row clipped at the edge with no hint it scrolled.

## 2026-10-25: Fix U4, pinned search field on search results
- Recipe search results now have a real search field (with a clear button) that stays pinned at the top with the filter bar while the results scroll. The query is no longer a chip among the filters.
- The Filters button shows how many filters are on, e.g. "Filters (2)", on every list. Before: the only way to change the search was to remove the query chip or open the Filters sheet.

## 2026-10-25: Fix U5, nutrition and fixed metadata on recipe cards
- Every recipe row and home carousel card now has the same slots: time and ingredients, rating ("No ratings yet" when there is none), and protein and fibre.
- In High Protein contexts (the home carousel and the High Protein list) protein is highlighted in green. Before: no nutrition on any card, and the rating line simply disappeared on unrated recipes, so cards had different shapes.
- Nutrition numbers are the made-up figures Progress uses. Profile's "Show recipe nutrition information" toggle is not wired to this yet.

## 2026-10-25: Recipe detail rebuilt from the screenshots (as-is)
- Rebuilt Recipe detail from `docs/screens/02_Recipe-detail`: photo with back arrow, main ingredient and rating, Share / Print / Add to plan / Save icons (the heart fills when the recipe is in a collection), title, description with Read more, OVERVIEW / INGREDIENTS / METHOD pill tabs, and the green "Chat with Dr Rupy" card with suggestion chips.
- Overview: prep time, cook time, freezer friendly, shelf life, then protein, fibre and tags (only the first four were captured; the rest is a best guess). Ingredients: Serves stepper that scales amounts, Metric / Imperial toggle, grouped ingredient lines. Method: Your notes (saved per recipe to localStorage, `dk-notes`) and numbered steps.
- Sheets: Share this recipe (Whatsapp / Facebook / Email inert, Save just closes), Add recipe to a meal plan, Add to a favourites collection (unchanged), Ask Dr Rupy chat (chips prefill the question; replies are a placeholder).
- Known issues kept as-is and marked in code: Recipe detail !1 (Save on the share sheet, no copy link) and !2 (no current plan reads as "no plans at all" even with previous plans; small "here" link; Save with nothing to save).
- Add to plan with a current plan was not captured (`06` is missing from the screenshots); it lets you pick the day and meal and adds the recipe to that slot.
- Description, timings, ingredient lines and method steps are generated from mock data in `src/data/recipeDetail.ts` and marked as placeholders; no real recipe text is copied. Print opens the browser's print dialog.

## 2026-10-25: Back to as-is (redesign fixes removed)
- Removed the redesign fixes so the prototype shows only what the live app does today: Recipes !1, Progress !5, Saved !3, Learn !4 and U1 to U5 are back to their as-is behaviour (default "No gluten" filter, no Undo, Favourites deletable, empty filtered Learn lists, sideways index rows with the recipe feed, the Cuisines / Ingredients / Breakfast chip row, no search field on results, no nutrition on cards). The Meal types page and the Browse by section are gone with them.
- The fixes are kept on the `redesign-high-severity` branch for later; their entries above describe that branch, not this one.
- Kept: every section built from the screenshots, including the rebuilt Recipe detail.

## 2026-10-25: Home search field opens the Recipe search sheet (as-is)
- Tapping the search field on Recipes home now opens the "Recipe search" sheet, as in the app, with the search box focused. Apply filters (or Enter) goes to the results with the query and filters applied. Before: the field was a plain input that did nothing until you pressed Enter.
- The same sheet (also opened by the Filters button) now matches `01_Recipes/09`: search icon in the box, selected options solid blue, Reset and Apply filters as square-cornered buttons. The query in the sheet is applied on Apply rather than as you type.

## 2026-10-25: 96 mock recipes so filters behave realistically
- The catalogue grows from 17 to 96 made-up recipes covering all 8 cuisines, 8 main ingredients (Vegetables and Eggs added to the Ingredients index), all 9 meal types, every category, diet and allergen. Titles, timings and tags are invented; nothing is copied from the live app.
- Tags are tidied for every recipe: vegan recipes also count as vegetarian, vegetarian and fish dishes as pescatarian, and anything 30 minutes or under gets "Under 30mins".
- Examples with the as-is "No gluten" default on: all recipes 70, "chicken" 11, "curry" 8, Indian 11, Legumes 14, Breakfast 10, High Protein 15.
- Every recipe now has nutrition (hand-picked for the original 17, estimated from main ingredient, category and meal type for the rest), and Recipe detail's ingredient list starts with the main ingredient.

## 2026-10-25: As-is / Improved switch, and real icons
- **Version switch.** One build now holds both versions. A toggle outside the phone frame (a small pill above the bottom bar on a phone) switches between **As-is** (default, the app as it is today) and **Improved**. The choice is remembered in localStorage (`dk-version`), and `?v=improved` / `?v=as-is` in the address opens a version directly (the toggle keeps that in step). Switching resets the recipe filters to that version's defaults.
- **Improved version** brings back the eight fixes from the `redesign-high-severity` branch, re-applied behind the switch with the as-is code kept next to each: Recipes !1 (no default "No gluten"), Progress !5 (Undo after deleting a meal), Saved !3 (Favourites protected, clear delete sheet), Learn !4 (kind tabs with counts, no empty filtered pages), U1 and U2 (index pages as a two-column grid), U3 (Browse by, with the Meal types page), U4 (pinned search field on results, filter count on the Filters button) and U5 (nutrition and fixed metadata on recipe cards). `docs/ISSUES.md` marks these "(improved version)".
- **Icons.** Every UI icon is now a Google Material Symbol (Rounded, self-hosted via the `material-symbols` package) instead of text glyphs and emoji: bottom bar, header, the clock and leaf under each recipe, stars, hearts, chevrons, filter and clear buttons, sheet close buttons, Plan, Progress, Saved, Learn (category chips, health topic grid, READ / LISTEN / WATCH badges), Recipe detail and Profile. Emoji that are content in the real app (diet choices, health goals, shopping list aisles, the info sheet text) are unchanged. Material Symbols has no brand logos, so WhatsApp and Facebook on the share sheet use generic chat and share icons.

## 2026-10-25: Back arrows, as in the app (as-is)
- Every screen below the five bottom-bar sections now has a back arrow in the header, next to the logo: Cuisines, Ingredients and Meal types, the recipe lists, Recipe search, plan detail, collections and the two fixed Saved lists, Learn search, lists, content pages and the protein calculator, Profile and its pages. The app has these; the website leaves it to the browser's back button, which is why the screenshots don't show them.
- Recipe detail (arrow over the photo) and Learn topic pages (arrow in the banner) keep their own and use the same behaviour. The bottom-bar screens and the plan building screen have none.
- Back goes to the previous screen. When a screen was opened from a link with nothing to go back to, it goes to its parent instead (e.g. a cuisine list goes to Cuisines, then Recipes home).

## 2026-10-25: Scrollbars hidden
- Scrollbars are hidden everywhere (carousels, chip rows and vertical scrolling), as on a phone. Scrolling still works by touch, trackpad, mouse wheel and keyboard. One rule in `src/index.css`.

## 2026-10-29: Cook now, an audio-guided cook-along (improved version, new feature)
- **Cook now** button on Recipe detail, above the Overview / Ingredients / Method tabs, in the Improved version only and only on recipes that have a cook-along: a green card with a pulsing play button, "Cook now with Dr Rupy · 11 steps · audio · timers".
- **Cook-along mode** (`/recipe/:slug/cook`, full screen with no header, bottom bar or version toggle): close and ingredients buttons, an 11-segment progress bar, then per step the photo (or a "Prep step" placeholder for steps 2, 4 and 8), "Step N of 11", the instruction in large type, and a "Listen to Dr Rupy" player that plays the step's clip on arrival with play / pause, replay and progress. Back and Next step at the bottom; the last step finishes on an "Enjoy your meal" screen.
- **Timers** on the steps that mention a time (1: 4 min per side as two timers; 3: 6 min then 1 min; 5: 3 min; 7: 5 min; 9: 6 min; 10: 2 min). Start, pause, resume and reset on the step; once started, a timer follows you as a compact bar at the top of every other step (tap it to jump back to its step). When it runs out it beeps, vibrates and turns amber with "Done".
- **One-Pan Harissa Chicken and Chickpea Pasta** now uses DK's own ingredients (with notes such as "diced", and a "To serve (optional)" group) and its 11-step method, as supplied by the design team, in both versions. It is the first "For you" recipe and shows its real photo on cards, carousels, Recipe detail and everywhere else it appears. Its intro text, timings and servings were not supplied, so those are still placeholders (amounts are treated as serving 2).
- The photos and Dr Rupy's audio are in `public/local/harissa/`, git-ignored so they stay on this machine; without them the prototype falls back to gradients and an "Audio isn't available on this device" message. The step photos come from DK's 9-step version, so their numbers don't match these 11 steps.

## 2026-10-29: Cook now, ingredients per step and calmer play buttons
- Each cook-along step now has a "You'll need" card under the instruction, listing the ingredients that step uses with their amounts and notes (e.g. step 3: 150 g white onion diced, 3 garlic cloves grated, 3 tbsp harissa paste, 1 tbsp tomato puree, 1 tsp cumin). Amounts come from the recipe's ingredient list, so they always match; step 9 uses nothing new, so it has no card.
- Removed the pulsing animation from the Cook now play button and from the audio player; both are now static.

## 2026-10-29: Cook now type sizes, and the Harissa pasta's real details
- Cook mode now uses Recipe detail's type scale: step title 26 px (as the recipe title), instruction 18 px (as Method steps), ingredients, body text and buttons 17 px, the "Cooking with Dr Rupy" label 15 px bold capitals (as the CHICKEN category label), and section labels ("You'll need", "Timers") 14 px capitals (as ingredient group titles). Before: 30 px title, 21 px instruction and 12 to 13 px labels.
- One-Pan Harissa Chicken and Chickpea Pasta now has its real description, prep time (10 mins), cook time (40 mins), freezer friendly (No) and shelf life (3 days), as supplied by the design team. Servings are still not supplied, so amounts are treated as serving 2.
- Step 1 and step 3 audio replaced with new recordings (local files only, nothing in git).

## 2026-10-29: Step photos in the Method tab
- The Harissa pasta's Method tab now shows each step's photo under its text, with the same "Prep step" placeholder as cook mode for steps 2, 4 and 8. Applies in both versions, since the photos are the recipe's own. Recipes without step photos keep the plain numbered list.
- The step photo is one shared component (`StepImage` in `src/screens/Cook.tsx`), so the Method tab and cook mode always match.
