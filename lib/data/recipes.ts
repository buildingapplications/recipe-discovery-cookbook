export type DietaryTag = 'vegan' | 'vegetarian' | 'gluten-free' | 'keto' | 'low-carb' | 'dairy-free';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'breakfast' | 'lunch' | 'dinner' | 'desserts' | 'drinks';
export type Collection = 'favorites' | 'want-to-try' | 'made-it';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  gathered?: boolean;
}

export interface Step {
  id: string;
  stepNumber: number;
  instruction: string;
  duration?: number; // in minutes
  timerLabel?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: Difficulty;
  category: Category;
  dietaryTags: DietaryTag[];
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: NutritionInfo;
  rating: number;
  reviewCount: number;
  isTrending?: boolean;
  createdAt: string;
}

export interface UserRecipeData {
  recipeId: string;
  notes: string;
  userRating: number;
  collections: Collection[];
  dateAdded: string;
}

export const CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳', color: '#F2CC8F' },
  { id: 'lunch', label: 'Lunch', icon: '🥗', color: '#81B29A' },
  { id: 'dinner', label: 'Dinner', icon: '🍝', color: '#E07A5F' },
  { id: 'desserts', label: 'Desserts', icon: '🍰', color: '#F4A6D7' },
  { id: 'drinks', label: 'Drinks', icon: '🍹', color: '#7FCDCD' },
] as const;

export const DIETARY_FILTERS = [
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'low-carb', label: 'Low-Carb', icon: '📉' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
] as const;

export const COLLECTIONS = [
  { id: 'favorites', label: 'Favorites', icon: '❤️', color: '#E07A5F' },
  { id: 'want-to-try', label: 'Want to Try', icon: '🔖', color: '#F2CC8F' },
  { id: 'made-it', label: 'Made It', icon: '✅', color: '#81B29A' },
] as const;

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Avocado Toast with Poached Eggs',
    description: 'Creamy avocado spread on artisan sourdough topped with perfectly poached eggs and microgreens.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    category: 'breakfast',
    dietaryTags: ['vegetarian'],
    ingredients: [
      { id: '1-1', name: 'Sourdough bread', amount: '2', unit: 'slices' },
      { id: '1-2', name: 'Ripe avocado', amount: '1', unit: 'large' },
      { id: '1-3', name: 'Eggs', amount: '2', unit: 'large' },
      { id: '1-4', name: 'Lemon juice', amount: '1', unit: 'tsp' },
      { id: '1-5', name: 'Red pepper flakes', amount: '1/4', unit: 'tsp' },
      { id: '1-6', name: 'Microgreens', amount: '1/4', unit: 'cup' },
      { id: '1-7', name: 'Sea salt', amount: 'to', unit: 'taste' },
      { id: '1-8', name: 'Black pepper', amount: 'to', unit: 'taste' },
    ],
    steps: [
      { id: '1-s1', stepNumber: 1, instruction: 'Toast the sourdough bread until golden and crispy.', duration: 3, timerLabel: 'Toast bread' },
      { id: '1-s2', stepNumber: 2, instruction: 'In a small bowl, mash the avocado with lemon juice, salt, and pepper.' },
      { id: '1-s3', stepNumber: 3, instruction: 'Bring a pot of water to a gentle simmer. Create a small whirlpool and carefully drop in the eggs.', duration: 4, timerLabel: 'Poach eggs' },
      { id: '1-s4', stepNumber: 4, instruction: 'Spread the mashed avocado generously on the toast.' },
      { id: '1-s5', stepNumber: 5, instruction: 'Top with poached eggs, microgreens, and red pepper flakes. Serve immediately.' },
    ],
    nutrition: { calories: 320, protein: 14, carbs: 28, fat: 18, fiber: 7 },
    rating: 4.8,
    reviewCount: 234,
    isTrending: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Mediterranean Quinoa Bowl',
    description: 'Nutritious quinoa bowl loaded with fresh vegetables, chickpeas, feta, and a zesty lemon-herb dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'lunch',
    dietaryTags: ['vegetarian', 'gluten-free'],
    ingredients: [
      { id: '2-1', name: 'Quinoa', amount: '1', unit: 'cup' },
      { id: '2-2', name: 'Chickpeas', amount: '1', unit: 'can (15oz)' },
      { id: '2-3', name: 'Cherry tomatoes', amount: '1', unit: 'cup' },
      { id: '2-4', name: 'Cucumber', amount: '1', unit: 'medium' },
      { id: '2-5', name: 'Red onion', amount: '1/4', unit: 'medium' },
      { id: '2-6', name: 'Kalamata olives', amount: '1/2', unit: 'cup' },
      { id: '2-7', name: 'Feta cheese', amount: '4', unit: 'oz' },
      { id: '2-8', name: 'Fresh parsley', amount: '1/4', unit: 'cup' },
      { id: '2-9', name: 'Olive oil', amount: '3', unit: 'tbsp' },
      { id: '2-10', name: 'Lemon juice', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      { id: '2-s1', stepNumber: 1, instruction: 'Rinse quinoa and cook according to package directions. Let cool.', duration: 20, timerLabel: 'Cook quinoa' },
      { id: '2-s2', stepNumber: 2, instruction: 'Drain and rinse chickpeas. Halve cherry tomatoes and dice cucumber.' },
      { id: '2-s3', stepNumber: 3, instruction: 'Thinly slice red onion and chop fresh parsley.' },
      { id: '2-s4', stepNumber: 4, instruction: 'Whisk together olive oil, lemon juice, salt, and pepper for the dressing.' },
      { id: '2-s5', stepNumber: 5, instruction: 'Combine all ingredients in a large bowl. Toss with dressing and top with crumbled feta.' },
    ],
    nutrition: { calories: 420, protein: 16, carbs: 48, fat: 18, fiber: 9 },
    rating: 4.6,
    reviewCount: 189,
    isTrending: true,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Herb-Crusted Salmon',
    description: 'Perfectly seared salmon with a crispy herb crust, served with roasted vegetables and lemon butter sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'dinner',
    dietaryTags: ['gluten-free', 'keto', 'low-carb'],
    ingredients: [
      { id: '3-1', name: 'Salmon fillets', amount: '4', unit: '6oz pieces' },
      { id: '3-2', name: 'Fresh dill', amount: '2', unit: 'tbsp' },
      { id: '3-3', name: 'Fresh parsley', amount: '2', unit: 'tbsp' },
      { id: '3-4', name: 'Garlic', amount: '3', unit: 'cloves' },
      { id: '3-5', name: 'Panko breadcrumbs', amount: '1/2', unit: 'cup' },
      { id: '3-6', name: 'Butter', amount: '4', unit: 'tbsp' },
      { id: '3-7', name: 'Lemon', amount: '1', unit: 'large' },
      { id: '3-8', name: 'Asparagus', amount: '1', unit: 'bunch' },
      { id: '3-9', name: 'Olive oil', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      { id: '3-s1', stepNumber: 1, instruction: 'Preheat oven to 400°F (200°C). Line a baking sheet with parchment.' },
      { id: '3-s2', stepNumber: 2, instruction: 'Mix herbs, garlic, panko, and 2 tbsp melted butter. Season salmon and press herb mixture on top.' },
      { id: '3-s3', stepNumber: 3, instruction: 'Toss asparagus with olive oil and arrange around salmon on the baking sheet.' },
      { id: '3-s4', stepNumber: 4, instruction: 'Bake for 15-18 minutes until salmon flakes easily.', duration: 18, timerLabel: 'Bake salmon' },
      { id: '3-s5', stepNumber: 5, instruction: 'Make lemon butter sauce by melting remaining butter with lemon juice. Drizzle over salmon.' },
    ],
    nutrition: { calories: 480, protein: 42, carbs: 12, fat: 28, fiber: 3 },
    rating: 4.9,
    reviewCount: 312,
    isTrending: true,
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    title: 'Tiramisu',
    description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    prepTime: 30,
    cookTime: 0,
    servings: 8,
    difficulty: 'Medium',
    category: 'desserts',
    dietaryTags: ['vegetarian'],
    ingredients: [
      { id: '4-1', name: 'Mascarpone cheese', amount: '16', unit: 'oz' },
      { id: '4-2', name: 'Heavy cream', amount: '1.5', unit: 'cups' },
      { id: '4-3', name: 'Egg yolks', amount: '4', unit: 'large' },
      { id: '4-4', name: 'Sugar', amount: '3/4', unit: 'cup' },
      { id: '4-5', name: 'Espresso', amount: '2', unit: 'cups' },
      { id: '4-6', name: 'Ladyfingers', amount: '48', unit: 'pieces' },
      { id: '4-7', name: 'Cocoa powder', amount: '3', unit: 'tbsp' },
      { id: '4-8', name: 'Marsala wine', amount: '1/4', unit: 'cup' },
    ],
    steps: [
      { id: '4-s1', stepNumber: 1, instruction: 'Brew espresso and let it cool. Mix with Marsala wine.' },
      { id: '4-s2', stepNumber: 2, instruction: 'Whisk egg yolks with sugar until thick and pale. Fold in mascarpone.' },
      { id: '4-s3', stepNumber: 3, instruction: 'Whip heavy cream to stiff peaks and fold into mascarpone mixture.' },
      { id: '4-s4', stepNumber: 4, instruction: 'Dip ladyfingers quickly in espresso and layer in a 9x13 dish.' },
      { id: '4-s5', stepNumber: 5, instruction: 'Spread half the cream, add another layer of ladyfingers, then remaining cream.' },
      { id: '4-s6', stepNumber: 6, instruction: 'Refrigerate for at least 4 hours. Dust with cocoa before serving.', duration: 240, timerLabel: 'Chill tiramisu' },
    ],
    nutrition: { calories: 380, protein: 8, carbs: 42, fat: 20, fiber: 1 },
    rating: 4.9,
    reviewCount: 456,
    isTrending: true,
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    title: 'Tropical Mango Smoothie',
    description: 'Refreshing blend of ripe mango, coconut milk, and a hint of lime for the perfect tropical escape.',
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    category: 'drinks',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free'],
    ingredients: [
      { id: '5-1', name: 'Ripe mango', amount: '2', unit: 'cups frozen' },
      { id: '5-2', name: 'Coconut milk', amount: '1', unit: 'cup' },
      { id: '5-3', name: 'Banana', amount: '1', unit: 'medium' },
      { id: '5-4', name: 'Lime juice', amount: '1', unit: 'tbsp' },
      { id: '5-5', name: 'Honey or agave', amount: '1', unit: 'tbsp' },
      { id: '5-6', name: 'Ice', amount: '1/2', unit: 'cup' },
    ],
    steps: [
      { id: '5-s1', stepNumber: 1, instruction: 'Add frozen mango, banana, and coconut milk to a blender.' },
      { id: '5-s2', stepNumber: 2, instruction: 'Add lime juice and honey or agave for sweetness.' },
      { id: '5-s3', stepNumber: 3, instruction: 'Blend on high until completely smooth.', duration: 2, timerLabel: 'Blend smoothie' },
      { id: '5-s4', stepNumber: 4, instruction: 'Add ice if needed and blend again. Pour into glasses and serve immediately.' },
    ],
    nutrition: { calories: 220, protein: 3, carbs: 48, fat: 5, fiber: 4 },
    rating: 4.7,
    reviewCount: 178,
    createdAt: '2024-01-12',
  },
  {
    id: '6',
    title: 'Fluffy Blueberry Pancakes',
    description: 'Light and fluffy buttermilk pancakes bursting with fresh blueberries, served with maple syrup.',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'breakfast',
    dietaryTags: ['vegetarian'],
    ingredients: [
      { id: '6-1', name: 'All-purpose flour', amount: '2', unit: 'cups' },
      { id: '6-2', name: 'Buttermilk', amount: '1.5', unit: 'cups' },
      { id: '6-3', name: 'Eggs', amount: '2', unit: 'large' },
      { id: '6-4', name: 'Butter', amount: '4', unit: 'tbsp melted' },
      { id: '6-5', name: 'Baking powder', amount: '2', unit: 'tsp' },
      { id: '6-6', name: 'Sugar', amount: '2', unit: 'tbsp' },
      { id: '6-7', name: 'Fresh blueberries', amount: '1', unit: 'cup' },
      { id: '6-8', name: 'Maple syrup', amount: 'for', unit: 'serving' },
    ],
    steps: [
      { id: '6-s1', stepNumber: 1, instruction: 'Whisk together flour, baking powder, sugar, and a pinch of salt.' },
      { id: '6-s2', stepNumber: 2, instruction: 'In another bowl, mix buttermilk, eggs, and melted butter.' },
      { id: '6-s3', stepNumber: 3, instruction: 'Combine wet and dry ingredients until just combined. Do not overmix.' },
      { id: '6-s4', stepNumber: 4, instruction: 'Heat a griddle over medium heat. Pour 1/4 cup batter and add blueberries.', duration: 3, timerLabel: 'Cook first side' },
      { id: '6-s5', stepNumber: 5, instruction: 'Flip when bubbles form and cook until golden. Serve with maple syrup.' },
    ],
    nutrition: { calories: 380, protein: 10, carbs: 52, fat: 14, fiber: 2 },
    rating: 4.8,
    reviewCount: 267,
    createdAt: '2024-01-18',
  },
  {
    id: '7',
    title: 'Thai Green Curry',
    description: 'Aromatic coconut curry with tender chicken, crisp vegetables, and fresh Thai basil.',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'dinner',
    dietaryTags: ['gluten-free', 'dairy-free'],
    ingredients: [
      { id: '7-1', name: 'Chicken breast', amount: '1.5', unit: 'lbs' },
      { id: '7-2', name: 'Green curry paste', amount: '3', unit: 'tbsp' },
      { id: '7-3', name: 'Coconut milk', amount: '2', unit: 'cans (14oz)' },
      { id: '7-4', name: 'Bamboo shoots', amount: '1', unit: 'can' },
      { id: '7-5', name: 'Bell peppers', amount: '2', unit: 'medium' },
      { id: '7-6', name: 'Thai basil', amount: '1', unit: 'cup' },
      { id: '7-7', name: 'Fish sauce', amount: '2', unit: 'tbsp' },
      { id: '7-8', name: 'Palm sugar', amount: '1', unit: 'tbsp' },
      { id: '7-9', name: 'Jasmine rice', amount: '2', unit: 'cups' },
    ],
    steps: [
      { id: '7-s1', stepNumber: 1, instruction: 'Cut chicken into bite-sized pieces. Slice bell peppers.' },
      { id: '7-s2', stepNumber: 2, instruction: 'Heat a wok over high heat. Fry curry paste in coconut cream for 2 minutes.', duration: 2, timerLabel: 'Fry paste' },
      { id: '7-s3', stepNumber: 3, instruction: 'Add chicken and cook until no longer pink, about 5 minutes.', duration: 5, timerLabel: 'Cook chicken' },
      { id: '7-s4', stepNumber: 4, instruction: 'Add remaining coconut milk, bamboo shoots, and peppers. Simmer for 15 minutes.', duration: 15, timerLabel: 'Simmer curry' },
      { id: '7-s5', stepNumber: 5, instruction: 'Season with fish sauce and palm sugar. Stir in Thai basil and serve over jasmine rice.' },
    ],
    nutrition: { calories: 520, protein: 38, carbs: 35, fat: 26, fiber: 3 },
    rating: 4.7,
    reviewCount: 198,
    createdAt: '2024-01-14',
  },
  {
    id: '8',
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a molten center, served with vanilla ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'Medium',
    category: 'desserts',
    dietaryTags: ['vegetarian'],
    ingredients: [
      { id: '8-1', name: 'Dark chocolate', amount: '6', unit: 'oz' },
      { id: '8-2', name: 'Butter', amount: '1/2', unit: 'cup' },
      { id: '8-3', name: 'Eggs', amount: '2', unit: 'large' },
      { id: '8-4', name: 'Egg yolks', amount: '2', unit: 'large' },
      { id: '8-5', name: 'Sugar', amount: '1/4', unit: 'cup' },
      { id: '8-6', name: 'Flour', amount: '2', unit: 'tbsp' },
      { id: '8-7', name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { id: '8-8', name: 'Vanilla ice cream', amount: 'for', unit: 'serving' },
    ],
    steps: [
      { id: '8-s1', stepNumber: 1, instruction: 'Preheat oven to 425°F (220°C). Butter and flour four ramekins.' },
      { id: '8-s2', stepNumber: 2, instruction: 'Melt chocolate and butter together in a double boiler. Let cool slightly.' },
      { id: '8-s3', stepNumber: 3, instruction: 'Whisk eggs, yolks, and sugar until thick. Fold in chocolate mixture.' },
      { id: '8-s4', stepNumber: 4, instruction: 'Fold in flour and vanilla. Divide among ramekins.' },
      { id: '8-s5', stepNumber: 5, instruction: 'Bake for 12-14 minutes until edges are firm but center is soft.', duration: 12, timerLabel: 'Bake cakes' },
      { id: '8-s6', stepNumber: 6, instruction: 'Let cool 1 minute, then invert onto plates. Serve immediately with ice cream.' },
    ],
    nutrition: { calories: 450, protein: 8, carbs: 38, fat: 32, fiber: 3 },
    rating: 4.9,
    reviewCount: 389,
    isTrending: true,
    createdAt: '2024-01-20',
  },
  {
    id: '9',
    title: 'Caesar Salad with Grilled Chicken',
    description: 'Crisp romaine lettuce with homemade Caesar dressing, parmesan, croutons, and grilled chicken.',
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
    category: 'lunch',
    dietaryTags: [],
    ingredients: [
      { id: '9-1', name: 'Romaine lettuce', amount: '2', unit: 'hearts' },
      { id: '9-2', name: 'Chicken breast', amount: '2', unit: '6oz pieces' },
      { id: '9-3', name: 'Parmesan cheese', amount: '1/2', unit: 'cup shaved' },
      { id: '9-4', name: 'Croutons', amount: '1', unit: 'cup' },
      { id: '9-5', name: 'Anchovy fillets', amount: '4', unit: 'pieces' },
      { id: '9-6', name: 'Egg yolk', amount: '1', unit: 'large' },
      { id: '9-7', name: 'Garlic', amount: '2', unit: 'cloves' },
      { id: '9-8', name: 'Dijon mustard', amount: '1', unit: 'tsp' },
      { id: '9-9', name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { id: '9-10', name: 'Olive oil', amount: '1/3', unit: 'cup' },
    ],
    steps: [
      { id: '9-s1', stepNumber: 1, instruction: 'Season chicken with salt, pepper, and olive oil. Grill until cooked through.', duration: 12, timerLabel: 'Grill chicken' },
      { id: '9-s2', stepNumber: 2, instruction: 'Make dressing: blend anchovy, garlic, egg yolk, mustard, and lemon juice. Slowly drizzle in olive oil.' },
      { id: '9-s3', stepNumber: 3, instruction: 'Chop romaine lettuce and place in a large bowl.' },
      { id: '9-s4', stepNumber: 4, instruction: 'Slice grilled chicken. Toss lettuce with dressing, parmesan, and croutons.' },
      { id: '9-s5', stepNumber: 5, instruction: 'Top with sliced chicken and extra parmesan. Serve immediately.' },
    ],
    nutrition: { calories: 480, protein: 42, carbs: 18, fat: 28, fiber: 4 },
    rating: 4.6,
    reviewCount: 156,
    createdAt: '2024-01-16',
  },
  {
    id: '10',
    title: 'Matcha Latte',
    description: 'Creamy and earthy Japanese matcha latte made with premium matcha powder and oat milk.',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    category: 'drinks',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free'],
    ingredients: [
      { id: '10-1', name: 'Matcha powder', amount: '2', unit: 'tsp' },
      { id: '10-2', name: 'Hot water', amount: '2', unit: 'tbsp' },
      { id: '10-3', name: 'Oat milk', amount: '1', unit: 'cup' },
      { id: '10-4', name: 'Maple syrup', amount: '1', unit: 'tbsp' },
      { id: '10-5', name: 'Vanilla extract', amount: '1/4', unit: 'tsp' },
    ],
    steps: [
      { id: '10-s1', stepNumber: 1, instruction: 'Sift matcha powder into a bowl to remove clumps.' },
      { id: '10-s2', stepNumber: 2, instruction: 'Add hot water (not boiling) and whisk with a bamboo whisk until smooth.' },
      { id: '10-s3', stepNumber: 3, instruction: 'Heat oat milk and froth until creamy.' },
      { id: '10-s4', stepNumber: 4, instruction: 'Pour matcha into a cup, add maple syrup, and top with frothed oat milk.' },
    ],
    nutrition: { calories: 140, protein: 3, carbs: 24, fat: 4, fiber: 2 },
    rating: 4.5,
    reviewCount: 98,
    createdAt: '2024-01-22',
  },
  {
    id: '11',
    title: 'Shakshuka',
    description: 'North African spiced tomato and pepper stew with perfectly poached eggs, served with crusty bread.',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&q=80',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    category: 'breakfast',
    dietaryTags: ['vegetarian', 'gluten-free'],
    ingredients: [
      { id: '11-1', name: 'Eggs', amount: '6', unit: 'large' },
      { id: '11-2', name: 'Canned tomatoes', amount: '28', unit: 'oz' },
      { id: '11-3', name: 'Bell peppers', amount: '2', unit: 'medium' },
      { id: '11-4', name: 'Onion', amount: '1', unit: 'large' },
      { id: '11-5', name: 'Garlic', amount: '4', unit: 'cloves' },
      { id: '11-6', name: 'Cumin', amount: '1', unit: 'tsp' },
      { id: '11-7', name: 'Paprika', amount: '1', unit: 'tsp' },
      { id: '11-8', name: 'Cayenne pepper', amount: '1/4', unit: 'tsp' },
      { id: '11-9', name: 'Fresh cilantro', amount: '1/4', unit: 'cup' },
      { id: '11-10', name: 'Feta cheese', amount: '2', unit: 'oz' },
    ],
    steps: [
      { id: '11-s1', stepNumber: 1, instruction: 'Dice onion and bell peppers. Mince garlic.' },
      { id: '11-s2', stepNumber: 2, instruction: 'Sauté onion and peppers in olive oil until soft.', duration: 8, timerLabel: 'Sauté vegetables' },
      { id: '11-s3', stepNumber: 3, instruction: 'Add garlic and spices, cook for 1 minute until fragrant.' },
      { id: '11-s4', stepNumber: 4, instruction: 'Add tomatoes and simmer for 10 minutes.', duration: 10, timerLabel: 'Simmer sauce' },
      { id: '11-s5', stepNumber: 5, instruction: 'Make wells in the sauce and crack eggs into them. Cover and cook until eggs are set.', duration: 7, timerLabel: 'Poach eggs' },
      { id: '11-s6', stepNumber: 6, instruction: 'Top with crumbled feta and fresh cilantro. Serve with crusty bread.' },
    ],
    nutrition: { calories: 280, protein: 16, carbs: 22, fat: 14, fiber: 5 },
    rating: 4.8,
    reviewCount: 203,
    createdAt: '2024-01-19',
  },
  {
    id: '12',
    title: 'Keto Cauliflower Fried Rice',
    description: 'Low-carb take on classic fried rice using cauliflower rice, packed with vegetables and scrambled eggs.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'dinner',
    dietaryTags: ['keto', 'low-carb', 'gluten-free'],
    ingredients: [
      { id: '12-1', name: 'Cauliflower rice', amount: '4', unit: 'cups' },
      { id: '12-2', name: 'Eggs', amount: '3', unit: 'large' },
      { id: '12-3', name: 'Sesame oil', amount: '2', unit: 'tbsp' },
      { id: '12-4', name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { id: '12-5', name: 'Garlic', amount: '3', unit: 'cloves' },
      { id: '12-6', name: 'Ginger', amount: '1', unit: 'tbsp' },
      { id: '12-7', name: 'Carrots', amount: '1', unit: 'medium diced' },
      { id: '12-8', name: 'Green peas', amount: '1/2', unit: 'cup' },
      { id: '12-9', name: 'Green onions', amount: '4', unit: 'stalks' },
    ],
    steps: [
      { id: '12-s1', stepNumber: 1, instruction: 'If using fresh cauliflower, pulse in food processor until rice-sized.' },
      { id: '12-s2', stepNumber: 2, instruction: 'Heat sesame oil in a large wok or skillet over high heat.' },
      { id: '12-s3', stepNumber: 3, instruction: 'Scramble eggs and set aside. Add more oil and sauté garlic, ginger, and carrots.', duration: 3, timerLabel: 'Sauté aromatics' },
      { id: '12-s4', stepNumber: 4, instruction: 'Add cauliflower rice and stir-fry for 5-7 minutes until slightly crispy.', duration: 7, timerLabel: 'Cook cauliflower' },
      { id: '12-s5', stepNumber: 5, instruction: 'Add soy sauce, peas, and scrambled eggs. Toss to combine. Garnish with green onions.' },
    ],
    nutrition: { calories: 180, protein: 10, carbs: 12, fat: 11, fiber: 4 },
    rating: 4.5,
    reviewCount: 145,
    createdAt: '2024-01-21',
  },
];
