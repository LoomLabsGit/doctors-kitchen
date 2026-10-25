// Mock data. Photos are replaced by gradient placeholders: do not copy the real recipe photos into the repo.
export type Recipe = {
  slug: string; title: string; mins: number; ingredients: number; rating?: number
  isNew?: boolean; cuisine: string; mainIngredient: string; mealType: string
  categories: string[]; allergens: string[]; diet: string[]; hue: number
}
const r = (p: Partial<Recipe> & Pick<Recipe, 'slug' | 'title'>): Recipe => ({
  mins: 30, ingredients: 10, cuisine: 'British', mainIngredient: 'Chicken', mealType: 'Dinner',
  categories: [], allergens: [], diet: [], hue: 40, ...p,
})
export const recipes: Recipe[] = [
  r({ slug: 'coconut-chicken-lentil-daal', title: 'No-chop Coconut Chicken and Lentil Daal', mins: 44, ingredients: 11, rating: 4.8, isNew: true, cuisine: 'Sri Lankan', categories: ['High Protein', 'One Pots'], hue: 80 }),
  r({ slug: 'miso-greens-tofu-rice-bowl', title: 'Miso Greens and Tofu Rice Bowl', mins: 35, ingredients: 16, rating: 4.5, isNew: true, mainIngredient: 'Tofu and Tempeh', diet: ['Vegan', 'Vegetarian'], allergens: ['Soy'], hue: 140 }),
  r({ slug: 'salmon-peach-ginger-traybake', title: 'Salmon, Peach and Ginger Traybake', mins: 35, ingredients: 15, rating: 4.7, mainIngredient: 'Fish', allergens: ['Fish'], hue: 20 }),
  r({ slug: 'herby-butter-bean-eggs', title: 'Herby Butter Bean Eggs', mins: 25, ingredients: 9, rating: 4.6, mealType: 'Breakfast', mainIngredient: 'Legumes', allergens: ['Eggs'], hue: 100 }),
  r({ slug: 'sri-lankan-cashew-curry', title: 'Sri Lankan Cashew Curry', mins: 40, ingredients: 14, rating: 4.6, cuisine: 'Sri Lankan', mainIngredient: 'Nuts', allergens: ['Nuts'], diet: ['Vegan'], hue: 50 }),
  r({ slug: 'spicy-snapper-red-curry', title: 'Spicy Snapper Red Curry', mins: 35, ingredients: 13, rating: 5.0, cuisine: 'Sri Lankan', mainIngredient: 'Fish', allergens: ['Fish'], hue: 10 }),
  r({ slug: 'blackberry-cacao-smoothie', title: 'Blackberry and Cacao Smoothie', mins: 5, ingredients: 7, isNew: true, mealType: 'Drink', mainIngredient: 'Fruit', diet: ['Vegan'], hue: 330 }),
  r({ slug: 'pina-colada-smoothie', title: 'Piña Colada Smoothie', mins: 5, ingredients: 6, rating: 5.0, isNew: true, mealType: 'Drink', mainIngredient: 'Fruit', diet: ['Vegan'], hue: 60 }),
  r({ slug: 'one-pan-harissa-chicken-pasta', title: 'One-Pan Harissa Chicken and Chickpea Pasta', mins: 50, ingredients: 16, rating: 4.7, isNew: true, categories: ['One Pots', 'High Protein', 'Kid Friendly'], allergens: ['Gluten'], hue: 15 }),
  r({ slug: 'strawberry-chia-pudding', title: 'Strawberry Chia Pudding', mins: 25, ingredients: 5, rating: 4.8, mealType: 'Breakfast', mainIngredient: 'Fruit', diet: ['Vegan'], hue: 350 }),
  r({ slug: 'crispy-sumac-chicken', title: 'Crispy Sumac Chicken', mins: 65, ingredients: 14, rating: 4.7, hue: 30, categories: ['Batch Cook'] }),
  r({ slug: 'tuna-fennel-walnut-pasta', title: 'Tuna, Fennel and Walnut Pasta', mins: 25, ingredients: 11, rating: 5.0, mainIngredient: 'Fish', categories: ['Under 30mins'], allergens: ['Fish', 'Nuts', 'Gluten'], hue: 90 }),
  // Added for Plan: lunches and extra breakfasts so every meal slot has something to pick from.
  r({ slug: 'green-shakshuka', title: 'Green Shakshuka', mins: 20, ingredients: 9, rating: 4.6, mealType: 'Breakfast', mainIngredient: 'Legumes', allergens: ['Eggs'], diet: ['Vegetarian'], categories: ['Under 30mins'], hue: 110 }),
  r({ slug: 'overnight-oats-berries', title: 'Overnight Oats with Berries', mins: 10, ingredients: 6, rating: 4.4, mealType: 'Breakfast', mainIngredient: 'Fruit', allergens: ['Gluten'], diet: ['Vegan'], categories: ['Batch Cook', 'Kid Friendly'], hue: 280 }),
  r({ slug: 'chickpea-herb-salad', title: 'Chickpea and Herb Salad', mins: 15, ingredients: 8, rating: 4.5, mealType: 'Lunch', mainIngredient: 'Legumes', diet: ['Vegan'], categories: ['Under 30mins'], hue: 75 }),
  r({ slug: 'lentil-roast-veg-soup', title: 'Lentil and Roast Veg Soup', mins: 45, ingredients: 12, rating: 4.7, mealType: 'Lunch', mainIngredient: 'Legumes', diet: ['Vegan'], categories: ['Batch Cook', 'One Pots'], hue: 25 }),
  r({ slug: 'smoked-mackerel-rye-toast', title: 'Smoked Mackerel Rye Toast', mins: 10, ingredients: 7, rating: 4.3, mealType: 'Lunch', mainIngredient: 'Fish', allergens: ['Fish', 'Gluten'], categories: ['High Protein', 'Under 30mins'], hue: 200 }),
]
export const cuisines = ['Sri Lankan', 'British', 'Vietnamese', 'Indian', 'Italian', 'Middle Eastern', 'Mexican', 'Japanese']
export const ingredientsIndex = ['Chicken', 'Tofu and Tempeh', 'Legumes', 'Fish', 'Nuts', 'Fruit']
export const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Side', 'Dessert', 'Baking', 'Condiment', 'Drink']
export const categories = ['Batch Cook', 'High Protein', 'Kid Friendly', 'One Pots', 'Under 30mins']
export const allergens = ['Dairy', 'Eggs', 'Fish', 'Gluten', 'Nuts', 'Peanuts', 'Shellfish', 'Soy']
export const diets = ['Pescatarian', 'Vegan', 'Vegetarian']
