import { Drawer } from 'expo-router/drawer';

import { isRouteEnabled } from '@/config/feature-flags';
import { useAppTheme } from '@/hooks/use-app-theme';

const hiddenWhen = (hidden: boolean) => (hidden ? { display: 'none' as const } : undefined);

export default function DrawerLayout() {
  const { colors } = useAppTheme();

  return (
    <Drawer
      screenOptions={{
        drawerType: 'front',
        drawerStyle: {
          width: 270,
          backgroundColor: colors.drawerBackground,
        },
        drawerActiveTintColor: colors.accent,
        drawerInactiveTintColor: colors.drawerText,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: 'Dashboard' }} />
      <Drawer.Screen
        name="admin"
        options={{
          title: 'Admin',
          headerShown: false,
          drawerItemStyle: hiddenWhen(!isRouteEnabled('/admin')),
        }}
      />
    </Drawer>
  );
}
