// Mock data. Photos are replaced by gradient placeholders: do not copy the real recipe photos into the repo.
export type Recipe = {
  slug: string; title: string; mins: number; ingredients: number; rating?: number
  isNew?: boolean; cuisine: string; mainIngredient: string; mealType: string
  categories: string[]; allergens: string[]; diet: string[]; hue: number
  // A real photo from public/local/ (git-ignored, on this machine only). Without the file the gradient shows instead.
  image?: string
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
  r({ slug: 'one-pan-harissa-chicken-pasta', title: 'One-Pan Harissa Chicken and Chickpea Pasta', mins: 50, ingredients: 16, rating: 4.7, isNew: true, categories: ['One Pots', 'High Protein', 'Kid Friendly'], allergens: ['Gluten'], hue: 15, image: '/local/harissa/hero.webp' }),
  r({ slug: 'strawberry-chia-pudding', title: 'Strawberry Chia Pudding', mins: 25, ingredients: 5, rating: 4.8, mealType: 'Breakfast', mainIngredient: 'Fruit', diet: ['Vegan'], hue: 350 }),
  r({ slug: 'crispy-sumac-chicken', title: 'Crispy Sumac Chicken', mins: 65, ingredients: 14, rating: 4.7, hue: 30, categories: ['Batch Cook'] }),
  r({ slug: 'tuna-fennel-walnut-pasta', title: 'Tuna, Fennel and Walnut Pasta', mins: 25, ingredients: 11, rating: 5.0, mainIngredient: 'Fish', categories: ['Under 30mins'], allergens: ['Fish', 'Nuts', 'Gluten'], hue: 90 }),
  // Added for Plan: lunches and extra breakfasts so every meal slot has something to pick from.
  r({ slug: 'green-shakshuka', title: 'Green Shakshuka', mins: 20, ingredients: 9, rating: 4.6, mealType: 'Breakfast', mainIngredient: 'Legumes', allergens: ['Eggs'], diet: ['Vegetarian'], categories: ['Under 30mins'], hue: 110 }),
  r({ slug: 'overnight-oats-berries', title: 'Overnight Oats with Berries', mins: 10, ingredients: 6, rating: 4.4, mealType: 'Breakfast', mainIngredient: 'Fruit', allergens: ['Gluten'], diet: ['Vegan'], categories: ['Batch Cook', 'Kid Friendly'], hue: 280 }),
  r({ slug: 'chickpea-herb-salad', title: 'Chickpea and Herb Salad', mins: 15, ingredients: 8, rating: 4.5, mealType: 'Lunch', mainIngredient: 'Legumes', diet: ['Vegan'], categories: ['Under 30mins'], hue: 75 }),
  r({ slug: 'lentil-roast-veg-soup', title: 'Lentil and Roast Veg Soup', mins: 45, ingredients: 12, rating: 4.7, mealType: 'Lunch', mainIngredient: 'Legumes', diet: ['Vegan'], categories: ['Batch Cook', 'One Pots'], hue: 25 }),
  r({ slug: 'smoked-mackerel-rye-toast', title: 'Smoked Mackerel Rye Toast', mins: 10, ingredients: 7, rating: 4.3, mealType: 'Lunch', mainIngredient: 'Fish', allergens: ['Fish', 'Gluten'], categories: ['High Protein', 'Under 30mins'], hue: 200 }),
  // Made-up recipes so search and filters return realistic numbers. Rows: title, mins, ingredients, rating (0 = none),
  // meal type, cuisine, main ingredient, categories, allergens, diet (comma-separated).
  ...([
    ['Chicken Shawarma Traybake', 45, 13, 4.7, 'Dinner', 'Middle Eastern', 'Chicken', 'High Protein,Batch Cook', 'Dairy', ''],
    ['Lemongrass Chicken Noodle Bowl', 30, 14, 4.5, 'Dinner', 'Vietnamese', 'Chicken', 'High Protein', 'Soy,Gluten', ''],
    ['Chicken Tikka with Spiced Lentils', 50, 16, 4.8, 'Dinner', 'Indian', 'Chicken', 'High Protein,One Pots', 'Dairy', ''],
    ['Miso Chicken Thighs with Greens', 35, 10, 4.6, 'Dinner', 'Japanese', 'Chicken', 'High Protein', 'Soy', ''],
    ['Chicken and White Bean Cacciatore', 55, 13, 4.6, 'Dinner', 'Italian', 'Chicken', 'One Pots,Batch Cook,Kid Friendly', '', ''],
    ['Chipotle Chicken Burrito Bowls', 35, 15, 4.7, 'Lunch', 'Mexican', 'Chicken', 'High Protein,Kid Friendly', '', ''],
    ['Sri Lankan Chicken and Pumpkin Curry', 60, 17, 4.9, 'Dinner', 'Sri Lankan', 'Chicken', 'Batch Cook,One Pots', '', ''],
    ['Herby Roast Chicken with Root Veg', 75, 11, 4.5, 'Dinner', 'British', 'Chicken', 'Kid Friendly', '', ''],
    ['Chicken Pho with Charred Ginger', 50, 14, 0, 'Dinner', 'Vietnamese', 'Chicken', 'High Protein', 'Fish', ''],
    ['Chicken Caesar Salad with Crispy Chickpeas', 25, 12, 4.3, 'Lunch', 'British', 'Chicken', 'High Protein', 'Eggs,Dairy,Fish', ''],
    ['Miso-Glazed Salmon with Sesame Greens', 25, 9, 4.8, 'Dinner', 'Japanese', 'Fish', 'High Protein', 'Fish,Soy', ''],
    ['Goan Fish Curry', 40, 15, 4.7, 'Dinner', 'Indian', 'Fish', 'One Pots', 'Fish', ''],
    ['Mackerel, Beetroot and Lentil Salad', 20, 10, 4.4, 'Lunch', 'British', 'Fish', 'High Protein', 'Fish', ''],
    ['Baked Cod with Tomatoes and Olives', 30, 10, 4.6, 'Dinner', 'Italian', 'Fish', 'One Pots', 'Fish', ''],
    ['Fish Tacos with Lime Slaw', 30, 14, 4.7, 'Dinner', 'Mexican', 'Fish', 'Kid Friendly', 'Fish,Gluten', ''],
    ['Prawn and Coconut Noodle Soup', 40, 18, 4.8, 'Dinner', 'Vietnamese', 'Fish', '', 'Shellfish,Gluten,Soy', ''],
    ['Salmon and Sweet Potato Fishcakes', 45, 11, 4.5, 'Dinner', 'British', 'Fish', 'Kid Friendly,Batch Cook', 'Fish,Eggs,Gluten', ''],
    ['Sardines on Rye with Tomato Salsa', 10, 7, 0, 'Breakfast', 'British', 'Fish', 'High Protein', 'Fish,Gluten', ''],
    ['Tuna Poke Bowl', 20, 13, 4.6, 'Lunch', 'Japanese', 'Fish', 'High Protein', 'Fish,Soy', ''],
    ['Sri Lankan Prawn Curry', 35, 15, 4.8, 'Dinner', 'Sri Lankan', 'Fish', '', 'Shellfish', ''],
    ['Crispy Tofu with Peanut Sauce', 30, 13, 4.6, 'Dinner', 'Vietnamese', 'Tofu and Tempeh', 'High Protein', 'Soy,Peanuts', 'Vegan'],
    ['Tempeh and Aubergine Curry', 45, 16, 4.5, 'Dinner', 'Sri Lankan', 'Tofu and Tempeh', 'One Pots', 'Soy', 'Vegan'],
    ['Teriyaki Tofu Rice Bowls', 30, 11, 4.4, 'Dinner', 'Japanese', 'Tofu and Tempeh', 'Kid Friendly', 'Soy,Gluten', 'Vegan'],
    ['Tofu Scramble with Spinach', 15, 9, 4.3, 'Breakfast', 'British', 'Tofu and Tempeh', 'High Protein', 'Soy', 'Vegan'],
    ['Smoky Tempeh Tacos', 25, 12, 4.5, 'Dinner', 'Mexican', 'Tofu and Tempeh', 'High Protein', 'Soy,Gluten', 'Vegan'],
    ['Silken Tofu with Mushrooms and Chilli Oil', 30, 14, 4.6, 'Dinner', 'Japanese', 'Tofu and Tempeh', '', 'Soy', 'Vegan'],
    ['Tofu Tikka Masala', 40, 15, 4.7, 'Dinner', 'Indian', 'Tofu and Tempeh', 'High Protein,Batch Cook', 'Soy', 'Vegan'],
    ['Black Bean Chilli', 50, 14, 4.8, 'Dinner', 'Mexican', 'Legumes', 'Batch Cook,One Pots,Kid Friendly', '', 'Vegan'],
    ['Chana Masala', 35, 13, 4.7, 'Dinner', 'Indian', 'Legumes', 'One Pots,Batch Cook', '', 'Vegan'],
    ['Red Lentil Dhal with Crispy Onions', 35, 12, 4.9, 'Dinner', 'Indian', 'Legumes', 'One Pots,Batch Cook', '', 'Vegan'],
    ['Falafel Bowls with Tahini Dressing', 40, 16, 4.6, 'Lunch', 'Middle Eastern', 'Legumes', 'High Protein', '', 'Vegan'],
    ['Minestrone with Borlotti Beans', 50, 15, 4.5, 'Lunch', 'Italian', 'Legumes', 'Batch Cook,One Pots', 'Gluten', 'Vegan'],
    ['Chickpea Shakshuka', 30, 10, 4.6, 'Breakfast', 'Middle Eastern', 'Legumes', 'One Pots', 'Eggs', 'Vegetarian'],
    ['Huevos Rancheros with Pinto Beans', 25, 11, 4.5, 'Breakfast', 'Mexican', 'Legumes', '', 'Eggs', 'Vegetarian'],
    ['Lentil Bolognese', 55, 13, 4.7, 'Dinner', 'Italian', 'Legumes', 'Batch Cook,Kid Friendly', 'Gluten', 'Vegan'],
    ['Sri Lankan Dhal Curry', 30, 12, 4.8, 'Dinner', 'Sri Lankan', 'Legumes', 'One Pots', '', 'Vegan'],
    ['Butter Bean and Kale Stew', 35, 11, 4.4, 'Dinner', 'British', 'Legumes', 'One Pots', '', 'Vegan'],
    ['Edamame and Soba Noodle Salad', 20, 12, 0, 'Lunch', 'Japanese', 'Legumes', '', 'Soy,Gluten', 'Vegan'],
    ['Smoky Hummus with Roast Veg', 15, 8, 4.5, 'Snack', 'Middle Eastern', 'Legumes', '', '', 'Vegan'],
    ['Crispy Spiced Chickpeas', 30, 5, 4.2, 'Snack', 'Indian', 'Legumes', 'Kid Friendly', '', 'Vegan'],
    ['Cashew and Cauliflower Korma', 45, 16, 4.7, 'Dinner', 'Indian', 'Nuts', 'Batch Cook', 'Nuts', 'Vegan'],
    ['Walnut and Mushroom Ragu', 40, 13, 4.5, 'Dinner', 'Italian', 'Nuts', '', 'Nuts,Gluten', 'Vegan'],
    ['Almond Butter Energy Balls', 15, 6, 4.6, 'Snack', 'British', 'Nuts', 'Kid Friendly', 'Nuts', 'Vegan'],
    ['Pistachio and Herb Freekeh Salad', 25, 12, 4.4, 'Lunch', 'Middle Eastern', 'Nuts', '', 'Nuts,Gluten', 'Vegan'],
    ['Peanut Satay Noodles', 20, 12, 4.6, 'Dinner', 'Vietnamese', 'Nuts', 'Kid Friendly', 'Peanuts,Soy,Gluten', 'Vegan'],
    ['Spiced Nut and Seed Granola', 35, 9, 4.7, 'Breakfast', 'British', 'Nuts', 'Batch Cook', 'Nuts', 'Vegan'],
    ['Pesto Pasta with Greens', 20, 9, 4.5, 'Dinner', 'Italian', 'Nuts', 'Kid Friendly', 'Nuts,Dairy,Gluten', 'Vegetarian'],
    ['Berry and Oat Breakfast Bars', 40, 8, 4.4, 'Baking', 'British', 'Fruit', 'Kid Friendly,Batch Cook', 'Gluten,Nuts', 'Vegan'],
    ['Mango Lassi Smoothie', 5, 5, 4.6, 'Drink', 'Indian', 'Fruit', '', 'Dairy', 'Vegetarian'],
    ['Green Kiwi Smoothie', 5, 6, 0, 'Drink', 'British', 'Fruit', '', '', 'Vegan'],
    ['Baked Apples with Cinnamon Yoghurt', 35, 6, 4.5, 'Dessert', 'British', 'Fruit', 'Kid Friendly', 'Dairy', 'Vegetarian'],
    ['Banana and Walnut Bread', 65, 9, 4.8, 'Baking', 'British', 'Fruit', 'Batch Cook', 'Gluten,Eggs,Nuts', 'Vegetarian'],
    ['Chocolate Avocado Mousse', 10, 6, 4.4, 'Dessert', 'Mexican', 'Fruit', '', '', 'Vegan'],
    ['Pear and Ginger Crumble', 50, 9, 4.6, 'Dessert', 'British', 'Fruit', 'Kid Friendly', 'Gluten,Nuts', 'Vegan'],
    ['Tropical Fruit Salad with Lime', 10, 6, 4.2, 'Snack', 'Sri Lankan', 'Fruit', 'Kid Friendly', '', 'Vegan'],
    ['Matcha Chia Pudding', 10, 5, 4.3, 'Breakfast', 'Japanese', 'Fruit', '', '', 'Vegan'],
    ['Masala Chai Oats', 15, 8, 4.4, 'Breakfast', 'Indian', 'Fruit', '', 'Gluten,Dairy', 'Vegetarian'],
    ['Roasted Cauliflower Steaks with Tahini', 40, 10, 4.5, 'Dinner', 'Middle Eastern', 'Vegetables', '', '', 'Vegan'],
    ['Aubergine Parmigiana', 70, 12, 4.7, 'Dinner', 'Italian', 'Vegetables', 'Batch Cook', 'Dairy,Gluten', 'Vegetarian'],
    ['Sweet Potato and Spinach Curry', 35, 13, 4.6, 'Dinner', 'Indian', 'Vegetables', 'One Pots,Batch Cook', '', 'Vegan'],
    ['Vietnamese Summer Rolls', 30, 14, 4.5, 'Lunch', 'Vietnamese', 'Vegetables', '', 'Soy,Peanuts', 'Vegan'],
    ['Roasted Tomato Soup', 45, 8, 4.4, 'Lunch', 'British', 'Vegetables', 'Batch Cook,Kid Friendly', '', 'Vegan'],
    ['Stuffed Peppers with Quinoa', 50, 12, 4.3, 'Dinner', 'Mexican', 'Vegetables', 'Kid Friendly', 'Dairy', 'Vegetarian'],
    ['Miso Roasted Aubergine', 35, 7, 4.6, 'Side', 'Japanese', 'Vegetables', '', 'Soy', 'Vegan'],
    ['Garlicky Greens with Chilli', 10, 5, 4.4, 'Side', 'Italian', 'Vegetables', '', '', 'Vegan'],
    ['Beetroot and Feta Salad', 15, 8, 4.3, 'Side', 'Middle Eastern', 'Vegetables', '', 'Dairy', 'Vegetarian'],
    ['Spiced Carrot and Lentil Soup', 40, 10, 4.6, 'Lunch', 'Indian', 'Vegetables', 'Batch Cook', '', 'Vegan'],
    ['Sri Lankan Coconut Roti', 30, 5, 4.6, 'Side', 'Sri Lankan', 'Vegetables', '', 'Gluten', 'Vegan'],
    ['Mushroom and Spinach Omelette', 15, 7, 4.3, 'Breakfast', 'British', 'Eggs', 'High Protein', 'Eggs,Dairy', 'Vegetarian'],
    ['Japanese Rolled Omelette', 15, 6, 0, 'Breakfast', 'Japanese', 'Eggs', '', 'Eggs,Soy', 'Vegetarian'],
    ['Turmeric Eggs on Toast', 10, 7, 4.4, 'Breakfast', 'Indian', 'Eggs', 'High Protein', 'Eggs,Gluten', 'Vegetarian'],
    ['Spinach and Feta Frittata', 30, 8, 4.5, 'Lunch', 'Middle Eastern', 'Eggs', 'Batch Cook,Kid Friendly', 'Eggs,Dairy', 'Vegetarian'],
    ['Green Chilli Sambol', 10, 6, 4.7, 'Condiment', 'Sri Lankan', 'Vegetables', '', '', 'Vegan'],
    ['Coriander and Mint Chutney', 10, 7, 4.5, 'Condiment', 'Indian', 'Vegetables', '', '', 'Vegan'],
    ['Tahini Lemon Dressing', 5, 5, 4.6, 'Condiment', 'Middle Eastern', 'Vegetables', '', '', 'Vegan'],
    ['Salsa Verde', 10, 8, 4.4, 'Condiment', 'Italian', 'Vegetables', '', 'Fish', 'Pescatarian'],
    ['Seeded Oat Crackers', 60, 7, 4.5, 'Baking', 'British', 'Nuts', 'Batch Cook', 'Gluten', 'Vegan'],
    ['Spiced Hot Chocolate', 10, 6, 4.5, 'Drink', 'Mexican', 'Nuts', '', 'Dairy', 'Vegetarian'],
    ['Coffee and Banana Smoothie', 5, 5, 0, 'Drink', 'Vietnamese', 'Fruit', '', 'Dairy', 'Vegetarian'],
  ] as [string, number, number, number, string, string, string, string, string, string][]).map(([title, mins, ingredients, rating, mealType, cuisine, mainIngredient, cats, allergens, diet], i) => r({
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), title, mins, ingredients, rating: rating || undefined,
    isNew: i % 5 < 3, mealType, cuisine, mainIngredient, hue: (i * 37) % 360,
    categories: cats ? cats.split(',') : [], allergens: allergens ? allergens.split(',') : [], diet: diet ? diet.split(',') : [],
  })),
].map(tidy)

// Keeps tags consistent so filters behave: vegan counts as vegetarian, vegetarian and meat-free fish dishes as pescatarian,
// and anything 30 minutes or under is in "Under 30mins".
function tidy(x: Recipe): Recipe {
  const diet = new Set(x.diet)
  if (diet.has('Vegan')) diet.add('Vegetarian')
  if (diet.has('Vegetarian') || x.mainIngredient === 'Fish') diet.add('Pescatarian')
  const categories = x.mins <= 30 && !x.categories.includes('Under 30mins') ? [...x.categories, 'Under 30mins'] : x.categories
  return { ...x, diet: ['Pescatarian', 'Vegan', 'Vegetarian'].filter((d) => diet.has(d)), categories }
}
export const cuisines = ['Sri Lankan', 'British', 'Vietnamese', 'Indian', 'Italian', 'Middle Eastern', 'Mexican', 'Japanese']
export const ingredientsIndex = ['Chicken', 'Tofu and Tempeh', 'Legumes', 'Fish', 'Nuts', 'Fruit', 'Vegetables', 'Eggs']
export const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Side', 'Dessert', 'Baking', 'Condiment', 'Drink']
export const categories = ['Batch Cook', 'High Protein', 'Kid Friendly', 'One Pots', 'Under 30mins']
export const allergens = ['Dairy', 'Eggs', 'Fish', 'Gluten', 'Nuts', 'Peanuts', 'Shellfish', 'Soy']
export const diets = ['Pescatarian', 'Vegan', 'Vegetarian']
