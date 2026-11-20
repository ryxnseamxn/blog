import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatGatheringDate } from '../format';
import type { GatheringSummary } from '../types';

interface Props {
  gatherings: GatheringSummary[];
  onSelect: (gatheringId: string) => void;
}

export function GatheringList({ gatherings, onSelect }: Props) {
  const { colors } = useAppTheme();

  if (gatherings.length === 0) {
    return <AppText style={{ color: colors.mutedText }}>No gatherings yet. Create one above.</AppText>;
  }

  return (
    <View>
      {gatherings.map((gathering) => (
        <Pressable
          key={gathering.id}
          accessibilityRole="button"
          onPress={() => onSelect(gathering.id)}
          style={({ pressed }) => [styles.row, { borderBottomColor: colors.border, opacity: pressed ? 0.6 : 1 }]}
        >
          <View style={styles.details}>
            <AppText style={styles.name}>{gathering.name}</AppText>
            <AppText style={[styles.meta, { color: colors.mutedText }]}>{formatGatheringDate(gathering.date)}</AppText>
          </View>
          <AppText style={[styles.meta, { color: colors.mutedText }]}>
            {gathering.claimedCount}/{gathering.itemCount} claimed ›
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
  },
});
