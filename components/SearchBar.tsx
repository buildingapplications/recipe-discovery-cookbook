import React from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showFilterButton?: boolean;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
}

export function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search recipes...',
  showFilterButton = true,
  suggestions = [],
  onSuggestionPress,
}: SearchBarProps) {
  const hasValue = value.length > 0;
  const showSuggestions = hasValue && suggestions.length > 0;

  return (
    <View className="relative z-10">
      <View 
        className="flex-row items-center bg-card rounded-2xl px-4 py-3 border border-border"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View className="mr-3">
          <Search size={20} color="#9CA3AF" />
        </View>
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-foreground text-base"
          style={{ fontFamily: 'Inter_400Regular' }}
        />

        {hasValue && (
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
            <Pressable
              onPress={() => onChangeText('')}
              className="p-1.5 bg-muted rounded-full mr-2"
            >
              <X size={16} color="#6B7280" />
            </Pressable>
          </Animated.View>
        )}

        {showFilterButton && (
          <Pressable
            onPress={onFilterPress}
            className="p-2 bg-terracotta rounded-xl ml-1"
            style={({ pressed }) => [
              { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <SlidersHorizontal size={18} color="#fff" />
          </Pressable>
        )}
      </View>

      {showSuggestions && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          layout={Layout.springify()}
          className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {suggestions.slice(0, 5).map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => onSuggestionPress?.(suggestion)}
              className="flex-row items-center px-4 py-3 border-b border-border last:border-b-0"
              style={({ pressed }) => [
                { backgroundColor: pressed ? 'rgba(0,0,0,0.05)' : 'transparent' },
              ]}
            >
              <View className="mr-3">
                <Search size={16} color="#9CA3AF" />
              </View>
              <Text className="text-foreground text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

interface FilterChipProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

export function FilterChip({ label, icon, isSelected, onPress, color }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-2.5 rounded-full mr-2 mb-2 border ${
        isSelected 
          ? 'bg-terracotta border-terracotta' 
          : 'bg-card border-border'
      }`}
      style={({ pressed }) => [
        { 
          transform: [{ scale: pressed ? 0.95 : 1 }],
          ...(isSelected && color ? { backgroundColor: color, borderColor: color } : {}),
        },
      ]}
    >
      {icon && (
        <Text className="mr-1.5 text-sm">{icon}</Text>
      )}
      <Text 
        className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-foreground'}`}
        style={{ fontFamily: 'Inter_500Medium' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface CategoryChipProps {
  label: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, icon, color, isSelected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center px-5 py-3 rounded-2xl mr-3 ${
        isSelected ? '' : 'bg-card'
      }`}
      style={({ pressed }) => [
        { 
          transform: [{ scale: pressed ? 0.95 : 1 }],
          backgroundColor: isSelected ? color : undefined,
          shadowColor: isSelected ? color : '#000',
          shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
          shadowOpacity: isSelected ? 0.3 : 0.05,
          shadowRadius: isSelected ? 8 : 4,
          elevation: isSelected ? 6 : 2,
        },
      ]}
    >
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text 
        className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-foreground'}`}
        style={{ fontFamily: 'Inter_600SemiBold' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
