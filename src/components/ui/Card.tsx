import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';

interface Props extends ViewProps {
  title?: string;
}

export function Card({ title, style, children, ...viewProps }: Props) {
  const { colors } = useAppTheme();

  return (
    <View {...viewProps} style={[styles.card, { backgroundColor: colors.card }, style]}>
      {title ? <AppText style={styles.title}>{title}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
