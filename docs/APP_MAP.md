# App map (as audited, mobile web, The Doctors Kitchen)

The website mirrors the app. Bottom bar: Recipes, Plan, Progress, Saved, Learn, About. Profile is reachable only from the Recipes home header.
Screenshots for every screen are in `docs/screens/<section>/`. The Miro board holds the full experience map.

## Recipes (`01_Recipes`)
- Recipes home `/home_recipes.php` (search, Cuisines / Ingredients / Breakfast chips, For you, High Protein carousels)
- Cuisines index `/category_collections/cuisines`, cuisine list `/categories/sri-lankan`
- Ingredients index `/category_collections/ingredients`, ingredient list `/categories/chicken`
- Meal type list `/meals/breakfast`, category list `/categories/high-protein`
- Recipe search `/search.php`, Filters modal (sort, dietary, meal types, exclude allergens, useful categories), filtered results

## Recipe detail (`02_Recipe-detail`) `/recipes/[slug]`
Overview, Ingredients pane, Method pane. Modals: Share sheet, Add to plan (no plan / plan exists), Save (heart) with Create new collection, AI chat sheet.

## Plan (`03_Plan`) `/meal_plans`
Plan home, Create new meal plan modal, loading (~15 s), plan detail (PLAN tab, LIST tab = shopping list), Add meal modal, Edit meal plan modal.

## Saved (`04_Saved`)
Saved home, collection (Favourites, Want to cook, Regulars), Edit menu (Rename, Delete), fixed collections (Your rated recipes, Recipes you've cooked).

## Progress (`05_Progress`)
Progress home (inflammation score, plant points, day view), info modal, Add meal modal with four routes: A our recipes, B your recipes, C upload photo, D describe a meal. Logged entry, delete, edit recipe modal, AI-guessed ingredients.

## Learn (`06_Learn`)
Learn home with category chips, Read / Watch / Listen lists, search results and no-results, protein calculator. (25 screens, see folder.)

## About (`07_About`)
TV and Press, Books, History, For work, Sources, FAQs, Contact us (4 panels), Terms, Privacy.

## Profile (`08_Profile`)
Your details, Food preferences, Notification preferences, Your subscription, Virtual Dr Rupy chat history. (Delete account, subscription purchase and log out were deliberately not exercised.)

## Not mapped yet
Onboarding (steps 2+), login, sign-up, forgot password and logged-out views.

## Logged out (`09_Logged-out`)
See `docs/LOGGED_OUT.md`: five-tab bar, gated pages, four routes into an account, sign-up flow S1 to S8.
