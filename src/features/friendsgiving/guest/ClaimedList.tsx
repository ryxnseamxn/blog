import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Appear } from '@/components/ui/Appear';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { DishItem } from '../types';

interface Props {
  dishes: DishItem[];
  emptyMessage: string;
}

/** Who's bringing what. */
export function ClaimedList({ dishes, emptyMessage }: Props) {
  const { colors } = useAppTheme();

  if (dishes.length === 0) return <AppText style={{ color: colors.mutedText }}>{emptyMessage}</AppText>;

  return (
    <View>
      {dishes.map((dish, index) => (
        <Appear key={dish.id} index={index} style={[styles.row, { borderBottomColor: colors.border }]}>
          <AppText style={styles.emoji}>{dish.emoji}</AppText>
          <AppText style={styles.name}>{dish.name}</AppText>
          <AppText style={[styles.guest, { color: colors.accent }]}>{dish.claim?.guestName}</AppText>
        </Appear>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emoji: {
    fontSize: 22,
  },
  name: {
    flex: 1,
  },
  guest: {
    fontSize: 13,
    fontWeight: '600',
  },
});
