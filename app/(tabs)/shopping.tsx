import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  ShoppingCart,
  Check,
  Trash2,
  ChefHat,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { EmptyState } from '@/components/UIComponents';
import { useShoppingListStore, useRecipeStore } from '@/lib/stores';

export default function ShoppingListScreen() {
  const router = useRouter();
  const { items, toggleItem, clearChecked, clearAll, removeRecipeIngredients } = useShoppingListStore();
  const { getRecipeById } = useRecipeStore();

  const groupedByRecipe = useMemo(() => {
    const groups: Record<string, typeof items> = {};
    items.forEach((item) => {
      if (!groups[item.recipeId]) {
        groups[item.recipeId] = [];
      }
      groups[item.recipeId].push(item);
    });
    return groups;
  }, [items]);

  const checkedCount = useMemo(() => items.filter((i) => i.checked).length, [items]);
  const totalCount = items.length;

  const handleToggleItem = useCallback(
    (itemId: string) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      toggleItem(itemId);
    },
    [toggleItem]
  );

  const handleClearChecked = useCallback(() => {
    Alert.alert(
      'Clear Checked Items',
      `Remove ${checkedCount} checked items from your shopping list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            clearChecked();
          },
        },
      ]
    );
  }, [checkedCount, clearChecked]);

  const handleClearAll = useCallback(() => {
    Alert.alert('Clear All Items', 'Remove all items from your shopping list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          clearAll();
        },
      },
    ]);
  }, [clearAll]);

  const handleRemoveRecipe = useCallback(
    (recipeId: string, recipeTitle: string) => {
      Alert.alert('Remove Recipe Items', `Remove all ingredients from "${recipeTitle}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            removeRecipeIngredients(recipeId);
          },
        },
      ]);
    },
    [removeRecipeIngredients]
  );

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-background">
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="px-4 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center">
              <View className="mr-2">
                <ShoppingCart size={28} color="#E07A5F" />
              </View>
              <Text
                className="text-foreground text-3xl font-bold"
                style={{ fontFamily: 'Inter_700Bold' }}
              >
                Shopping List
              </Text>
            </View>
          </View>
          <Text
            className="text-muted-foreground text-base"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {totalCount > 0
              ? `${checkedCount} of ${totalCount} items gathered`
              : 'Add ingredients from recipes'}
          </Text>
        </Animated.View>

        {/* Progress bar */}
        {totalCount > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} className="px-4 mt-4">
            <View className="bg-muted rounded-full h-2 overflow-hidden">
              <Animated.View
                className="bg-sage h-full rounded-full"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              {checkedCount > 0 && (
                <Pressable onPress={handleClearChecked}>
                  <Text className="text-terracotta text-sm font-medium">Clear checked</Text>
                </Pressable>
              )}
              {totalCount > 0 && (
                <Pressable onPress={handleClearAll}>
                  <Text className="text-destructive text-sm font-medium">Clear all</Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        )}
      </SafeAreaView>

      {/* Shopping List */}
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {totalCount === 0 ? (
          <EmptyState
            icon="🛒"
            title="Your list is empty"
            description="Add ingredients from recipes to start building your shopping list"
            actionLabel="Browse Recipes"
            onAction={() => router.push('/')}
          />
        ) : (
          Object.entries(groupedByRecipe).map(([recipeId, recipeItems], groupIndex) => {
            const recipe = getRecipeById(recipeId);
            const allChecked = recipeItems.every((item) => item.checked);

            return (
              <Animated.View
                key={recipeId}
                entering={FadeInDown.delay(200 + groupIndex * 100).duration(400)}
                className="mb-6"
              >
                {/* Recipe Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                        allChecked ? 'bg-sage' : 'bg-terracotta/10'
                      }`}
                    >
                      {allChecked ? (
                        <Check size={16} color="#fff" />
                      ) : (
                        <ChefHat size={16} color="#E07A5F" />
                      )}
                    </View>
                    <Text
                      className="text-foreground font-semibold flex-1"
                      numberOfLines={1}
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                    >
                      {recipe?.title || recipeItems[0].recipeTitle}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      handleRemoveRecipe(recipeId, recipe?.title || recipeItems[0].recipeTitle)
                    }
                    className="p-2"
                  >
                    <Trash2 size={18} color="#9CA3AF" />
                  </Pressable>
                </View>

                {/* Ingredients */}
                <View className="bg-card rounded-2xl overflow-hidden">
                  {recipeItems.map((item, index) => (
                    <Animated.View
                      key={item.id}
                      entering={FadeIn.delay(250 + groupIndex * 100 + index * 30).duration(300)}
                      layout={Layout.springify()}
                    >
                      <Pressable
                        onPress={() => handleToggleItem(item.id)}
                        className={`flex-row items-center p-4 ${
                          index < recipeItems.length - 1 ? 'border-b border-border' : ''
                        }`}
                        style={({ pressed }) => [
                          { backgroundColor: pressed ? 'rgba(0,0,0,0.02)' : 'transparent' },
                        ]}
                      >
                        <View
                          className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                            item.checked ? 'bg-sage border-sage' : 'border-muted-foreground/30'
                          }`}
                        >
                          {item.checked && <Check size={14} color="#fff" />}
                        </View>
                        <Text
                          className={`flex-1 text-base ${
                            item.checked ? 'text-muted-foreground line-through' : 'text-foreground'
                          }`}
                          style={{ fontFamily: 'Inter_400Regular' }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          className={`font-medium ${
                            item.checked ? 'text-muted-foreground' : 'text-terracotta'
                          }`}
                          style={{ fontFamily: 'Inter_500Medium' }}
                        >
                          {item.amount} {item.unit}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      {totalCount > 0 && checkedCount === totalCount && (
        <Animated.View
          entering={FadeIn.delay(200).duration(400)}
          className="absolute bottom-6 left-4 right-4"
        >
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              Alert.alert('All done!', "You've gathered all your ingredients. Happy cooking!");
            }}
            className="bg-sage py-4 rounded-2xl flex-row items-center justify-center"
            style={{
              shadowColor: '#81B29A',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
            <View className="mr-2">
              <Sparkles size={20} color="#fff" />
            </View>
            <Text className="text-white font-bold text-base" style={{ fontFamily: 'Inter_700Bold' }}>
              All Ingredients Gathered!
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
