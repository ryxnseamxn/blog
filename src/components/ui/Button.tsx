import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'regular' | 'small';
  busy?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', size = 'regular', busy = false, disabled = false, style }: Props) {
  const { colors } = useAppTheme();
  const fill = variant === 'danger' ? colors.danger : colors.primary;
  const isOutline = variant === 'secondary';
  const textColor = isOutline ? fill : colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || busy}
      style={({ pressed }) => [
        styles.base,
        size === 'small' && styles.small,
        { borderColor: fill, backgroundColor: isOutline ? 'transparent' : fill },
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText style={[styles.label, size === 'small' && styles.smallLabel, { color: textColor }]}>{label}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  small: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontWeight: '600',
  },
  smallLabel: {
    fontSize: 13,
  },
});
