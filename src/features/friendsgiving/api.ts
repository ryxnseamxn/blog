import { request } from './http';
import type { Gathering, NewDish } from './types';

const gatheringPath = (gatheringId: string) => `/api/gatherings/${encodeURIComponent(gatheringId)}`;
const claimPath = (gatheringId: string, dishId: string) => `${gatheringPath(gatheringId)}/items/${dishId}/claim`;

export const getGathering = (gatheringId: string) => request<Gathering>(gatheringPath(gatheringId));

export const addDish = (gatheringId: string, dish: NewDish) =>
  request<Gathering>(`${gatheringPath(gatheringId)}/items`, { method: 'POST', body: dish });

export const claimDish = (gatheringId: string, dishId: string, guestName: string) =>
  request<Gathering>(claimPath(gatheringId, dishId), { method: 'POST', body: { guestName } });

export const unclaimDish = (gatheringId: string, dishId: string) =>
  request<Gathering>(claimPath(gatheringId, dishId), { method: 'DELETE' });

export const saveAllergies = (gatheringId: string, guestName: string, details: string | null) =>
  request<Gathering>(`${gatheringPath(gatheringId)}/allergies`, { method: 'PUT', body: { guestName, details } });
