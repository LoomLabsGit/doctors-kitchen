// Mock food log for Progress. DK recipes are referenced by slug from recipes.ts; the user's own meals are lists of ingredients.
import { addDays, todayIso } from '../lib/dates'

export const TARGETS = { fibre: 30, protein: 75 }
export const PLANT_TARGET = 30

// Made-up nutrition per DK recipe: fibre g, protein g, plant points, inflammation (0 = low, 1 = high).
type Stats = { fibre: number; protein: number; plants: number; inflam: number }
const s = (fibre: number, protein: number, plants: number, inflam: number): Stats => ({ fibre, protein, plants, inflam })
export const recipeStats: Record<string, Stats> = {
  'coconut-chicken-lentil-daal': s(12, 38, 6, 0.15), 'miso-greens-tofu-rice-bowl': s(11, 24, 8, 0.1),
  'salmon-peach-ginger-traybake': s(9, 36, 6, 0.1), 'herby-butter-bean-eggs': s(10, 22, 5, 0.15),
  'sri-lankan-cashew-curry': s(9, 15, 7, 0.12), 'spicy-snapper-red-curry': s(7, 34, 5, 0.15),
  'blackberry-cacao-smoothie': s(9, 6, 4, 0.08), 'pina-colada-smoothie': s(4, 3, 3, 0.2),
  'one-pan-harissa-chicken-pasta': s(11, 45, 5, 0.25), 'strawberry-chia-pudding': s(12, 7, 3, 0.1),
  'crispy-sumac-chicken': s(6, 42, 4, 0.3), 'tuna-fennel-walnut-pasta': s(9, 33, 5, 0.2),
  'green-shakshuka': s(8, 18, 6, 0.12), 'overnight-oats-berries': s(9, 10, 4, 0.1),
  'chickpea-herb-salad': s(13, 14, 8, 0.05), 'lentil-roast-veg-soup': s(14, 16, 9, 0.05),
  'smoked-mackerel-rye-toast': s(7, 25, 3, 0.2),
}

// Ingredients for the Edit recipe sheet. fibre and protein are per one unit (per g, ml, whole or slice).
export type Ingredient = { name: string; unit: string; fibre: number; protein: number; plant: boolean }
const i = (name: string, unit: string, fibre: number, protein: number, plant = true): Ingredient => ({ name, unit, fibre, protein, plant })
export const INGREDIENTS: Ingredient[] = [
  i('Avocado', 'whole', 10, 4), i('Banana', 'whole', 3, 1.3), i('Blueberries', 'g', 0.024, 0.007),
  i('Buckwheat', 'g', 0.1, 0.13), i('Butter', 'g', 0, 0.009, false), i('Butternut squash', 'g', 0.02, 0.01),
  i('Cacao powder', 'g', 0.33, 0.2), i('Chia seeds', 'g', 0.34, 0.17), i('Chicken breast', 'g', 0, 0.31, false),
  i('Eggs', 'whole', 0, 6.5, false), i('Kidney beans', 'g', 0.064, 0.087), i('Milk (dairy)', 'ml', 0, 0.034, false),
  i('Porridge oats (rolled)', 'g', 0.1, 0.13), i('Spinach', 'g', 0.022, 0.029), i('Tomatoes', 'g', 0.012, 0.009),
  i('Walnuts', 'g', 0.067, 0.15), i('White fish', 'g', 0, 0.2, false), i('Wholemeal bread', 'slices', 2.5, 4.5),
]
export const ingredient = (name: string) => INGREDIENTS.find((x) => x.name === name) ?? INGREDIENTS[0]
export const AMOUNTS: Record<string, number[]> = {
  g: [5, 10, 20, 30, 50, 75, 100, 150, 200, 250, 300], ml: [50, 100, 150, 200, 250, 300],
  whole: [0.5, 1, 1.5, 2, 3], slices: [0.5, 1, 1.5, 2, 3],
}

export type Item = { name: string; qty: number }
// A logged meal: a DK recipe (slug), or the user's own meal (name + items). readyAt is set while "Calculating nutritional info…".
export type LogEntry = { id: string; date: string; slug?: string; name?: string; items?: Item[]; readyAt?: number }

// Null while the meal is still being calculated, so it adds nothing to the day yet.
export function entryStats(e: LogEntry): Stats | null {
  if (e.slug) return recipeStats[e.slug] ?? s(0, 0, 0, 0.5)
  if (e.readyAt) return null
  const items = e.items ?? []
  const sum = (k: 'fibre' | 'protein') => Math.round(items.reduce((t, x) => t + ingredient(x.name)[k] * x.qty, 0))
  const plants = items.filter((x) => ingredient(x.name).plant).length
  return { fibre: sum('fibre'), protein: sum('protein'), plants, inflam: items.length ? (0.6 * (items.length - plants)) / items.length : 0.5 }
}

// "Your recipes" for the From your recipes dropdown (05_Progress/12).
export const yourRecipes: { name: string; items: Item[] }[] = [
  { name: 'Scrambled eggs on toast', items: [{ name: 'Avocado', qty: 0.5 }, { name: 'Butter', qty: 5 }, { name: 'Eggs', qty: 2 }, { name: 'Wholemeal bread', qty: 1.5 }] },
  { name: 'Porridge with Blueberries', items: [{ name: 'Porridge oats (rolled)', qty: 50 }, { name: 'Milk (dairy)', qty: 200 }, { name: 'Blueberries', qty: 75 }] },
  { name: 'Tomato fish with buckwheat', items: [{ name: 'White fish', qty: 150 }, { name: 'Tomatoes', qty: 200 }, { name: 'Buckwheat', qty: 75 }] },
  { name: 'Chocolate chia pudding', items: [{ name: 'Chia seeds', qty: 30 }, { name: 'Cacao powder', qty: 10 }, { name: 'Milk (dairy)', qty: 200 }, { name: 'Banana', qty: 1 }] },
  { name: 'Butternut Bean Chilli', items: [{ name: 'Butternut squash', qty: 200 }, { name: 'Kidney beans', qty: 150 }, { name: 'Tomatoes', qty: 200 }, { name: 'Spinach', qty: 50 }] },
]

// Route D (Describe the meal): a keyword guess standing in for the live app's AI.
const GUESSES: [RegExp, Item[]][] = [
  [/blueberr/, [{ name: 'Blueberries', qty: 50 }]], [/porridge|oat/, [{ name: 'Milk (dairy)', qty: 200 }, { name: 'Porridge oats (rolled)', qty: 50 }]],
  [/walnut/, [{ name: 'Walnuts', qty: 20 }]], [/egg/, [{ name: 'Eggs', qty: 2 }]], [/toast|bread/, [{ name: 'Wholemeal bread', qty: 1.5 }]],
  [/avocado/, [{ name: 'Avocado', qty: 0.5 }]], [/fish/, [{ name: 'White fish', qty: 150 }]], [/tomato/, [{ name: 'Tomatoes', qty: 200 }]],
  [/chia/, [{ name: 'Chia seeds', qty: 30 }]], [/banana/, [{ name: 'Banana', qty: 1 }]], [/spinach/, [{ name: 'Spinach', qty: 50 }]],
  [/chicken/, [{ name: 'Chicken breast', qty: 150 }]], [/bean/, [{ name: 'Kidney beans', qty: 150 }]], [/squash|butternut/, [{ name: 'Butternut squash', qty: 200 }]],
]
export function guessItems(text: string): Item[] {
  const t = text.toLowerCase()
  const items = GUESSES.filter(([re]) => re.test(t)).flatMap(([, xs]) => xs)
  // UX issue Progress !10: the guess adds butter that was not in the description, and nothing says amounts are estimates.
  if (items.length && !items.some((x) => x.name === 'Butter')) items.push({ name: 'Butter', qty: 5 })
  return items
}
// UX issue Progress !9: the title is cut down from what was typed (first three words).
export const shortTitle = (text: string) => text.trim().split(/\s+/).slice(0, 3).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')

// Earlier days this week have a few meals so the week strip and plant points are not all empty. Today starts empty (05_Progress/01).
export const initialLog = (): LogEntry[] => [
  { id: 'l1', date: addDays(todayIso(), -1), slug: 'chickpea-herb-salad' },
  { id: 'l2', date: addDays(todayIso(), -1), slug: 'lentil-roast-veg-soup' },
  { id: 'l3', date: addDays(todayIso(), -2), name: 'Scrambled eggs on toast', items: yourRecipes[0].items },
]
