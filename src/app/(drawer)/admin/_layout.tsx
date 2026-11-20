import { Stack } from 'expo-router';
import { DrawerToggleButton } from 'expo-router/drawer';

import { useAppTheme } from '@/hooks/use-app-theme';

export default function AdminLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Admin', headerLeft: () => <DrawerToggleButton tintColor={colors.text} /> }}
      />
      <Stack.Screen name="[gatheringId]" options={{ title: 'Gathering' }} />
    </Stack>
  );
}
