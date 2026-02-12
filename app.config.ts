import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Recipe Discovery Cookbook',
  slug: 'recipe-discovery-cookbook',
  newArchEnabled: true,
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  scheme: 'recipe-discovery-cookbook',
  runtimeVersion: {
    policy: 'appVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    supportsTablet: true,
    bundleIdentifier: 'me.karl.recipediscoverycookbook',
  },
  android: {
    package: 'me.karl.recipediscoverycookbook',
  },
  plugins: [
    'expo-router',
    'expo-font',
    ...(process.env.EXPO_PLATFORM === 'native'
      ? [['expo-dev-client', { launchMode: 'most-recent' }]]
      : []),
  ] as NonNullable<ExpoConfig['plugins']>,
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '',
    },
  },
  owner: '*',
});
