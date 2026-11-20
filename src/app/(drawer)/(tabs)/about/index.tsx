import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import RouteGate from '@/components/RouteGate';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function AboutScreen() {
  return (
    <RouteGate route="/about">
      <View style={[styles.container, { backgroundColor: useAppTheme().colors.background }]}>
        <AppText style={{ fontSize: 28, fontWeight: '700' }}>
          About
        </AppText>
      </View>
    </RouteGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});