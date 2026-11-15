import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { useAppTheme } from '@/hooks/use-app-theme';

export default function NotFoundScreen() {
  const { colors } = useAppTheme();

  return (
    <>
      <Drawer.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Link href="/" style={[styles.button, { color: colors.text }]}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});