import React from 'react';
import { Tabs } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import AnimatedTabIcon from '@/components/AnimatedTabIcon';
import { isRouteEnabled } from '@/config/feature-flags';

const TABS = [
  {
    name: 'index',
    title: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/',
  },
  {
    name: 'about',
    title: 'About',
    icon: 'compass-outline',
    activeIcon: 'compass',
    route: '/about',
  },
  // {
  //   name: 'notifications',
  //   title: 'Notifications',
  //   icon: 'notifications-outline',
  //   activeIcon: 'notifications',
  //   badge: true,
  //   route: '/notifications',
  // },
  // {
  //   name: 'profile',
  //   title: 'Profile',
  //   icon: 'person-outline',
  //   activeIcon: 'person',
  //   route: '/profile',
  // },
];

export default function TabsLayout() {
  const { colors, dark, fonts } = useAppTheme();

  const enabledTabs = TABS.filter((tab) => isRouteEnabled(tab.route));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          elevation: 0,
          shadowColor: dark ? '#000' : '#6060aa',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: dark ? 0.3 : 0.06,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          ...fonts.regular,
          fontSize: 10,
          letterSpacing: 0.1,
        },
      }}
    >
      {enabledTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon
                focused={focused}
                icon={tab.icon}
                activeIcon={tab.activeIcon}
                color={focused ? colors.tabBarActive : colors.tabBarInactive}
                activeColor={colors.tabBarActive}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}