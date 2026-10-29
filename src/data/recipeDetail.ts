// Detail for every recipe (description, timings, ingredient lines, method). Most are made up from recipes.ts, picked
// from a generic pool so each recipe looks plausible. Recipes in REAL use the ingredients and method supplied by DK.
import type { Recipe } from './recipes'
import { cookalong } from './cookalong'

export type Line = { qty: number; unit: 'g' | 'ml' | 'tbsp' | 'tsp' | 'x' | 'can'; name: string; note?: string }
const POOL: Line[] = [
  { qty: 2, unit: 'tbsp', name: 'olive oil' }, { qty: 1, unit: 'x', name: 'red onion' }, { qty: 3, unit: 'x', name: 'garlic cloves' },
  { qty: 1, unit: 'tsp', name: 'ground cumin' }, { qty: 400, unit: 'g', name: 'tinned chickpeas' }, { qty: 2, unit: 'x', name: 'celery sticks' },
  { qty: 200, unit: 'g', name: 'cherry tomatoes' }, { qty: 1, unit: 'x', name: 'lemon' }, { qty: 2, unit: 'tsp', name: 'sumac' },
  { qty: 100, unit: 'g', name: 'baby spinach' }, { qty: 250, unit: 'ml', name: 'vegetable stock' }, { qty: 20, unit: 'g', name: 'fresh parsley' },
  { qty: 1, unit: 'tsp', name: 'smoked paprika' }, { qty: 150, unit: 'g', name: 'Greek yoghurt' }, { qty: 30, unit: 'g', name: 'toasted seeds' },
  { qty: 1, unit: 'tbsp', name: 'tahini' }, { qty: 2, unit: 'x', name: 'carrots' }, { qty: 400, unit: 'ml', name: 'coconut milk' },
]
// The recipe's main ingredient always comes first, so the list matches the title.
const MAIN: Record<string, Line> = {
  Chicken: { qty: 500, unit: 'g', name: 'chicken thighs' }, Fish: { qty: 2, unit: 'x', name: 'fish fillets' },
  'Tofu and Tempeh': { qty: 280, unit: 'g', name: 'firm tofu' }, Legumes: { qty: 400, unit: 'g', name: 'tinned beans or lentils' },
  Nuts: { qty: 100, unit: 'g', name: 'cashews' }, Fruit: { qty: 150, unit: 'g', name: 'mixed fruit' },
  Vegetables: { qty: 500, unit: 'g', name: 'seasonal vegetables' }, Eggs: { qty: 4, unit: 'x', name: 'eggs' },
}
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export type Detail = {
  description: string; prep: number; cook: number; freezer: boolean; shelf: string
  groups: { title: string; lines: Line[] }[]; steps: string[]
}

const l = (qty: number, unit: Line['unit'], name: string, note?: string): Line => ({ qty, unit, name, note })
// Ingredients supplied by DK (pasted in by the design team), keyed by recipe slug. The method comes from the cook-along.
const REAL: Record<string, Detail['groups']> = {
  'one-pan-harissa-chicken-pasta': [
    { title: 'Ingredients', lines: [
      l(1, 'tbsp', 'olive oil'), l(500, 'g', 'chicken thigh', '(boneless and skinless)'), l(150, 'g', 'white onion', 'diced'),
      l(3, 'x', 'garlic cloves', 'grated'), l(3, 'tbsp', 'harissa paste', "(adjust depending on how spicy you like it)"),
      l(1, 'tbsp', 'tomato puree'), l(1, 'tsp', 'cumin (ground)'), l(200, 'g', 'courgette', 'diced'),
      l(1, 'can', 'chickpeas (can)', 'drained and rinsed'), l(200, 'g', 'baby tomatoes', 'halved'), l(200, 'g', 'lentil pasta'),
      l(580, 'ml', 'chicken stock'), l(150, 'g', 'baby spinach'), l(0.5, 'x', 'lemon', 'juiced'),
    ] },
    { title: 'To serve (optional)', lines: [l(150, 'g', 'greek yoghurt'), l(15, 'g', 'parsley', 'roughly chopped')] },
  ],
}

export function detailFor(r: Recipe): Detail {
  const real = REAL[r.slug]
  const generated = generate(r)
  return real ? { ...generated, groups: real, steps: cookalong[r.slug]?.steps.map((x) => x.text) ?? generated.steps } : generated
}

function generate(r: Recipe): Detail {
  const h = hash(r.slug)
  const lines = [MAIN[r.mainIngredient] ?? POOL[0], ...Array.from({ length: r.ingredients - 1 }, (_, i) => POOL[(h + i * 7) % POOL.length])]
    .filter((l, i, a) => a.findIndex((x) => x.name === l.name) === i)
  const split = Math.max(2, Math.ceil(lines.length / 3))
  const prep = Math.max(5, Math.round((r.mins * 0.3) / 5) * 5)
  return {
    description: `Placeholder description for ${r.title}. The live app opens each recipe with a short personal note from Dr Rupy about where the dish comes from and why it is good for you; that text is not copied into the prototype, so this paragraph stands in for it and is long enough to show how the Read more control works.`,
    prep, cook: Math.max(0, r.mins - prep),
    freezer: r.categories.includes('Batch Cook') || r.mealType === 'Dinner',
    shelf: r.mealType === 'Drink' ? 'Best fresh' : '3 days in the fridge',
    groups: [{ title: 'For the marinade', lines: lines.slice(0, split) }, { title: `For the ${r.mealType === 'Drink' ? 'smoothie' : 'dish'}`, lines: lines.slice(split) }],
    steps: [
      'Gather and prepare your ingredients.',
      `Placeholder step: mix the marinade ingredients together and coat the ${(MAIN[r.mainIngredient] ?? POOL[0]).name}.`,
      'Placeholder step: cook the base of the dish until softened.',
      'Placeholder step: add the remaining ingredients and cook until done.',
      'Placeholder step: finish with fresh herbs and serve.',
    ],
  }
}

// Amounts scaled by servings (the base recipe serves 2) and shown in metric or imperial.
export function amount(l: Line, serves: number, imperial: boolean) {
  const q = (l.qty * serves) / 2
  const nice = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1).replace(/\.0$/, ''))
  if (l.unit === 'x') return nice(q)
  if (l.unit === 'can') return `${nice(q)} ${q > 1 ? 'cans' : 'can'}`
  if (imperial && l.unit === 'g') return `${nice(Math.round((q / 28.35) * 2) / 2)} oz`
  if (imperial && l.unit === 'ml') return `${nice(Math.round((q / 29.57) * 2) / 2)} fl oz`
  return `${nice(q)} ${l.unit}`
}
