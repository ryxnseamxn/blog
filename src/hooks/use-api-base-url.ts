import Constants from 'expo-constants';

export function useApiBaseUrl(): string {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const url = extra?.EXPO_PUBLIC_API_BASE_URL;
  if (typeof url === 'string' && url !== '') return url;
  return 'http://localhost:5000';
}