import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Coffee,
  Sun,
  Moon,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { RecipeCard } from '@/components/RecipeCard';
import { useMealPlanningStore, useRecipeStore } from '@/lib/stores';

const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#F2CC8F' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: '#81B29A' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: '#E07A5F' },
] as const;

export default function MealPlannerScreen() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(
    null
  );
  const [showRecipePicker, setShowRecipePicker] = useState(false);

  const { getMealPlansForWeek, addMeal, removeMeal } = useMealPlanningStore();
  const { recipes, getRecipeById } = useRecipeStore();

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [currentWeekStart]);

  const weekMealPlans = useMemo(
    () => getMealPlansForWeek(currentWeekStart),
    [currentWeekStart, getMealPlansForWeek]
  );

  const goToPrevWeek = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }, []);

  const handleAddMeal = useCallback(
    (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
      setSelectedDate(date);
      setSelectedMealType(mealType);
      setShowRecipePicker(true);
    },
    []
  );

  const handleSelectRecipe = useCallback(
    (recipeId: string) => {
      if (selectedDate && selectedMealType) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        addMeal(selectedDate, selectedMealType, recipeId);
        setShowRecipePicker(false);
        setSelectedDate(null);
        setSelectedMealType(null);
      }
    },
    [selectedDate, selectedMealType, addMeal]
  );

  const handleRemoveMeal = useCallback(
    (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      removeMeal(date, mealType);
    },
    [removeMeal]
  );

  const formatDateRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);

    const startMonth = MONTHS[currentWeekStart.getMonth()];
    const endMonth = MONTHS[endDate.getMonth()];

    if (startMonth === endMonth) {
      return `${startMonth} ${currentWeekStart.getDate()} - ${endDate.getDate()}, ${currentWeekStart.getFullYear()}`;
    }
    return `${startMonth} ${currentWeekStart.getDate()} - ${endMonth} ${endDate.getDate()}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-background">
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="px-4 pt-4 pb-2">
          <View className="flex-row items-center mb-1">
            <View className="mr-2">
              <Calendar size={28} color="#E07A5F" />
            </View>
            <Text
              className="text-foreground text-3xl font-bold"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Meal Planner
            </Text>
          </View>
          <Text
            className="text-muted-foreground text-base"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            Plan your weekly meals
          </Text>
        </Animated.View>

        {/* Week Navigation */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="flex-row items-center justify-between px-4 py-4"
        >
          <Pressable
            onPress={goToPrevWeek}
            className="w-10 h-10 bg-card rounded-full items-center justify-center"
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
          >
            <ChevronLeft size={20} color="#374151" />
          </Pressable>
          <Text
            className="text-foreground font-semibold text-base"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {formatDateRange()}
          </Text>
          <Pressable
            onPress={goToNextWeek}
            className="w-10 h-10 bg-card rounded-full items-center justify-center"
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
          >
            <ChevronRight size={20} color="#374151" />
          </Pressable>
        </Animated.View>
      </SafeAreaView>

      {/* Calendar Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {weekDates.map((date, dayIndex) => {
          const dateString = date.toISOString().split('T')[0];
          const mealPlan = weekMealPlans[dayIndex];
          const todayFlag = isToday(date);

          return (
            <Animated.View
              key={dateString}
              entering={FadeInDown.delay(250 + dayIndex * 50).duration(400)}
              className={`mx-4 mb-4 rounded-2xl overflow-hidden ${
                todayFlag ? 'border-2 border-terracotta' : ''
              }`}
            >
              {/* Day Header */}
              <View
                className={`p-4 ${todayFlag ? 'bg-terracotta' : 'bg-card'}`}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: todayFlag ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text
                      className={`text-2xl font-bold mr-2 ${
                        todayFlag ? 'text-white' : 'text-foreground'
                      }`}
                      style={{ fontFamily: 'Inter_700Bold' }}
                    >
                      {date.getDate()}
                    </Text>
                    <View>
                      <Text
                        className={`font-semibold ${todayFlag ? 'text-white' : 'text-foreground'}`}
                        style={{ fontFamily: 'Inter_600SemiBold' }}
                      >
                        {FULL_DAYS[date.getDay()]}
                      </Text>
                      {todayFlag && (
                        <Text className="text-white/80 text-xs">Today</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Meals */}
              <View className="bg-card p-3">
                {MEAL_TYPES.map((mealType) => {
                  const recipeId = mealPlan?.meals[mealType.id as keyof typeof mealPlan.meals];
                  const recipe = recipeId ? getRecipeById(recipeId) : null;
                  const Icon = mealType.icon;

                  return (
                    <View
                      key={mealType.id}
                      className="flex-row items-center py-2 border-b border-border last:border-b-0"
                    >
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: `${mealType.color}20` }}
                      >
                        <Icon size={18} color={mealType.color} />
                      </View>

                      {recipe ? (
                        <Pressable
                          onPress={() => router.push(`/recipe/${recipe.id}`)}
                          className="flex-1 flex-row items-center"
                        >
                          <Image
                            source={{ uri: recipe.imageUrl }}
                            className="w-12 h-12 rounded-lg mr-3"
                            resizeMode="cover"
                          />
                          <View className="flex-1">
                            <Text
                              className="text-foreground font-medium"
                              numberOfLines={1}
                              style={{ fontFamily: 'Inter_500Medium' }}
                            >
                              {recipe.title}
                            </Text>
                            <Text className="text-muted-foreground text-xs">
                              {recipe.prepTime + recipe.cookTime} min
                            </Text>
                          </View>
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleRemoveMeal(dateString, mealType.id as any);
                            }}
                            className="p-2"
                          >
                            <X size={18} color="#9CA3AF" />
                          </Pressable>
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => handleAddMeal(dateString, mealType.id as any)}
                          className="flex-1 flex-row items-center py-2"
                        >
                          <Text className="text-muted-foreground flex-1">{mealType.label}</Text>
                          <View className="w-8 h-8 bg-muted rounded-full items-center justify-center">
                            <Plus size={16} color="#9CA3AF" />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Recipe Picker Modal */}
      <Modal visible={showRecipePicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
            <Pressable onPress={() => setShowRecipePicker(false)}>
              <X size={24} color="#374151" />
            </Pressable>
            <Text
              className="text-foreground font-semibold text-lg"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Select Recipe
            </Text>
            <View className="w-6" />
          </View>

          <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
            <View className="flex-row flex-wrap justify-between">
              {recipes.map((recipe, index) => (
                <Pressable
                  key={recipe.id}
                  onPress={() => handleSelectRecipe(recipe.id)}
                  className="mb-3"
                >
                  <RecipeCard recipe={recipe} onPress={() => handleSelectRecipe(recipe.id)} index={index} variant="masonry" />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
