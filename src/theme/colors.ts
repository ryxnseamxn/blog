import { DarkTheme, DefaultTheme } from 'expo-router';

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

export const palette = {
  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo700: '#4338ca',
  neutral50: '#fafafa',
  neutral900: '#171717',
  white: '#ffffff',
  black: '#000000',
};

export const lightTheme = {
  ...DefaultTheme,
  fonts: appFonts,
  colors: {
    ...DefaultTheme.colors,
    card: '#ffffff',
    background: '#f8f8fc',
    surface: '#ffffff',
    primary: palette.indigo500,
    tabBarActive: palette.indigo500,
    tabBarInactive: '#b0b0c8',
    drawerBackground: '#ffffff',
    text: '#1a1a2e',
  },
};

export type AppTheme = typeof lightTheme;

export const darkTheme: AppTheme = {
  ...DarkTheme,
  fonts: appFonts,
  colors: {
    ...DarkTheme.colors,
    card: '#1a1a2e',
    background: '#0f0f1a',
    surface: '#1a1a2e',
    primary: palette.indigo400,
    tabBarActive: palette.indigo400,
    tabBarInactive: '#4a4a6a',
    drawerBackground: '#13131f',
    text: '#eeeeff',
  },
};