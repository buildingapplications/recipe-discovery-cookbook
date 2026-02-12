import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Recipe, Collection, DietaryTag, Category, UserRecipeData, Ingredient } from '../data/recipes';
import { MOCK_RECIPES } from '../data/recipes';

// Recipe Store
interface RecipeState {
  recipes: Recipe[];
  searchQuery: string;
  selectedCategory: Category | null;
  selectedDietaryFilters: DietaryTag[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  toggleDietaryFilter: (filter: DietaryTag) => void;
  clearFilters: () => void;
  getFilteredRecipes: () => Recipe[];
  getTrendingRecipes: () => Recipe[];
  getRecipesByCategory: (category: Category) => Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeState>()((set, get) => ({
  recipes: MOCK_RECIPES,
  searchQuery: '',
  selectedCategory: null,
  selectedDietaryFilters: [],

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleDietaryFilter: (filter) =>
    set((state) => ({
      selectedDietaryFilters: state.selectedDietaryFilters.includes(filter)
        ? state.selectedDietaryFilters.filter((f) => f !== filter)
        : [...state.selectedDietaryFilters, filter],
    })),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: null,
      selectedDietaryFilters: [],
    }),

  getFilteredRecipes: () => {
    const { recipes, searchQuery, selectedCategory, selectedDietaryFilters } = get();
    return recipes.filter((recipe) => {
      const matchesSearch =
        searchQuery === '' ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === null || recipe.category === selectedCategory;

      const matchesDietary =
        selectedDietaryFilters.length === 0 ||
        selectedDietaryFilters.every((filter) => recipe.dietaryTags.includes(filter));

      return matchesSearch && matchesCategory && matchesDietary;
    });
  },

  getTrendingRecipes: () => {
    const { recipes } = get();
    return recipes.filter((recipe) => recipe.isTrending);
  },

  getRecipesByCategory: (category) => {
    const { recipes } = get();
    return recipes.filter((recipe) => recipe.category === category);
  },

  getRecipeById: (id) => {
    const { recipes } = get();
    return recipes.find((recipe) => recipe.id === id);
  },
}));

// Collections Store
interface CollectionsState {
  userRecipeData: Record<string, UserRecipeData>;
  addToCollection: (recipeId: string, collection: Collection) => void;
  removeFromCollection: (recipeId: string, collection: Collection) => void;
  isInCollection: (recipeId: string, collection: Collection) => boolean;
  getCollectionRecipes: (collection: Collection) => string[];
  updateNotes: (recipeId: string, notes: string) => void;
  updateRating: (recipeId: string, rating: number) => void;
  getUserRecipeData: (recipeId: string) => UserRecipeData | undefined;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      userRecipeData: {},

      addToCollection: (recipeId, collection) =>
        set((state) => {
          const existingData = state.userRecipeData[recipeId];
          return {
            userRecipeData: {
              ...state.userRecipeData,
              [recipeId]: {
                recipeId,
                notes: existingData?.notes || '',
                userRating: existingData?.userRating || 0,
                collections: [...(existingData?.collections || []), collection],
                dateAdded: existingData?.dateAdded || new Date().toISOString(),
              },
            },
          };
        }),

      removeFromCollection: (recipeId, collection) =>
        set((state) => {
          const existingData = state.userRecipeData[recipeId];
          if (!existingData) return state;
          return {
            userRecipeData: {
              ...state.userRecipeData,
              [recipeId]: {
                ...existingData,
                collections: existingData.collections.filter((c) => c !== collection),
              },
            },
          };
        }),

      isInCollection: (recipeId, collection) => {
        const data = get().userRecipeData[recipeId];
        return data?.collections.includes(collection) || false;
      },

      getCollectionRecipes: (collection) => {
        const { userRecipeData } = get();
        return Object.values(userRecipeData)
          .filter((data) => data.collections.includes(collection))
          .map((data) => data.recipeId);
      },

      updateNotes: (recipeId, notes) =>
        set((state) => {
          const existingData = state.userRecipeData[recipeId];
          return {
            userRecipeData: {
              ...state.userRecipeData,
              [recipeId]: {
                recipeId,
                notes,
                userRating: existingData?.userRating || 0,
                collections: existingData?.collections || [],
                dateAdded: existingData?.dateAdded || new Date().toISOString(),
              },
            },
          };
        }),

      updateRating: (recipeId, rating) =>
        set((state) => {
          const existingData = state.userRecipeData[recipeId];
          return {
            userRecipeData: {
              ...state.userRecipeData,
              [recipeId]: {
                recipeId,
                notes: existingData?.notes || '',
                userRating: rating,
                collections: existingData?.collections || [],
                dateAdded: existingData?.dateAdded || new Date().toISOString(),
              },
            },
          };
        }),

      getUserRecipeData: (recipeId) => get().userRecipeData[recipeId],
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Shopping List Store
interface ShoppingItem extends Ingredient {
  recipeId: string;
  recipeTitle: string;
  checked: boolean;
}

interface ShoppingListState {
  items: ShoppingItem[];
  addRecipeIngredients: (recipe: Recipe) => void;
  removeRecipeIngredients: (recipeId: string) => void;
  toggleItem: (itemId: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
  getGroupedItems: () => Record<string, ShoppingItem[]>;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],

      addRecipeIngredients: (recipe) =>
        set((state) => {
          const newItems = recipe.ingredients.map((ing) => ({
            ...ing,
            recipeId: recipe.id,
            recipeTitle: recipe.title,
            checked: false,
          }));
          return { items: [...state.items, ...newItems] };
        }),

      removeRecipeIngredients: (recipeId) =>
        set((state) => ({
          items: state.items.filter((item) => item.recipeId !== recipeId),
        })),

      toggleItem: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        })),

      clearChecked: () =>
        set((state) => ({
          items: state.items.filter((item) => !item.checked),
        })),

      clearAll: () => set({ items: [] }),

      getGroupedItems: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => {
            const category = item.name.charAt(0).toUpperCase();
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
          },
          {} as Record<string, ShoppingItem[]>
        );
      },
    }),
    {
      name: 'shopping-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Meal Planning Store
interface MealPlan {
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

interface MealPlanningState {
  mealPlans: MealPlan[];
  addMeal: (date: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => void;
  removeMeal: (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  getMealPlanForDate: (date: string) => MealPlan | undefined;
  getMealPlansForWeek: (startDate: Date) => MealPlan[];
}

export const useMealPlanningStore = create<MealPlanningState>()(
  persist(
    (set, get) => ({
      mealPlans: [],

      addMeal: (date, mealType, recipeId) =>
        set((state) => {
          const existingPlan = state.mealPlans.find((p) => p.date === date);
          if (existingPlan) {
            return {
              mealPlans: state.mealPlans.map((p) =>
                p.date === date ? { ...p, meals: { ...p.meals, [mealType]: recipeId } } : p
              ),
            };
          }
          return {
            mealPlans: [...state.mealPlans, { date, meals: { [mealType]: recipeId } }],
          };
        }),

      removeMeal: (date, mealType) =>
        set((state) => ({
          mealPlans: state.mealPlans.map((p) =>
            p.date === date ? { ...p, meals: { ...p.meals, [mealType]: undefined } } : p
          ),
        })),

      getMealPlanForDate: (date) => get().mealPlans.find((p) => p.date === date),

      getMealPlansForWeek: (startDate) => {
        const { mealPlans } = get();
        const weekDates: string[] = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          weekDates.push(d.toISOString().split('T')[0]);
        }
        return weekDates.map((date) => mealPlans.find((p) => p.date === date) || { date, meals: {} });
      },
    }),
    {
      name: 'meal-planning-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Timer Store
interface ActiveTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  recipeId: string;
  stepId: string;
}

interface TimerState {
  activeTimers: ActiveTimer[];
  startTimer: (timer: Omit<ActiveTimer, 'remainingSeconds' | 'isRunning'>) => void;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  tickTimer: (id: string) => void;
  getActiveTimer: (id: string) => ActiveTimer | undefined;
}

export const useTimerStore = create<TimerState>()((set, get) => ({
  activeTimers: [],

  startTimer: (timer) =>
    set((state) => ({
      activeTimers: [
        ...state.activeTimers,
        { ...timer, remainingSeconds: timer.totalSeconds, isRunning: true },
      ],
    })),

  pauseTimer: (id) =>
    set((state) => ({
      activeTimers: state.activeTimers.map((t) => (t.id === id ? { ...t, isRunning: false } : t)),
    })),

  resumeTimer: (id) =>
    set((state) => ({
      activeTimers: state.activeTimers.map((t) => (t.id === id ? { ...t, isRunning: true } : t)),
    })),

  stopTimer: (id) =>
    set((state) => ({
      activeTimers: state.activeTimers.filter((t) => t.id !== id),
    })),

  tickTimer: (id) =>
    set((state) => ({
      activeTimers: state.activeTimers.map((t) =>
        t.id === id && t.isRunning && t.remainingSeconds > 0
          ? { ...t, remainingSeconds: t.remainingSeconds - 1 }
          : t
      ),
    })),

  getActiveTimer: (id) => get().activeTimers.find((t) => t.id === id),
}));
