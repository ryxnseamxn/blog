// Mirrors Friendsgiving.Api/Contracts/Dtos.cs.

export const DISH_CATEGORIES = ['main', 'side', 'appetizer', 'dessert', 'drink', 'other'] as const;

export type DishCategory = (typeof DISH_CATEGORIES)[number];

export interface Claim {
  guestName: string;
  note: string | null;
  claimedAt: string;
}

export interface DishItem {
  id: string;
  name: string;
  category: DishCategory;
  emoji: string;
  isCustom: boolean;
  sortOrder: number;
  claim: Claim | null;
}

export interface Gathering {
  id: string;
  name: string;
  date: string;
  hostName: string;
  location: string | null;
  items: DishItem[];
}

export interface GatheringSummary extends Omit<Gathering, 'items'> {
  itemCount: number;
  claimedCount: number;
}

export interface GatheringInput {
  name: string;
  date: string;
  hostName: string;
  location: string | null;
}

export interface NewDish {
  name: string;
  category: DishCategory;
  emoji: string;
  claimedBy?: string;
}
