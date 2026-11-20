// Mirrors Friendsgiving.Api/Contracts/Dtos.cs.

export const DISH_CATEGORIES = ['main', 'side', 'appetizer', 'dessert', 'drink', 'other'] as const;

export type DishCategory = (typeof DISH_CATEGORIES)[number];

export interface Claim {
  guestName: string;
  note: string | null;
  claimedAt: string;
}

export interface Allergy {
  guestName: string;
  /** Null when the guest answered that they have none. */
  details: string | null;
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
  allergies: Allergy[];
}

export interface GatheringSummary extends Omit<Gathering, 'items' | 'allergies'> {
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
