import { Stack } from 'expo-router';

export default function FriendsgivingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFF8F0' },
      }}
    >
      <Stack.Screen name="[gatheringId]" />
    </Stack>
  );
}