import type {
  AddItemRequest,
  ClaimItemRequest,
  DishItem,
  GatheringWithItems
} from '@/features/friendsgiving/types';

export interface ItemDto {
  id: string;
  name: string;
  category: string;
  emoji: string;
  isCustom: boolean;
  sortOrder: number;
  isClaimed: boolean;
  claimedBy?: string;
  claimedAt?: string;
}

export interface ClaimedDishDto {
  id: string;
  gatheringId: string;
  name: string;
  emoji: string;
  isClaimed: boolean;
  claimedBy: string;
  claimedAt: string;
}

export interface UnclaimResponse {
  isClaimed: boolean;
  claimedBy?: string;
  claimedAt?: string;
}

const API_BASE_URL: string =
  (() => {
    const url = process.env.EXPO_PUBLIC_API_BASE_URL;
    if (typeof url === 'string' && url !== '') return url;
    return 'http://localhost:5000';
})();

export async function getGathering(gatheringId: string): Promise<GatheringWithItems> {
  const response = await fetch(`${API_BASE_URL}/api/gatherings/${gatheringId}`);
  if (!response.ok) throw new Error('Failed to fetch gathering');
  return await response.json();
}

export async function claimItem(
  gatheringId: string,
  dishItemId: string,
  claim: ClaimItemRequest
): Promise<ClaimedDishDto> {
  const response = await fetch(`${API_BASE_URL}/api/gatherings/${gatheringId}/items/${dishItemId}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(claim),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claim failed: ${error}`);
  }

  const data = await response.json();
  return data as ClaimedDishDto;
}

export async function unclaimItem(gatheringId: string, dishItemId: string): Promise<UnclaimResponse> {
  const response = await fetch(`${API_BASE_URL}/api/gatherings/${gatheringId}/items/${dishItemId}/claim`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Unclaim failed: ${error}`);
  }

  const data = await response.json();
  return data as UnclaimResponse;
}

export async function addItem(
  gatheringId: string,
  item: AddItemRequest
): Promise<DishItem> {
  const response = await fetch(`${API_BASE_URL}/api/gatherings/${gatheringId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Add item failed: ${error}`);
  }

  return await response.json();
}

// Type re-exports for backwards compatibility
export type { AddItemRequest, ClaimItemRequest, DishCategory, DishItem, Gathering, GatheringWithItems } from '@/features/friendsgiving/types';