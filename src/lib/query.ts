import { recipes } from '../data/recipes'
import type { Filters } from './filters'

export function applyFilters(f: Filters, opts: { q?: string; cuisine?: string; ingredient?: string; meal?: string; cat?: string } = {}) {
  let out = recipes.filter((r) =>
    (!opts.q || (r.title + r.mainIngredient).toLowerCase().includes(opts.q.toLowerCase())) &&
    (!opts.cuisine || r.cuisine === opts.cuisine) &&
    (!opts.ingredient || r.mainIngredient === opts.ingredient) &&
    (!opts.meal || r.mealType === opts.meal) &&
    (!opts.cat || r.categories.includes(opts.cat)) &&
    f.avoid.every((a) => !r.allergens.includes(a)) &&
    f.diet.every((d) => r.diet.includes(d)) &&
    (!f.meal.length || f.meal.includes(r.mealType)) &&
    f.cats.every((c) => r.categories.includes(c)))
  if (f.sort === 'Highest rated') out = [...out].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  if (f.sort === 'Fewest ingredients') out = [...out].sort((a, b) => a.ingredients - b.ingredients)
  return out
}
