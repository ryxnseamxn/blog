import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Allergy } from '../types';

/** Guests' allergies, so whoever's cooking can plan around them. Hidden when nobody has any. */
export function AllergyList({ allergies }: { allergies: Allergy[] }) {
  const { colors } = useAppTheme();
  const withDetails = allergies.filter((allergy) => allergy.details);

  if (withDetails.length === 0) return null;

  return (
    <Card title="⚠️ Allergies to keep in mind">
      {withDetails.map((allergy) => (
        <View key={allergy.guestName} style={[styles.row, { borderBottomColor: colors.border }]}>
          <AppText style={[styles.guest, { color: colors.accent }]}>{allergy.guestName}</AppText>
          <AppText style={styles.details}>{allergy.details}</AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  guest: {
    fontWeight: '600',
  },
  details: {
    flex: 1,
  },
});
