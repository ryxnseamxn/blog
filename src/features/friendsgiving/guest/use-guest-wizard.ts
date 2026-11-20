import { useState } from 'react';

import type { DishCategory, DishItem, Gathering } from '../types';

export type WizardStep =
  | { name: 'name' }
  | { name: 'category' }
  | { name: 'dish'; category: DishCategory }
  | { name: 'table' };

export function isClaimedBy(dish: DishItem, guestName: string): boolean {
  return dish.claim?.guestName.trim().toLowerCase() === guestName.trim().toLowerCase();
}

/**
 * Walks a guest through name → category → dish, then rests on the table.
 * The step is derived from the gathering, so a claim made elsewhere moves the guest along too.
 */
export function useGuestWizard(gathering: Gathering, guestName: string) {
  const [category, setCategory] = useState<DishCategory | null>(null);
  const [addingAnother, setAddingAnother] = useState(false);
  const myDishes = guestName ? gathering.items.filter((dish) => isClaimedBy(dish, guestName)) : [];

  return {
    step: currentStep(guestName, myDishes.length > 0 && !addingAnother, category),
    myDishes,
    chooseCategory: setCategory,
    backToCategories: () => setCategory(null),
    addAnother: () => setAddingAnother(true),
    finishPicking: () => {
      setCategory(null);
      setAddingAnother(false);
    },
  };
}

function currentStep(guestName: string, showTable: boolean, category: DishCategory | null): WizardStep {
  if (!guestName) return { name: 'name' };
  if (showTable) return { name: 'table' };
  if (category) return { name: 'dish', category };
  return { name: 'category' };
}
