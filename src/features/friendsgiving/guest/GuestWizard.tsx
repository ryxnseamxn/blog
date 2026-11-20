import { ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useAppTheme } from '@/hooks/use-app-theme';
import { addDish, claimDish, saveAllergies, unclaimDish } from '../api';
import type { Gathering, NewDish } from '../types';
import { AllergyStep } from './AllergyStep';
import { CategoryStep } from './CategoryStep';
import { DishStep } from './DishStep';
import { GatheringHeader } from './GatheringHeader';
import { NameStep } from './NameStep';
import { TableStep } from './TableStep';
import { useGuestWizard, type WizardStep } from './use-guest-wizard';

interface Props {
  gathering: Gathering;
  guestName: string;
  onNameChange: (name: string) => void;
  mutate: (action: () => Promise<Gathering>) => Promise<boolean>;
  error: string | null;
  onDismissError: () => void;
}

export function GuestWizard({ gathering, guestName, onNameChange, mutate, error, onDismissError }: Props) {
  const { colors } = useAppTheme();
  const wizard = useGuestWizard(gathering, guestName);
  const { step } = wizard;

  const claim = async (dishId: string) => {
    if (await mutate(() => claimDish(gathering.id, dishId, guestName))) wizard.finishPicking();
  };
  const add = async (dish: NewDish) => {
    const saved = await mutate(() => addDish(gathering.id, { ...dish, claimedBy: guestName }));
    if (saved) wizard.finishPicking();
    return saved;
  };
  const unclaim = (dishId: string) => mutate(() => unclaimDish(gathering.id, dishId));
  const shareAllergies = (details: string | null) => mutate(() => saveAllergies(gathering.id, guestName, details));

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: gathering.name }} />
      <GatheringHeader gathering={gathering} />
      {error ? <ErrorBanner message={error} onDismiss={onDismissError} /> : null}

      {/* Keyed by step so each step springs in fresh. No exit animation: on web it would briefly stack both steps. */}
      <Animated.View key={stepKey(step)} entering={FadeInDown.springify()}>
        {step.name === 'name' ? <NameStep onSubmit={onNameChange} /> : null}
        {step.name === 'allergies' ? <AllergyStep guestName={guestName} onSubmit={shareAllergies} /> : null}
        {step.name === 'category' ? (
          <CategoryStep
            gathering={gathering}
            guestName={guestName}
            onChoose={wizard.chooseCategory}
            onBack={wizard.myDishes.length > 0 ? wizard.finishPicking : undefined}
          />
        ) : null}
        {step.name === 'dish' ? (
          <DishStep
            gathering={gathering}
            category={step.category}
            onClaim={claim}
            onAdd={add}
            onBack={wizard.backToCategories}
          />
        ) : null}
        {step.name === 'table' ? (
          <TableStep
            gathering={gathering}
            myDishes={wizard.myDishes}
            onUnclaim={unclaim}
            onAddAnother={wizard.addAnother}
          />
        ) : null}
      </Animated.View>

      {guestName ? (
        <Button label={`Not ${guestName}? Switch`} variant="secondary" size="small" onPress={() => onNameChange('')} />
      ) : null}
    </ScrollView>
  );
}

const stepKey = (step: WizardStep) => (step.name === 'dish' ? `dish-${step.category}` : step.name);

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
});
