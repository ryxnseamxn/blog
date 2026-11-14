import { useTheme } from 'expo-router';

import { type AppTheme, darkTheme, lightTheme } from '@/theme/colors';

export function useAppTheme(): AppTheme {
  const theme = useTheme();

  // Keep the custom-color type assertion safe if a provider is missing or replaced.
  if (theme !== lightTheme && theme !== darkTheme) {
    throw new Error('useAppTheme must be used under a ThemeProvider with lightTheme or darkTheme.');
  }

  return theme as AppTheme;
}
