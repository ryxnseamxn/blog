import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function DrawerLayout() {
  const { colors } = useAppTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        drawerStyle: {
          width: 270,
          backgroundColor: colors.drawerBackground,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        // overlayColor: 'rgba(0,0,0,0.6)',
        // swipeEdgeWidth: 40,
      }}
    >
      {/* Target internal tab group layout matching file path semantics */}
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
            title: "Dashboard", 
            drawerLabel: 'Dashboard',
        }} 
      />
      {/* Standalone layout entry outside of the core bottom tab bar */}
      {/* <Drawer.Screen 
        name="settings" 
        options={{ drawerLabel: 'Settings' }} 
      /> */}
    </Drawer>
  );
}