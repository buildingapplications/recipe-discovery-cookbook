import React from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Clock, ChefHat, Star } from 'lucide-react-native';
import type { Recipe } from '@/lib/data/recipes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_PADDING = 16;

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  index?: number;
  variant?: 'masonry' | 'horizontal' | 'full';
}

const difficultyColors = {
  Easy: '#81B29A',
  Medium: '#F2CC8F',
  Hard: '#E07A5F',
};

export function RecipeCard({ recipe, onPress, index = 0, variant = 'masonry' }: RecipeCardProps) {
  const isLeftColumn = index % 2 === 0;
  const cardWidth = variant === 'masonry' 
    ? (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2
    : variant === 'horizontal'
    ? 200
    : SCREEN_WIDTH - CARD_PADDING * 2;

  const cardHeight = variant === 'masonry' 
    ? (isLeftColumn ? 240 : 200) + (index % 3) * 20
    : variant === 'horizontal'
    ? 220
    : 280;

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 80).duration(400).springify()}
      style={{ width: cardWidth }}
    >
      <Pressable
        onPress={onPress}
        className="overflow-hidden rounded-2xl bg-card"
        style={({ pressed }) => [
          { 
            height: cardHeight,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          },
        ]}
      >
        <Image
          source={{ uri: recipe.imageUrl }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          locations={[0.3, 1]}
          className="absolute inset-0"
        />

        {/* Difficulty badge */}
        <View 
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: difficultyColors[recipe.difficulty] }}
        >
          <Text className="text-white text-xs font-semibold">
            {recipe.difficulty}
          </Text>
        </View>

        {/* Rating badge */}
        <View className="absolute top-3 left-3 flex-row items-center bg-black/40 px-2 py-1 rounded-full">
          <View className="mr-1">
            <Star size={12} color="#FFD700" fill="#FFD700" />
          </View>
          <Text className="text-white text-xs font-semibold">{recipe.rating}</Text>
        </View>

        {/* Content overlay */}
        <View className="absolute bottom-0 left-0 right-0 p-3">
          <Text 
            className="text-white font-bold text-base mb-1.5"
            numberOfLines={2}
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {recipe.title}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <View className="mr-1">
                <Clock size={12} color="#fff" />
              </View>
              <Text className="text-white/90 text-xs">
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="mr-1">
                <ChefHat size={12} color="#fff" />
              </View>
              <Text className="text-white/90 text-xs">
                {recipe.servings} servings
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface TrendingRecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  index?: number;
}

export function TrendingRecipeCard({ recipe, onPress, index = 0 }: TrendingRecipeCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400).springify()}>
      <Pressable
        onPress={onPress}
        className="w-52 h-64 rounded-3xl overflow-hidden mr-4"
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.97 : 1 }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          },
        ]}
      >
        <Image
          source={{ uri: recipe.imageUrl }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']}
          locations={[0.4, 1]}
          className="absolute inset-0"
        />

        {/* Trending badge */}
        <View className="absolute top-3 left-3 bg-terracotta px-3 py-1.5 rounded-full flex-row items-center">
          <Text className="text-white text-xs font-bold">🔥 Trending</Text>
        </View>

        {/* Content */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text 
            className="text-white font-bold text-lg mb-2"
            numberOfLines={2}
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            {recipe.title}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <View>
                <Star size={14} color="#FFD700" fill="#FFD700" />
              </View>
              <Text className="text-white font-semibold text-sm">{recipe.rating}</Text>
              <Text className="text-white/70 text-xs">({recipe.reviewCount})</Text>
            </View>

            <View className="flex-row items-center gap-1">
              <View>
                <Clock size={14} color="#fff" />
              </View>
              <Text className="text-white/90 text-sm">
                {recipe.prepTime + recipe.cookTime}m
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
