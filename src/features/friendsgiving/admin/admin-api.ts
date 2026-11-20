import { request } from '../http';
import type { Gathering, GatheringInput, GatheringSummary, NewDish } from '../types';

const adminPath = (gatheringId?: string) =>
  gatheringId ? `/api/admin/gatherings/${encodeURIComponent(gatheringId)}` : '/api/admin/gatherings';

export const listGatherings = (adminKey: string) => request<GatheringSummary[]>(adminPath(), { adminKey });

export const createGathering = (adminKey: string, input: GatheringInput) =>
  request<Gathering>(adminPath(), { method: 'POST', body: input, adminKey });

export const updateGathering = (adminKey: string, gatheringId: string, input: GatheringInput) =>
  request<Gathering>(adminPath(gatheringId), { method: 'PUT', body: input, adminKey });

export const deleteGathering = (adminKey: string, gatheringId: string) =>
  request<void>(adminPath(gatheringId), { method: 'DELETE', adminKey });

export const addPresetDish = (adminKey: string, gatheringId: string, dish: NewDish) =>
  request<Gathering>(`${adminPath(gatheringId)}/items`, { method: 'POST', body: dish, adminKey });

export const removeDish = (adminKey: string, gatheringId: string, dishId: string) =>
  request<Gathering>(`${adminPath(gatheringId)}/items/${dishId}`, { method: 'DELETE', adminKey });
