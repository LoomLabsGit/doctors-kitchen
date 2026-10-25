// Mock meal plans and shopping list. Recipes are referenced by slug from recipes.ts.
import { recipes, type Recipe } from './recipes'

export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
export const FOCUS = ['Batch Cook', '<10 ingredients', 'High Protein', 'Kid Friendly', 'One Pots', 'Under 30mins']

// A slot holds DK recipes or the user's own recipes (free text, from "Cooking your own recipe?").
export type Entry = { slug: string } | { own: string }
export type Plan = { id: string; start: string; days: number; servings: number; meals: string[]; slots: Record<string, Entry[]> }
export const slotKey = (day: number, meal: string) => `${day}-${meal}`

// Recipes the planner can pick for a meal, narrowed by the "Specific focus?" chips when any match.
export function poolFor(meal: string, focus: string[] = []): Recipe[] {
  const types = ({ Breakfast: ['Breakfast'], Lunch: ['Lunch', 'Dinner'], Dinner: ['Dinner'], Snack: ['Snack', 'Drink'] } as Record<string, string[]>)[meal] ?? ['Dinner']
  const all = recipes.filter((r) => types.includes(r.mealType))
  const focused = all.filter((r) => focus.every((f) => (f === '<10 ingredients' ? r.ingredients < 10 : r.categories.includes(f))))
  return focused.length ? focused : all
}

export function fillSlots(days: number, meals: string[], focus: string[]) {
  const slots: Plan['slots'] = {}
  for (let d = 0; d < days; d++) meals.forEach((m, i) => {
    const pool = poolFor(m, focus)
    slots[slotKey(d, m)] = [{ slug: pool[(d + i * 2) % pool.length].slug }]
  })
  return slots
}

const past = (id: string, start: string, days: number, slugs: string[]): Plan => ({
  id, start, days, servings: 2, meals: ['Dinner'],
  slots: Object.fromEntries(slugs.map((s, i) => [slotKey(i % days, 'Dinner'), [{ slug: s }]])),
})
// Previous plans as seen on Plan home (03_Plan/01). No current plan to start with, so the create flow is the first thing tried.
export const initialPlans: Plan[] = [
  past('p3', '2026-09-28', 5, ['crispy-sumac-chicken', 'coconut-chicken-lentil-daal', 'miso-greens-tofu-rice-bowl', 'one-pan-harissa-chicken-pasta']),
  past('p2', '2026-09-21', 7, ['salmon-peach-ginger-traybake', 'chickpea-herb-salad', 'sri-lankan-cashew-curry', 'spicy-snapper-red-curry']),
  { ...past('p1', '2026-08-19', 5, []), meals: ['Breakfast', 'Dinner'], slots: fillSlots(5, ['Breakfast', 'Dinner'], []) },
]

// Mock "your recipes" for the own-recipe dropdown.
export const ownRecipes = ['My overnight oats', 'Leftover veg frittata', 'Sunday roast veg']

// Static shopping list (LIST tab). Not derived from the plan's recipes: mock data has no ingredient lines.
export const shoppingList: { aisle: string; icon: string; items: string[] }[] = [
  { aisle: 'Baking', icon: '🥧', items: ['cornflour – 2 tbsp', 'flaxseed (linseed) – 20g', 'mixed seeds – 40g', 'walnuts – 50g', 'white sesame seeds – 20g'] },
  { aisle: 'Dairy and Eggs', icon: '🥚', items: ['cottage cheese – 100g', 'eggs – x12', 'feta cheese – 30g', 'greek yoghurt – 80g', 'parmesan cheese – 20g'] },
  { aisle: 'Fresh Produce', icon: '🥕', items: ['baby spinach – 300g', 'cherry tomatoes – 320g', 'red chilli – x1', 'carrot – x2 (100g)', 'courgette – x1 (100g)', 'cucumber – 400g', 'dill – 30g', 'lemon – x2', 'red onion – x3'] },
  { aisle: 'Fish and Meat', icon: '🐟', items: ['chicken thighs – 500g', 'salmon fillets – x2', 'smoked mackerel – 150g'] },
  { aisle: 'Store cupboard', icon: '🫙', items: ['chickpeas (tin) – x2', 'coconut milk (tin) – x1', 'red lentils – 200g', 'brown rice – 250g', 'olive oil – 4 tbsp', 'white miso – 1 tbsp'] },
]
