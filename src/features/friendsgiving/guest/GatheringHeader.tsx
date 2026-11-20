import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatGatheringDate } from '../format';
import type { Gathering } from '../types';

export function GatheringHeader({ gathering }: { gathering: Gathering }) {
  const { colors } = useAppTheme();
  const detailStyle = [styles.detail, { color: colors.mutedText }];

  return (
    <View style={styles.container}>
      <AppText style={[styles.title, { color: colors.accent }]}>🍂 {gathering.name}</AppText>
      <AppText style={detailStyle}>📅 {formatGatheringDate(gathering.date)}</AppText>
      <AppText style={detailStyle}>🏡 Hosted by {gathering.hostName}</AppText>
      {gathering.location ? <AppText style={detailStyle}>📍 {gathering.location}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
  },
});
