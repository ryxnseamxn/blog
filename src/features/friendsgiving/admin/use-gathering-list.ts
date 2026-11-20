import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { errorMessage } from '../http';
import type { GatheringSummary } from '../types';
import { listGatherings } from './admin-api';

/** All gatherings for the admin list, reloaded whenever the screen regains focus. */
export function useGatheringList(adminKey: string, keyLoaded: boolean) {
  const [gatherings, setGatherings] = useState<GatheringSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!keyLoaded) return;
    try {
      setGatherings(await listGatherings(adminKey));
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [adminKey, keyLoaded]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return { gatherings, error };
}
