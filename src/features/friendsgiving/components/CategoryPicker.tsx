import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';
import { CATEGORY_DETAILS } from '../categories';
import { DISH_CATEGORIES, type DishCategory } from '../types';

interface Props {
  value: DishCategory;
  onChange: (category: DishCategory) => void;
}

export function CategoryPicker({ value, onChange }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {DISH_CATEGORIES.map((category) => {
        const selected = category === value;
        const { emoji, label } = CATEGORY_DETAILS[category];
        return (
          <Pressable
            key={category}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(category)}
            style={[
              styles.chip,
              { borderColor: colors.primary, backgroundColor: selected ? colors.primary : 'transparent' },
            ]}
          >
            <AppText style={[styles.label, { color: selected ? colors.onPrimary : colors.primary }]}>
              {emoji} {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
  },
});
