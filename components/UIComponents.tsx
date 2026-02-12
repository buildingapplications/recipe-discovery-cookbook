import React from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withSequence } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export function GlassCard({ children, className = '', style, intensity = 60, tint = 'light' }: GlassCardProps) {
  return (
    <View 
      className={`overflow-hidden rounded-2xl ${className}`} 
      style={[
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        },
        style,
      ]}
    >
      <BlurView intensity={intensity} tint={tint} className="p-4">
        {children}
      </BlurView>
    </View>
  );
}

interface MetadataCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

export function MetadataCard({ icon, label, value, color = '#E07A5F' }: MetadataCardProps) {
  return (
    <View 
      className="flex-1 bg-card rounded-2xl p-4 items-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </View>
      <Text 
        className="text-lg font-bold text-foreground mb-0.5"
        style={{ fontFamily: 'Inter_700Bold' }}
      >
        {value}
      </Text>
      <Text 
        className="text-xs text-muted-foreground"
        style={{ fontFamily: 'Inter_400Regular' }}
      >
        {label}
      </Text>
    </View>
  );
}

interface NutritionRingProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}

export function NutritionRing({ value, maxValue, label, unit, color, size = 80 }: NutritionRingProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const _strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        {/* Background circle */}
        <View
          className="absolute inset-0 rounded-full"
          style={{ 
            borderWidth: strokeWidth, 
            borderColor: `${color}20`,
          }}
        />
        {/* Progress circle */}
        <View
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: strokeWidth,
            borderColor: color,
            borderRightColor: `${color}20`,
            borderBottomColor: `${color}20`,
            transform: [{ rotate: `${percentage * 3.6 - 90}deg` }],
          }}
        />
        {/* Center content */}
        <View className="absolute inset-0 items-center justify-center">
          <Text 
            className="font-bold text-foreground"
            style={{ fontFamily: 'Inter_700Bold', fontSize: size / 5 }}
          >
            {value}
          </Text>
          <Text 
            className="text-muted-foreground"
            style={{ fontFamily: 'Inter_400Regular', fontSize: size / 8 }}
          >
            {unit}
          </Text>
        </View>
      </View>
      <Text 
        className="text-sm text-muted-foreground mt-2"
        style={{ fontFamily: 'Inter_500Medium' }}
      >
        {label}
      </Text>
    </View>
  );
}

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, className = '' }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withSpring(1, { duration: 800 }),
        withSpring(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={`bg-muted ${className}`}
      style={[
        {
          width: typeof width === 'number' ? width : undefined,
          height,
          borderRadius,
        },
        animatedStyle,
      ]}
    />
  );
}

export function RecipeCardSkeleton() {
  return (
    <View className="bg-card rounded-2xl overflow-hidden" style={{ height: 220 }}>
      <Skeleton height={220} borderRadius={16} />
    </View>
  );
}

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
  size?: number;
}

export function FloatingActionButton({ icon, onPress, color = '#E07A5F', size = 56 }: FloatingActionButtonProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.05, { duration: 1500 }),
        withSpring(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        className="items-center justify-center rounded-full"
        style={({ pressed }) => [
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            shadowColor: color,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          },
        ]}
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
}

interface CollectionButtonProps {
  icon: string;
  label: string;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

export function CollectionButton({ icon, label, color, isActive, onPress }: CollectionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 rounded-xl border ${
        isActive ? 'border-transparent' : 'border-border'
      }`}
      style={({ pressed }) => [
        {
          backgroundColor: isActive ? color : 'transparent',
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Text className="text-lg mr-2">{icon}</Text>
      <Text 
        className={`font-medium ${isActive ? 'text-white' : 'text-foreground'}`}
        style={{ fontFamily: 'Inter_500Medium' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ rating, maxRating = 5, size = 24, editable = false, onRatingChange }: StarRatingProps) {
  return (
    <View className="flex-row items-center">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < rating;
        return (
          <Pressable
            key={index}
            onPress={() => editable && onRatingChange?.(index + 1)}
            disabled={!editable}
            className="mr-1"
          >
            <Text style={{ fontSize: size }}>
              {filled ? '★' : '☆'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center px-8 py-12"
    >
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text 
        className="text-xl font-bold text-foreground text-center mb-2"
        style={{ fontFamily: 'Inter_700Bold' }}
      >
        {title}
      </Text>
      <Text 
        className="text-muted-foreground text-center mb-6"
        style={{ fontFamily: 'Inter_400Regular' }}
      >
        {description}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="bg-terracotta px-6 py-3 rounded-full"
          style={({ pressed }) => [
            { transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
        >
          <Text className="text-white font-semibold" style={{ fontFamily: 'Inter_600SemiBold' }}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
