import type {
  AddItemRequest,
  DishCategory,
  DishItem,
  Gathering,
  GatheringWithItems,
} from '@/features/friendsgiving/types';

/**
 * Mock friendsgiving API.
 *
 * Shape mirrors the future .NET API (same endpoints, same response shapes)
 * but is fully local + in-memory for now.
 *
 * When the real backend is ready, swap the bodies of these functions for
 * fetches to your API. Signatures stay identical.
 */

export const FRIENDSGIVING_MENU: {
  name: string;
  category: DishCategory;
  emoji: string;
  sortOrder: number;
}[] = [
  { name: 'Turkey', category: 'main', emoji: '🦃', sortOrder: 1 },
  { name: 'Honey Ham', category: 'main', emoji: '🍖', sortOrder: 2 },
  { name: 'Stuffing', category: 'side', emoji: '🟤', sortOrder: 3 },
  { name: 'Mashed Potatoes', category: 'side', emoji: '🥔', sortOrder: 4 },
  { name: 'Gravy', category: 'side', emoji: '🥘', sortOrder: 5 },
  { name: 'Green Salad', category: 'side', emoji: '🥗', sortOrder: 6 },
  { name: 'Mac & Cheese', category: 'side', emoji: '🧀', sortOrder: 7 },
  { name: 'Dinner Rolls', category: 'side', emoji: '🥠', sortOrder: 8 },
  { name: 'Pies', category: 'dessert', emoji: '🥧', sortOrder: 9 },
  { name: 'Cookies', category: 'dessert', emoji: '🍪', sortOrder: 10 },
  { name: 'Eggnog', category: 'drink', emoji: '🥛', sortOrder: 11 },
  { name: 'Wine', category: 'drink', emoji: '🍷', sortOrder: 12 },
  { name: 'Crudités', category: 'appetizer', emoji: '🥕', sortOrder: 13 },
  { name: 'Dip', category: 'appetizer', emoji: '🧆', sortOrder: 14 },
];

const KNOWN_GATHERINGS: Gathering[] = [
  {
    id: 'friendsgiving-2026',
    name: 'Friendsgiving 2026',
    date: '2026-11-26T18:00:00',
    hostName: 'Ryan',
    location: 'Ryan’s place',
  },
];

const delay = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function itemsFor(gatheringId: string): DishItem[] {
  const base = FRIENDSGIVING_MENU;
  const seededClaims: { index: number; guestName: string }[] = [
    { index: 0, guestName: 'Aunt Linda' },
    { index: 8, guestName: 'Mom' },
  ];
  return base.map((m, i) => {
    const seed = seededClaims.find((s) => s.index === i);
    const claimedBy = seed
      ? { id: `claim-${gatheringId}-item-${i + 1}`, dishItemId: `item-${i + 1}`, guestName: seed.guestName, claimedAt: new Date().toISOString() }
      : null;
    return {
      id: `item-${i + 1}`,
      gatheringId,
      name: m.name,
      category: m.category,
      emoji: m.emoji,
      isCustom: false,
      sortOrder: m.sortOrder,
      claimedBy,
    };
  });
}

export async function getGathering(gatheringId: string): Promise<GatheringWithItems> {
  await delay();
  const known = KNOWN_GATHERINGS.find((g) => g.id === gatheringId);
  const gathering: Gathering = known ?? {
    id: gatheringId,
    name: 'Friendsgiving',
    date: '2026-11-26T18:00:00',
    hostName: 'Ryan',
  };
  const items = itemsFor(gatheringId);
  return { ...gathering, items };
}

export async function addItem(
  gatheringId: string,
  item: AddItemRequest,
): Promise<DishItem> {
  await delay();
  const created: DishItem = {
    id: `custom-${Date.now()}`,
    gatheringId,
    name: item.name,
    category: item.category,
    emoji: item.emoji || '🍽️',
    isCustom: true,
    sortOrder: 1000 + itemsFor(gatheringId).length,
    claimedBy: null,
  };
  return created;
}
