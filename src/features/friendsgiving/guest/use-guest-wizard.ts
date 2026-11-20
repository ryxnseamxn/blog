import { useState } from 'react';

import type { DishCategory, DishItem, Gathering } from '../types';

export type WizardStep =
  | { name: 'name' }
  | { name: 'allergies' }
  | { name: 'category' }
  | { name: 'dish'; category: DishCategory }
  | { name: 'table' };

const isSameGuest = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function isClaimedBy(dish: DishItem, guestName: string): boolean {
  return !!dish.claim && isSameGuest(dish.claim.guestName, guestName);
}

function hasAnsweredAllergies(gathering: Gathering, guestName: string): boolean {
  return gathering.allergies.some((allergy) => isSameGuest(allergy.guestName, guestName));
}

/**
 * Walks a guest through name → allergies → category → dish, then rests on the table.
 * The step is derived from the gathering, so a claim made elsewhere moves the guest along too.
 */
export function useGuestWizard(gathering: Gathering, guestName: string) {
  const [category, setCategory] = useState<DishCategory | null>(null);
  const [addingAnother, setAddingAnother] = useState(false);
  const myDishes = guestName ? gathering.items.filter((dish) => isClaimedBy(dish, guestName)) : [];

  return {
    step: currentStep({
      guestName,
      needsAllergies: !!guestName && !hasAnsweredAllergies(gathering, guestName),
      showTable: myDishes.length > 0 && !addingAnother,
      category,
    }),
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

interface WizardProgress {
  guestName: string;
  needsAllergies: boolean;
  showTable: boolean;
  category: DishCategory | null;
}

function currentStep({ guestName, needsAllergies, showTable, category }: WizardProgress): WizardStep {
  if (!guestName) return { name: 'name' };
  if (needsAllergies) return { name: 'allergies' };
  if (showTable) return { name: 'table' };
  if (category) return { name: 'dish', category };
  return { name: 'category' };
}
