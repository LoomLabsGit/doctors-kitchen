// Mock saved recipes, as seen on Saved home (04_Saved/01). Recipes are referenced by slug from recipes.ts.
export type Collection = { id: string; name: string; slugs: string[] }

export const initialCollections: Collection[] = [
  { id: 'favourites', name: 'Favourites', slugs: ['herby-butter-bean-eggs', 'salmon-peach-ginger-traybake', 'tuna-fennel-walnut-pasta', 'strawberry-chia-pudding', 'blackberry-cacao-smoothie'] },
  { id: 'want-to-cook', name: 'Want to cook', slugs: ['sri-lankan-cashew-curry', 'crispy-sumac-chicken', 'spicy-snapper-red-curry', 'one-pan-harissa-chicken-pasta'] },
  { id: 'regulars', name: 'Regulars', slugs: ['herby-butter-bean-eggs', 'salmon-peach-ginger-traybake', 'tuna-fennel-walnut-pasta'] },
]

// The two fixed lists come from the user's activity, not from collections, so they cannot be renamed or deleted.
export const initialRated: Record<string, number> = { 'miso-greens-tofu-rice-bowl': 5 }
export const initialCooked = ['coconut-chicken-lentil-daal', 'chickpea-herb-salad', 'salmon-peach-ginger-traybake', 'one-pan-harissa-chicken-pasta', 'miso-greens-tofu-rice-bowl']
