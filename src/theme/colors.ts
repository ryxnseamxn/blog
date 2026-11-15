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
  accent: '#ffd33d',
  onAccent: '#25292e',
  danger: '#f43f5e',
  mutedText: '#6b7280',
};

export const lightTheme = {
  ...DefaultTheme,
  fonts: appFonts,
  colors: {
    ...DefaultTheme.colors,
    card: '#ffffff',
    background: '#895129',
    surface: '#ffffff',
    primary: '#895129',
    tabBarActive: '#242B32',
    tabBarInactive: '#b0b0c8',
    drawerBackground: '#242B32',
    text: '#1a1a2e',
    accent: '#242B32',
    onAccent: '#242B32',
    danger: '#242B32',
    mutedText: '#242B32',
  },
};

export type AppTheme = typeof lightTheme;

export const darkTheme: AppTheme = {
  ...DarkTheme,
  fonts: appFonts,
  colors: {
    ...DarkTheme.colors,
    card: '#1a1a2e',
    background: '#181D21',
    surface: '#242B32',
    primary: '#242B32',
    tabBarActive: '#6D7A96',
    tabBarInactive: '#6D8896',
    drawerBackground: '#242B32',
    text: '#eeeeff',
    accent: '#242B32',
    onAccent: '#242B32',
    danger: '#242B32',
    mutedText: '#242B32',
  },
};