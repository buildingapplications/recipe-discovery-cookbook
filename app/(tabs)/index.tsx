import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChefHat, Sparkles } from 'lucide-react-native';

import { RecipeCard, TrendingRecipeCard } from '@/components/RecipeCard';
import { SearchBar, CategoryChip, FilterChip } from '@/components/SearchBar';
import { EmptyState } from '@/components/UIComponents';
import { useRecipeStore } from '@/lib/stores';
import { CATEGORIES, DIETARY_FILTERS } from '@/lib/data/recipes';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDietaryFilters,
    toggleDietaryFilter,
    getFilteredRecipes,
    getTrendingRecipes,
    recipes,
  } = useRecipeStore();

  const filteredRecipes = useMemo(() => getFilteredRecipes(), [getFilteredRecipes]);
  const trendingRecipes = useMemo(() => getTrendingRecipes(), [getTrendingRecipes]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return recipes
      .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((r) => r.title)
      .slice(0, 5);
  }, [searchQuery, recipes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleRecipePress = useCallback((id: string) => {
    router.push(`/recipe/${id}`);
  }, [router]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : (categoryId as any));
  }, [selectedCategory, setSelectedCategory]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={['#E07A5F', '#F2CC8F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-8 px-4"
        style={{
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <SafeAreaView edges={['top']}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text 
                  className="text-white/80 text-base mb-1"
                  style={{ fontFamily: 'Inter_400Regular' }}
                >
                  What would you like to cook?
                </Text>
                <View className="flex-row items-center">
                  <Text 
                    className="text-white text-3xl font-bold mr-2"
                    style={{ fontFamily: 'Inter_700Bold' }}
                  >
                    Recipe Discovery
                  </Text>
                  <View>
                    <ChefHat size={28} color="#fff" />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(500)} className="mt-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFilterPress={() => setShowFilters(!showFilters)}
              suggestions={suggestions}
              onSuggestionPress={(s) => setSearchQuery(s)}
              placeholder="Search for recipes, ingredients..."
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E07A5F" />
        }
      >
        {/* Dietary Filters */}
        {showFilters && (
          <Animated.View entering={FadeIn.duration(300)} className="px-4 pt-4">
            <Text 
              className="text-foreground font-semibold text-sm mb-3"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Dietary Preferences
            </Text>
            <View className="flex-row flex-wrap">
              {DIETARY_FILTERS.map((filter) => (
                <FilterChip
                  key={filter.id}
                  label={filter.label}
                  icon={filter.icon}
                  isSelected={selectedDietaryFilters.includes(filter.id as any)}
                  onPress={() => toggleDietaryFilter(filter.id as any)}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mt-6">
          <Text 
            className="text-foreground font-bold text-lg px-4 mb-4"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Categories
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label}
                icon={category.icon}
                color={category.color}
                isSelected={selectedCategory === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Section */}
        {trendingRecipes.length > 0 && !searchQuery && !selectedCategory && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} className="mt-8">
            <View className="flex-row items-center justify-between px-4 mb-4">
              <View className="flex-row items-center">
                <View className="mr-2">
                  <Sparkles size={20} color="#E07A5F" />
                </View>
                <Text 
                  className="text-foreground font-bold text-lg"
                  style={{ fontFamily: 'Inter_700Bold' }}
                >
                  Trending Now
                </Text>
              </View>
              <Pressable>
                <Text 
                  className="text-terracotta text-sm font-medium"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  See all
                </Text>
              </Pressable>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {trendingRecipes.map((recipe, index) => (
                <TrendingRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => handleRecipePress(recipe.id)}
                  index={index}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Recipe Grid */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} className="mt-8 px-4">
          <Text 
            className="text-foreground font-bold text-lg mb-4"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            {selectedCategory 
              ? `${CATEGORIES.find(c => c.id === selectedCategory)?.label} Recipes`
              : searchQuery 
              ? 'Search Results' 
              : 'All Recipes'}
          </Text>

          {filteredRecipes.length === 0 ? (
            <EmptyState
              icon="🍽️"
              title="No recipes found"
              description="Try adjusting your filters or search query"
              actionLabel="Clear filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            />
          ) : (
            <View className="flex-row flex-wrap justify-between pb-8">
              {filteredRecipes.map((recipe, index) => (
                <View key={recipe.id} className="mb-3">
                  <RecipeCard
                    recipe={recipe}
                    onPress={() => handleRecipePress(recipe.id)}
                    index={index}
                    variant="masonry"
                  />
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
