import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Appear } from '@/components/ui/Appear';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { CATEGORY_DETAILS } from '../categories';
import { DishForm } from '../components/DishForm';
import { DishRow } from '../components/DishRow';
import type { DishCategory, Gathering, NewDish } from '../types';
import { AllergyList } from './AllergyList';

interface Props {
  gathering: Gathering;
  category: DishCategory;
  onClaim: (dishId: string) => void;
  onAdd: (dish: NewDish) => Promise<boolean>;
  onBack: () => void;
}

export function DishStep({ gathering, category, onClaim, onAdd, onBack }: Props) {
  const { colors } = useAppTheme();
  const { emoji, label } = CATEGORY_DETAILS[category];
  const openDishes = gathering.items.filter((dish) => dish.category === category && !dish.claim);

  return (
    <View style={styles.container}>
      <Card title={`${emoji} ${label} up for grabs`}>
        {openDishes.length === 0 ? (
          <AppText style={{ color: colors.mutedText }}>Nothing on the list here. Add your own below!</AppText>
        ) : null}
        {openDishes.map((dish, index) => (
          <Appear key={dish.id} index={index}>
            <DishRow dish={dish}>
              <Button size="small" label="I'll bring it" onPress={() => onClaim(dish.id)} />
            </DishRow>
          </Appear>
        ))}
      </Card>

      <Card title={`Bringing your own ${label.toLowerCase()}?`}>
        <DishForm category={category} submitLabel="Add & claim it" onSubmit={onAdd} />
      </Card>

      <AllergyList allergies={gathering.allergies} />

      <Button label="← Pick a different category" variant="secondary" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
