import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';

interface Props {
  message?: string;
  children?: ReactNode;
}

/** Full-screen loading spinner, or a message when one is given. */
export function CenteredMessage({ message, children }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {message ? (
        <AppText style={[styles.message, { color: colors.text }]}>{message}</AppText>
      ) : (
        <ActivityIndicator size="large" color={colors.accent} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});
