import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { CATEGORY_DETAILS } from '../categories';
import { DISH_CATEGORIES, type DishCategory, type Gathering } from '../types';
import { ClaimedList } from './ClaimedList';

interface Props {
  gathering: Gathering;
  guestName: string;
  onChoose: (category: DishCategory) => void;
  /** Present when the guest already has a dish and can go back to the table. */
  onBack?: () => void;
}

export function CategoryStep({ gathering, guestName, onChoose, onBack }: Props) {
  const { colors } = useAppTheme();
  const openCount = (category: DishCategory) =>
    gathering.items.filter((dish) => dish.category === category && !dish.claim).length;

  return (
    <View style={styles.container}>
      <Card title={`Hi ${guestName}! What kind of dish are you bringing?`}>
        <View style={styles.grid}>
          {DISH_CATEGORIES.map((category, index) => (
            <Animated.View key={category} entering={ZoomIn.delay(index * 60).springify()} style={styles.tileSlot}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onChoose(category)}
                style={({ pressed }) => [
                  styles.tile,
                  { backgroundColor: colors.surface, borderColor: pressed ? colors.accent : colors.border },
                  { transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
              >
                <AppText style={styles.tileEmoji}>{CATEGORY_DETAILS[category].emoji}</AppText>
                <AppText style={styles.tileLabel}>{CATEGORY_DETAILS[category].label}</AppText>
                <AppText style={[styles.tileCount, { color: colors.mutedText }]}>{openCount(category)} open</AppText>
              </Pressable>
            </Animated.View>
          ))}
        </View>
        {onBack ? <Button label="← Back to the table" variant="secondary" onPress={onBack} /> : null}
      </Card>

      <Card title="Already on the table">
        <ClaimedList
          dishes={gathering.items.filter((dish) => dish.claim)}
          emptyMessage="Nothing claimed yet. You're first! 🥇"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tileSlot: {
    width: '31%',
    flexGrow: 1,
  },
  tile: {
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
  },
  tileEmoji: {
    fontSize: 32,
  },
  tileLabel: {
    fontWeight: '700',
  },
  tileCount: {
    fontSize: 12,
  },
});
