# Audit findings

Two layers. **UX issues** (functional/behavioural, found by using the app) come first. The **UI / UX design audit** (layout, IA, interaction, visual) is being done one frame at a time; only Recipes is done so far.
Severity: High / Medium / Low. IDs match the Miro board tables.

## UX issues

### Recipes
- !1 High **(improved version)**, every list and search: "No gluten" is on by default and returns on each page load even after "Clear filters".
- !2 Low, header: Profile is reachable only from a small pill on Recipes home; missing on Plan, Progress, Saved and Learn.
- !3 Medium, cuisine list: the "Cuisines List" feels like a filter but is applied differently to other filters.
- !4 Medium, filtered results: applied chips run off the right edge, so meal type and category filters are hidden until scrolled.
- !5 Low, recipe image: padding issues on the label, as it does not overlap the outside (added by the user).

### Recipe detail
- !1 Medium, share sheet: a Save button on a share sheet is ambiguous; no copy-link option (only WhatsApp, Facebook, Email).
- !2 Medium, add to plan modal: with no current plan it says you have none even when past plans exist; only a small "here" link leads on; a Save button shows with nothing to save.

### Plan
- !1 Low, loading: no cancel and no progress detail while the plan builds (~15 s).
- !2 Medium, plan detail: Swap replaces a meal at once with no picker, confirmation or undo; each day scrolls sideways so dinner is hidden.
- !3 Low, add meal modal: three input styles in one sheet (suggestions, search, "Cooking your own recipe?" dropdown).
- !4 Low, edit meal plan modal: drops the AI plan and focus options the create modal has; "Delete meal plan" and "Remove all recipes" are small text links; delete confirms.

### Progress
- !1 Low, home: two identical "Add meal" buttons on the same empty day.
- !2 Low, info modal: main button is Save next to Close; nothing is saved.
- !3 Medium, add meal modal: four ways to log in one sheet, each a different control.
- !4 Medium, route A: leaves Progress for general recipe search, which does not say which day the meal goes to.
- !5 High **(improved version)**, logged entry: Delete is a small red tab on the photo and removes the entry at once, no confirmation or undo.
- !6 Low, entry from your recipes: generic icon; its tab says Edit where our recipes say Delete.
- !7 Medium, edit recipe modal: the only way to remove the entry is a small grey "Delete recipe from this day" link under Save.
- !8 Low, route D: toast says "uploaded" for typed text; no idea how long it takes.
- !9 Medium, calculating: still calculating after about a minute; title shortened from what was typed.
- !10 Medium, edit recipe (guesses): guess adds butter that was not in the description; nothing says amounts are estimates.

### Saved
- !1 Medium, home: collections can only be created from a recipe's Save sheet; no create/manage control here.
- !2 Low, rename modal: the Edit menu stays open behind the modal.
- !3 High **(improved version)**, delete collection: even default Favourites can be deleted; the warning does not say what happens to its recipes.

### Learn
- !1 Medium, home: category chips scroll sideways in two rows; e.g. Nutrition basics sits off-screen.
- !2 Low, search results: no result count; no filter by article, podcast or video.
- !3 Low, search no results: plain notice, no suggestions (recipe search offers popular categories).
- !4 High **(improved version)**, Read and Watch lists: picking a category from a filtered list can return an empty page showing only "We're filtering this list"; the only way out is a "click here" link.
- !5 Medium, protein calculator: Male is pre-selected, so skipping gender gives a male estimate.
- !6 Low, protein calculator: 999 kg is rejected with "Please enter a valid weight", with no accepted range.

### Profile
- !1 Medium, food preferences: three Update buttons on one page; unclear which section each saves.
- !2 Medium, notification preferences: the floating Update button sits over content as you scroll.
- !3 Low, notifications scrolled: "DK news and offers", "Offers from our partners", "General news and offers" overlap in meaning.
- !4 Low, subscription: dates in two formats (07/09/2027 and 7th Sep 2027), in UTC.

## UI / UX design audit

### Recipes (U1 to U18)
| ID | Sev | Type | Where | Finding | Direction |
|---|---|---|---|---|---|
| U1 | High (improved version) | IA | Cuisines and Ingredients index | Titled "Cuisines" but shows an unrelated recipe list below the tiles. | Pure browse grid, or tie the list to a selected tile. |
| U2 | High (improved version) | Layout | Index pages | Tiles in one sideways row (~2.7 visible), no count, truncated names. | 2-column grid or A-Z list; two-line names. |
| U3 | High (improved version) | IA | Home chips | Cuisines, Ingredients and Breakfast are different kinds of thing; row clipped, no hint. | A "Browse by" section with equal-weight entries. |
| U4 | High (improved version) | Interaction | Search results | No search box on results; query is a chip mixed with filters. | Pinned search field; separate filter button with count. |
| U5 | High (improved version) | Content | All recipe cards | No nutrition on cards, even High Protein; metadata varies (rating missing on some). | Show protein/calories/health tag by context; fixed metadata slots. |
| U6 | Med | Interaction | Cuisine/ingredient/meal lists | Tile row gone, no visible back control; hard to compare siblings. | Back button plus sticky sibling selector. |
| U7 | Med | Visual | Page titles | Green vs black titles with no meaning; count only on search; green looks tappable. | One title style, counts everywhere, green for interactive only. |
| U8 | Med | Visual | Filter bar | Three control styles in a row; solid green Filters reads as primary; rule looks like a scrollbar; default chip looks chosen. | One filter button with count badge, one chip style, mark defaults. |
| U9 | Med | Layout | Home carousels | Cards nearly full width (~1.1 visible); "Show all" inconsistent; "For you" unexplained. | ~60% cards, consistent headers, say why For you is personal. |
| U10 | Med | Layout | List rows | ~160 px rows, 3 to 4 per screen; tiny grey metadata; redundant chevron. | Smaller thumbnails or compact toggle; drop chevron; raise contrast. |
| U11 | Med | A11y | Heart on photos | Small icon under 44 px; contrast depends on photo; no save confirmation. | Solid circular chip, 44 px; toast linking to the collection. |
| U12 | Med | IA | Filters sheet groups | Gluten under allergens but chip says "No gluten"; "Under 30mins" in categories; no cuisine/ingredient/time filter. | Diet, Allergens, Meal type, Time, Goals. |
| U13 | Med | Interaction | Filters footer | No result count on Apply; Reset looks disabled; weak selected state; no drag handle. | "Show 44 recipes" live; clear Reset; stronger selected state. |
| U14 | Med | A11y | Chips | ~28 px tall, 13 px text, packed tightly. | 40 to 44 px, more spacing, 14 to 16 px text. |
| U15 | Med | Layout | Bottom nav | 11 px labels; Profile is hidden while every other section has a tab; ambiguous icons; active state colour only. | Profile persistent; clearer icons and active state. |
| U16 | Low | Visual | NEW! ribbon | On most recipes so it signals nothing; dated style. | Limit to recent recipes; small pill. |
| U17 | Low | Visual | Index tile labels | Dark grey bar hides image; low contrast. | Label below image or gradient scrim. |
| U18 | Low | Visual | "Not found what you're looking for?" | Italic style used nowhere else; outcome of "Let us know" unclear. | Standard text/card; state the outcome. |

### Remaining frames (to do, one at a time)
Recipe detail, Plan, Saved, Progress, Learn, Profile.
