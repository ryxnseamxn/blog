import type { DishCategory } from './types';

export const CATEGORY_DETAILS: Record<DishCategory, { emoji: string; label: string }> = {
  main: { emoji: '🦃', label: 'Main' },
  side: { emoji: '🥔', label: 'Side' },
  appetizer: { emoji: '🧀', label: 'Appetizer' },
  dessert: { emoji: '🥧', label: 'Dessert' },
  drink: { emoji: '🍷', label: 'Drink' },
  other: { emoji: '🍽️', label: 'Other' },
};
