import { Stack } from 'expo-router';

import { useAppTheme } from '@/hooks/use-app-theme';

export default function FriendsgivingLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
