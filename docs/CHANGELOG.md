# Changelog

## 2026-10-25: Plan section built (as-is)
- Built Plan from `docs/screens/03_Plan`: Plan home (current + previous plans), Create a new meal plan sheet, building screen, plan detail (PLAN tab with Delete / Swap / + Add per meal, LIST tab shopping list), Add meal sheet (Search / Favourites / own recipe), Update meal plan sheet.
- Known issues kept as-is and marked in code: Plan !1 (15 s build, no cancel), !2 (instant Swap, sideways day rows), !3 (three input styles in Add meal), !4 (Update sheet drops AI/focus, small Delete/Remove links).
- Mock data: five new recipes (two breakfasts, three lunches) so every meal slot can be filled; three previous plans; a static shopping list (not derived from the plan's recipes).
- Plans are saved to localStorage (`dk-plans`) so created and edited plans survive a reload; clear that key to reset.
- Not captured in the audit, so left inert: the pencil next to each day name and the shopping list Share button.
