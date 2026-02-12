import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Heart, Bookmark, CheckCircle, FolderHeart } from 'lucide-react-native';

import { RecipeCard } from '@/components/RecipeCard';
import { EmptyState } from '@/components/UIComponents';
import { useRecipeStore, useCollectionsStore } from '@/lib/stores';
import type { Collection } from '@/lib/data/recipes';

const COLLECTION_TABS = [
  { id: 'favorites', label: 'Favorites', icon: Heart, color: '#E07A5F', emoji: '❤️' },
  { id: 'want-to-try', label: 'Want to Try', icon: Bookmark, color: '#F2CC8F', emoji: '🔖' },
  { id: 'made-it', label: 'Made It', icon: CheckCircle, color: '#81B29A', emoji: '✅' },
] as const;

export default function CollectionsScreen() {
  const router = useRouter();
  const [activeCollection, setActiveCollection] = useState<Collection>('favorites');

  const { getRecipeById } = useRecipeStore();
  const { getCollectionRecipes } = useCollectionsStore();

  const collectionRecipeIds = useMemo(
    () => getCollectionRecipes(activeCollection),
    [activeCollection, getCollectionRecipes]
  );

  const collectionRecipes = useMemo(
    () => collectionRecipeIds.map((id) => getRecipeById(id)).filter(Boolean),
    [collectionRecipeIds, getRecipeById]
  );

  const handleRecipePress = useCallback(
    (id: string) => {
      router.push(`/recipe/${id}`);
    },
    [router]
  );

  const activeTab = COLLECTION_TABS.find((t) => t.id === activeCollection)!;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-background">
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="px-4 pt-4 pb-2">
          <View className="flex-row items-center mb-1">
            <View className="mr-2">
              <FolderHeart size={28} color="#E07A5F" />
            </View>
            <Text
              className="text-foreground text-3xl font-bold"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Collections
            </Text>
          </View>
          <Text
            className="text-muted-foreground text-base"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            Your saved and organized recipes
          </Text>
        </Animated.View>

        {/* Collection Tabs */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="px-4 mt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {COLLECTION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCollection === tab.id;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveCollection(tab.id as Collection)}
                  className={`flex-row items-center px-5 py-3 rounded-2xl mr-3 ${
                    isActive ? '' : 'bg-card border border-border'
                  }`}
                  style={[
                    isActive && { backgroundColor: tab.color },
                    {
                      shadowColor: isActive ? tab.color : '#000',
                      shadowOffset: { width: 0, height: isActive ? 4 : 2 },
                      shadowOpacity: isActive ? 0.3 : 0.05,
                      shadowRadius: isActive ? 8 : 4,
                      elevation: isActive ? 6 : 2,
                    },
                  ]}
                >
                  <View className="mr-2">
                    <Icon
                      size={18}
                      color={isActive ? '#fff' : tab.color}
                      fill={isActive ? '#fff' : 'transparent'}
                    />
                  </View>
                  <Text
                    className={`font-semibold ${isActive ? 'text-white' : 'text-foreground'}`}
                    style={{ fontFamily: 'Inter_600SemiBold' }}
                  >
                    {tab.label}
                  </Text>
                  <View
                    className={`ml-2 px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-muted'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isActive ? 'text-white' : 'text-muted-foreground'
                      }`}
                    >
                      {getCollectionRecipes(tab.id as Collection).length}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      {/* Recipe List */}
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {collectionRecipes.length === 0 ? (
          <EmptyState
            icon={activeTab.emoji}
            title={`No ${activeTab.label} yet`}
            description={
              activeCollection === 'favorites'
                ? "Start exploring and tap the heart icon to save your favorite recipes!"
                : activeCollection === 'want-to-try'
                ? 'Bookmark recipes you want to cook later!'
                : "Mark recipes as 'Made It' when you cook them!"
            }
            actionLabel="Discover Recipes"
            onAction={() => router.push('/')}
          />
        ) : (
          <Animated.View layout={Layout.springify()} className="flex-row flex-wrap justify-between">
            {collectionRecipes.map((recipe, index) => (
              <Animated.View
                key={recipe!.id}
                entering={FadeIn.delay(index * 80).duration(400)}
                className="mb-3"
              >
                <RecipeCard
                  recipe={recipe!}
                  onPress={() => handleRecipePress(recipe!.id)}
                  index={index}
                  variant="masonry"
                />
              </Animated.View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
