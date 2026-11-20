import { DarkTheme } from 'expo-router';

const appFonts = {
  regular: {
    fontFamily: 'Montserrat',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'Montserrat',
    fontWeight: '500' as const,
  },
  bold: {
    fontFamily: 'Montserrat',
    fontWeight: '700' as const,
  },
  heavy: {
    fontFamily: 'Montserrat',
    fontWeight: '900' as const,
  },
};

// Cosy dark earth tones: espresso backgrounds, cream text, terracotta and honey accents.
export const theme = {
  ...DarkTheme,
  fonts: appFonts,
  colors: {
    ...DarkTheme.colors,
    background: '#1E1713',
    surface: '#2A201A',
    card: '#33271F',
    border: '#4A3A2E',
    text: '#F4E8DA',
    mutedText: '#B5A08A',
    primary: '#D4895A',
    onPrimary: '#1E1713',
    accent: '#E9B872',
    onAccent: '#1E1713',
    success: '#9CB380',
    danger: '#E07A62',
    notification: '#E07A62',
    tabBarActive: '#E9B872',
    tabBarInactive: '#7D6757',
    drawerBackground: '#2A201A',
    drawerText: '#F4E8DA',
  },
};

export type AppTheme = typeof theme;
