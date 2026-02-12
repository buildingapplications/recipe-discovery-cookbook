import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  Dimensions,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Clock,
  ChefHat,
  Users,
  Check,
  Play,
  Pause,
  RotateCcw,
  Share2,
  ShoppingCart,
  CheckCircle2,
  Star,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { MetadataCard, NutritionRing, CollectionButton, StarRating } from '@/components/UIComponents';
import { useRecipeStore, useCollectionsStore, useShoppingListStore, useTimerStore } from '@/lib/stores';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const recipe = useRecipeStore((state) => state.getRecipeById(id || ''));
  const { isInCollection, addToCollection, removeFromCollection, getUserRecipeData, updateRating } = useCollectionsStore();
  const { addRecipeIngredients } = useShoppingListStore();
  const { startTimer, pauseTimer, resumeTimer, stopTimer, tickTimer, activeTimers } = useTimerStore();

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [_notes, setNotes] = useState('');

  const scrollY = useSharedValue(0);

  const userData = useMemo(() => getUserRecipeData(id || ''), [id, getUserRecipeData]);

  useEffect(() => {
    if (userData) {
      setUserRating(userData.userRating);
      setNotes(userData.notes);
    }
  }, [userData]);

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      activeTimers.forEach((timer) => {
        if (timer.isRunning) {
          tickTimer(timer.id);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimers, tickTimer]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HERO_HEIGHT - 100], [0, 1], Extrapolation.CLAMP),
  }));

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, HERO_HEIGHT], [0, HERO_HEIGHT / 2], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [-100, 0], [1.2, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const toggleIngredient = useCallback((ingredientId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  }, []);

  const toggleCollection = useCallback((collection: 'favorites' | 'want-to-try' | 'made-it') => {
    if (!recipe) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (isInCollection(recipe.id, collection)) {
      removeFromCollection(recipe.id, collection);
    } else {
      addToCollection(recipe.id, collection);
    }
  }, [recipe, isInCollection, addToCollection, removeFromCollection]);

  const handleAddToShoppingList = useCallback(() => {
    if (!recipe) return;
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    addRecipeIngredients(recipe);
    Alert.alert('Added to Shopping List', `${recipe.ingredients.length} ingredients added!`);
  }, [recipe, addRecipeIngredients]);

  const handleShare = useCallback(async () => {
    if (!recipe) return;
    try {
      await Share.share({
        title: recipe.title,
        message: `Check out this delicious recipe: ${recipe.title}\n\n${recipe.description}`,
      });
    } catch (error) {
      console.error(error);
    }
  }, [recipe]);

  const handleStartTimer = useCallback((stepId: string, duration: number, label: string) => {
    if (!recipe) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    startTimer({
      id: stepId,
      label,
      totalSeconds: duration * 60,
      recipeId: recipe.id,
      stepId,
    });
  }, [recipe, startTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRatingChange = useCallback((rating: number) => {
    if (!recipe) return;
    setUserRating(rating);
    updateRating(recipe.id, rating);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [recipe, updateRating]);

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground text-lg">Recipe not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4 px-4 py-2 bg-terracotta rounded-lg">
          <Text className="text-white font-medium">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isFavorite = isInCollection(recipe.id, 'favorites');
  const isWantToTry = isInCollection(recipe.id, 'want-to-try');
  const isMadeIt = isInCollection(recipe.id, 'made-it');

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <Animated.View
        style={[headerAnimatedStyle]}
        className="absolute top-0 left-0 right-0 z-20 bg-background/95"
      >
        <SafeAreaView edges={['top']}>
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-card rounded-full items-center justify-center"
            >
              <ArrowLeft size={20} color="#374151" />
            </Pressable>
            <Text
              className="flex-1 text-foreground font-semibold text-lg mx-4"
              numberOfLines={1}
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              {recipe.title}
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => toggleCollection('favorites')}
                className="w-10 h-10 bg-card rounded-full items-center justify-center"
              >
                <Heart size={20} color={isFavorite ? '#E07A5F' : '#374151'} fill={isFavorite ? '#E07A5F' : 'transparent'} />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <Animated.View style={heroAnimatedStyle}>
          <View style={{ height: HERO_HEIGHT }}>
            <Image
              source={{ uri: recipe.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
              locations={[0, 0.3, 1]}
              className="absolute inset-0"
            />

            {/* Back button on image */}
            <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
              <View className="flex-row items-center justify-between px-4 py-2">
                <Pressable
                  onPress={() => router.back()}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                  style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                >
                  <ArrowLeft size={22} color="#fff" />
                </Pressable>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={handleShare}
                    className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                    style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                  >
                    <Share2 size={20} color="#fff" />
                  </Pressable>
                  <Pressable
                    onPress={() => toggleCollection('favorites')}
                    className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                    style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                  >
                    <Heart size={20} color="#fff" fill={isFavorite ? '#E07A5F' : 'transparent'} />
                  </Pressable>
                </View>
              </View>
            </SafeAreaView>

            {/* Title overlay */}
            <View className="absolute bottom-0 left-0 right-0 p-6">
              <Animated.View entering={FadeInUp.delay(200).duration(400)}>
                <View className="flex-row items-center mb-2">
                  <View className="flex-row items-center bg-white/20 px-2.5 py-1 rounded-full mr-2">
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text className="text-white font-semibold text-sm ml-1">{recipe.rating}</Text>
                    <Text className="text-white/70 text-xs ml-1">({recipe.reviewCount})</Text>
                  </View>
                  <View
                    className="px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        recipe.difficulty === 'Easy'
                          ? '#81B29A'
                          : recipe.difficulty === 'Medium'
                          ? '#F2CC8F'
                          : '#E07A5F',
                    }}
                  >
                    <Text className="text-white text-xs font-semibold">{recipe.difficulty}</Text>
                  </View>
                </View>
                <Text
                  className="text-white text-3xl font-bold mb-2"
                  style={{ fontFamily: 'Inter_700Bold' }}
                >
                  {recipe.title}
                </Text>
                <Text className="text-white/80 text-base" numberOfLines={2}>
                  {recipe.description}
                </Text>
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        {/* Content */}
        <View className="bg-background -mt-6 rounded-t-3xl">
          {/* Metadata Cards */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="flex-row gap-3 px-4 pt-8"
          >
            <MetadataCard
              icon={<Clock size={20} color="#E07A5F" />}
              label="Prep Time"
              value={`${recipe.prepTime}m`}
              color="#E07A5F"
            />
            <MetadataCard
              icon={<ChefHat size={20} color="#81B29A" />}
              label="Cook Time"
              value={`${recipe.cookTime}m`}
              color="#81B29A"
            />
            <MetadataCard
              icon={<Users size={20} color="#F2CC8F" />}
              label="Servings"
              value={`${recipe.servings}`}
              color="#F2CC8F"
            />
          </Animated.View>

          {/* Collection buttons */}
          <Animated.View
            entering={FadeInDown.delay(350).duration(400)}
            className="flex-row gap-2 px-4 mt-6"
          >
            <CollectionButton
              icon="❤️"
              label="Favorite"
              color="#E07A5F"
              isActive={isFavorite}
              onPress={() => toggleCollection('favorites')}
            />
            <CollectionButton
              icon="🔖"
              label="Try Later"
              color="#F2CC8F"
              isActive={isWantToTry}
              onPress={() => toggleCollection('want-to-try')}
            />
            <CollectionButton
              icon="✅"
              label="Made It"
              color="#81B29A"
              isActive={isMadeIt}
              onPress={() => toggleCollection('made-it')}
            />
          </Animated.View>

          {/* User Rating */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            className="px-4 mt-6"
          >
            <View className="bg-card rounded-2xl p-4">
              <Text
                className="text-foreground font-semibold text-base mb-3"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Your Rating
              </Text>
              <View className="flex-row items-center">
                <StarRating
                  rating={userRating}
                  size={28}
                  editable
                  onRatingChange={handleRatingChange}
                />
                {userRating > 0 && (
                  <Text className="text-muted-foreground text-sm ml-3">
                    {userRating === 5 ? 'Amazing!' : userRating >= 4 ? 'Great!' : userRating >= 3 ? 'Good' : 'Okay'}
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Dietary Tags */}
          {recipe.dietaryTags.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(400).duration(400)}
              className="flex-row flex-wrap gap-2 px-4 mt-6"
            >
              {recipe.dietaryTags.map((tag) => (
                <View key={tag} className="bg-sage/20 px-3 py-1.5 rounded-full">
                  <Text className="text-sage-700 text-sm font-medium capitalize">{tag}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Ingredients */}
          <Animated.View entering={FadeInDown.delay(450).duration(400)} className="px-4 mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-foreground font-bold text-xl"
                style={{ fontFamily: 'Inter_700Bold' }}
              >
                Ingredients
              </Text>
              <Pressable
                onPress={handleAddToShoppingList}
                className="flex-row items-center bg-terracotta/10 px-3 py-2 rounded-full"
              >
                <View className="mr-2">
                  <ShoppingCart size={16} color="#E07A5F" />
                </View>
                <Text className="text-terracotta font-medium text-sm">Add to List</Text>
              </Pressable>
            </View>

            <View className="bg-card rounded-2xl overflow-hidden">
              {recipe.ingredients.map((ingredient, index) => (
                <Pressable
                  key={ingredient.id}
                  onPress={() => toggleIngredient(ingredient.id)}
                  className={`flex-row items-center p-4 ${
                    index < recipe.ingredients.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                      checkedIngredients.has(ingredient.id)
                        ? 'bg-sage border-sage'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {checkedIngredients.has(ingredient.id) && <Check size={14} color="#fff" />}
                  </View>
                  <Text
                    className={`flex-1 text-base ${
                      checkedIngredients.has(ingredient.id)
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }`}
                    style={{ fontFamily: 'Inter_400Regular' }}
                  >
                    {ingredient.name}
                  </Text>
                  <Text
                    className="text-terracotta font-medium"
                    style={{ fontFamily: 'Inter_500Medium' }}
                  >
                    {ingredient.amount} {ingredient.unit}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Instructions */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)} className="px-4 mt-8">
            <Text
              className="text-foreground font-bold text-xl mb-4"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Instructions
            </Text>

            {/* Progress indicator */}
            <View className="flex-row mb-4">
              {recipe.steps.map((step, index) => (
                <View
                  key={step.id}
                  className={`flex-1 h-1 rounded-full mx-0.5 ${
                    index <= currentStep ? 'bg-terracotta' : 'bg-muted'
                  }`}
                />
              ))}
            </View>

            {recipe.steps.map((step, index) => {
              const timer = activeTimers.find((t) => t.stepId === step.id);
              const isCurrentStep = index === currentStep;

              return (
                <Animated.View
                  key={step.id}
                  entering={FadeInDown.delay(550 + index * 50).duration(400)}
                  className={`mb-4 p-4 rounded-2xl ${
                    isCurrentStep ? 'bg-terracotta/10 border-2 border-terracotta/30' : 'bg-card'
                  }`}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                        index < currentStep
                          ? 'bg-sage'
                          : isCurrentStep
                          ? 'bg-terracotta'
                          : 'bg-muted'
                      }`}
                    >
                      {index < currentStep ? (
                        <Check size={16} color="#fff" />
                      ) : (
                        <Text className="text-white font-bold text-sm">{step.stepNumber}</Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-foreground text-base mb-2"
                        style={{ fontFamily: 'Inter_400Regular' }}
                      >
                        {step.instruction}
                      </Text>

                      {/* Timer for this step */}
                      {step.duration && (
                        <View className="mt-3">
                          {timer ? (
                            <View className="flex-row items-center bg-card rounded-xl p-3">
                              <View className="flex-1">
                                <Text className="text-xs text-muted-foreground mb-1">
                                  {step.timerLabel}
                                </Text>
                                <Text
                                  className={`text-2xl font-bold ${
                                    timer.remainingSeconds <= 30 ? 'text-destructive' : 'text-foreground'
                                  }`}
                                  style={{ fontFamily: 'Inter_700Bold' }}
                                >
                                  {formatTime(timer.remainingSeconds)}
                                </Text>
                              </View>
                              <View className="flex-row gap-2">
                                <Pressable
                                  onPress={() =>
                                    timer.isRunning ? pauseTimer(timer.id) : resumeTimer(timer.id)
                                  }
                                  className="w-10 h-10 bg-terracotta rounded-full items-center justify-center"
                                >
                                  {timer.isRunning ? (
                                    <Pause size={18} color="#fff" />
                                  ) : (
                                    <Play size={18} color="#fff" />
                                  )}
                                </Pressable>
                                <Pressable
                                  onPress={() => stopTimer(timer.id)}
                                  className="w-10 h-10 bg-muted rounded-full items-center justify-center"
                                >
                                  <RotateCcw size={18} color="#6B7280" />
                                </Pressable>
                              </View>
                            </View>
                          ) : (
                            <Pressable
                              onPress={() =>
                                handleStartTimer(step.id, step.duration!, step.timerLabel || 'Timer')
                              }
                              className="flex-row items-center bg-terracotta/10 px-4 py-3 rounded-xl"
                            >
                              <View className="mr-2">
                                <Clock size={18} color="#E07A5F" />
                              </View>
                              <Text className="text-terracotta font-medium">
                                Start {step.duration} min timer
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Step completion button */}
                  {isCurrentStep && index < recipe.steps.length - 1 && (
                    <Pressable
                      onPress={() => setCurrentStep(index + 1)}
                      className="mt-4 bg-terracotta py-3 rounded-xl items-center"
                      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                    >
                      <Text className="text-white font-semibold">Mark as Complete</Text>
                    </Pressable>
                  )}

                  {isCurrentStep && index === recipe.steps.length - 1 && (
                    <Pressable
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }
                        toggleCollection('made-it');
                      }}
                      className="mt-4 bg-sage py-3 rounded-xl items-center flex-row justify-center"
                      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                    >
                      <View className="mr-2">
                        <CheckCircle2 size={20} color="#fff" />
                      </View>
                      <Text className="text-white font-semibold">Finished Cooking!</Text>
                    </Pressable>
                  )}
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Nutrition */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)} className="px-4 mt-8 mb-8">
            <Text
              className="text-foreground font-bold text-xl mb-4"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Nutrition per Serving
            </Text>
            <View className="bg-card rounded-2xl p-6">
              <View className="flex-row justify-between">
                <NutritionRing
                  value={recipe.nutrition.calories}
                  maxValue={800}
                  label="Calories"
                  unit="kcal"
                  color="#E07A5F"
                />
                <NutritionRing
                  value={recipe.nutrition.protein}
                  maxValue={50}
                  label="Protein"
                  unit="g"
                  color="#81B29A"
                />
                <NutritionRing
                  value={recipe.nutrition.carbs}
                  maxValue={100}
                  label="Carbs"
                  unit="g"
                  color="#F2CC8F"
                />
                <NutritionRing
                  value={recipe.nutrition.fat}
                  maxValue={50}
                  label="Fat"
                  unit="g"
                  color="#7FCDCD"
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
