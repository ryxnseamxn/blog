import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function AboutScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText style={{ fontSize: 28, fontWeight: '700' }}>
        About
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
