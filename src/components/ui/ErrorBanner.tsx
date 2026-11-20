import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';

interface Props {
  message: string;
  /** When given, tapping the banner dismisses it. */
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: Props) {
  const { colors } = useAppTheme();
  const textStyle = [styles.text, { color: colors.onPrimary }];

  return (
    <Pressable
      accessibilityRole="alert"
      accessibilityHint={onDismiss ? 'Tap to dismiss' : undefined}
      onPress={onDismiss}
      disabled={!onDismiss}
      style={[styles.banner, { backgroundColor: colors.danger }]}
    >
      <AppText style={textStyle}>{message}</AppText>
      {onDismiss ? <AppText style={textStyle}>✕</AppText> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 10,
    padding: 12,
  },
  text: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
