import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { DishItem } from '../types';

interface Props {
  dish: DishItem;
  /** Buttons shown on the right, e.g. claim or remove. */
  children?: ReactNode;
}

export function DishRow({ dish, children }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <AppText style={styles.emoji}>{dish.emoji}</AppText>
      <View style={styles.details}>
        <AppText style={[styles.name, dish.claim && styles.claimed]}>{dish.name}</AppText>
        <AppText style={[styles.status, { color: colors.mutedText }]}>
          {dish.claim ? `${dish.claim.guestName} is bringing this` : `Up for grabs · ${dish.category}`}
        </AppText>
      </View>
      <View style={styles.actions}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emoji: {
    fontSize: 26,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  claimed: {
    textDecorationLine: 'line-through',
  },
  status: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
});
