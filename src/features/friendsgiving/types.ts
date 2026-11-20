/**
 * Friendsgiving feature types
 * Shaped for the .NET/Postgres API
 */

export interface Gathering {
  id: string;
  name: string;
  date: string; // ISO date string
  hostName: string;
  location?: string;
}

export interface DishItem {
  id: string;
  gatheringId: string;
  name: string;
  category: DishCategory;
  emoji: string;
  claimedBy: string | null; // guest name, or null if unclaimed
  isClaimed: boolean;
  claimedAt: string | null; // ISO date string
  isCustom: boolean; // true = added by a guest, false = pre-seeded
  sortOrder: number;
}

export interface Claim {
  id: string;
  dishItemId: string;
  guestName: string;
  claimedAt: string; // ISO date string
  note?: string;
}

export type DishCategory =
  | 'main'
  | 'side'
  | 'dessert'
  | 'drink'
  | 'appetizer'
  | 'other';

export interface GatheringWithItems extends Gathering {
  items: DishItem[];
}

// Request/response shapes matching future API
export interface CreateGatheringRequest {
  name: string;
  date: string;
  hostName: string;
  location?: string;
}

export interface ClaimItemRequest {
  guestName: string;
  note?: string;
}

export interface AddItemRequest {
  name: string;
  category: DishCategory;
  emoji: string;
}

export interface UpdateGuestNameRequest {
  guestName: string;
}

// Local storage shape (per device, per gathering)
export interface LocalGuestState {
  guestName: string;
  claimedDishIds: string[];
  addedDishIds: string[];
}
