import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Appear } from '@/components/ui/Appear';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { confirm } from '@/utils/confirm';
import { unclaimDish } from '../api';
import { CategoryPicker } from '../components/CategoryPicker';
import { DishForm } from '../components/DishForm';
import { DishRow } from '../components/DishRow';
import type { DishCategory, DishItem, Gathering } from '../types';
import { addPresetDish, removeDish } from './admin-api';

interface Props {
  gathering: Gathering;
  adminKey: string;
  mutate: (action: () => Promise<Gathering>) => Promise<boolean>;
}

export function AdminDishList({ gathering, adminKey, mutate }: Props) {
  const { colors } = useAppTheme();
  const [category, setCategory] = useState<DishCategory>('main');

  const remove = async (dish: DishItem) => {
    const claimNote = dish.claim ? ` ${dish.claim.guestName} has claimed it.` : '';
    if (await confirm(`Remove ${dish.name}?`, `This takes it off the table.${claimNote}`, 'Remove')) {
      await mutate(() => removeDish(adminKey, gathering.id, dish.id));
    }
  };

  return (
    <Card title="Dishes">
      {gathering.items.length === 0 ? (
        <AppText style={{ color: colors.mutedText }}>Add the dishes you want guests to sign up for.</AppText>
      ) : null}
      {gathering.items.map((dish, index) => (
        <Appear key={dish.id} index={index}>
          <DishRow dish={dish}>
            {dish.claim ? (
              <Button
                size="small"
                variant="secondary"
                label="Clear"
                onPress={() => mutate(() => unclaimDish(gathering.id, dish.id))}
              />
            ) : null}
            <Button size="small" variant="danger" label="Remove" onPress={() => remove(dish)} />
          </DishRow>
        </Appear>
      ))}
      <CategoryPicker value={category} onChange={setCategory} />
      <DishForm
        category={category}
        submitLabel="Add dish"
        onSubmit={(dish) => mutate(() => addPresetDish(adminKey, gathering.id, dish))}
      />
    </Card>
  );
}
