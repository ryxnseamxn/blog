import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Appear } from '@/components/ui/Appear';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { DishItem, Gathering } from '../types';
import { AllergyList } from './AllergyList';
import { ClaimedList } from './ClaimedList';

interface Props {
  gathering: Gathering;
  myDishes: DishItem[];
  onUnclaim: (dishId: string) => void;
  onAddAnother: () => void;
}

export function TableStep({ gathering, myDishes, onUnclaim, onAddAnother }: Props) {
  const { colors } = useAppTheme();
  const othersDishes = gathering.items.filter((dish) => dish.claim && !myDishes.includes(dish));
  const openCount = gathering.items.filter((dish) => !dish.claim).length;

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.springify()}>
        <Card title="🎉 You're bringing" style={{ borderColor: colors.accent, borderWidth: 1 }}>
          {myDishes.map((dish, index) => (
            <Appear key={dish.id} index={index} style={styles.myDish}>
              <AppText style={styles.myEmoji}>{dish.emoji}</AppText>
              <AppText style={styles.myName}>{dish.name}</AppText>
              <Button size="small" variant="secondary" label="Unclaim" onPress={() => onUnclaim(dish.id)} />
            </Appear>
          ))}
        </Card>
      </Animated.View>

      <Card title="Who's bringing what">
        <ClaimedList dishes={othersDishes} emptyMessage="You're the first one in. Trendsetter! ✨" />
        {openCount > 0 ? (
          <AppText style={[styles.open, { color: colors.mutedText }]}>
            {openCount} {openCount === 1 ? 'dish is' : 'dishes are'} still up for grabs
          </AppText>
        ) : null}
      </Card>

      <AllergyList allergies={gathering.allergies} />

      <Button label="Bring something else too" variant="secondary" onPress={onAddAnother} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  myDish: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  myEmoji: {
    fontSize: 28,
  },
  myName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  open: {
    fontSize: 13,
    textAlign: 'center',
  },
});
