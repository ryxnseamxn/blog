import { useCallback, useEffect, useState } from 'react';

import { getGathering } from './api';
import { ApiError, errorMessage } from './http';
import type { Gathering } from './types';
import { useGatheringUpdates } from './use-gathering-updates';

export type GatheringStatus = 'loading' | 'ready' | 'missing' | 'error';

/**
 * Loads a gathering and keeps it live. Every API mutation returns the full gathering,
 * so `mutate` simply replaces local state with the server's answer.
 */
export function useGathering(gatheringId: string) {
  const [gathering, setGathering] = useState<Gathering | null>(null);
  const [status, setStatus] = useState<GatheringStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    let active = true;
    getGathering(gatheringId).then(
      (loaded) => {
        if (!active) return;
        setGathering(loaded);
        setStatus('ready');
      },
      (e) => {
        if (!active) return;
        setStatus(e instanceof ApiError && e.status === 404 ? 'missing' : 'error');
        setError(errorMessage(e));
      },
    );
    return () => {
      active = false;
    };
  }, [gatheringId, loadCount]);

  const refresh = useCallback(() => setLoadCount((count) => count + 1), []);

  const markDeleted = useCallback(() => {
    setGathering(null);
    setStatus('missing');
  }, []);

  useGatheringUpdates(gatheringId, { onUpdated: setGathering, onDeleted: markDeleted, onReconnected: refresh });

  const mutate = useCallback(async (action: () => Promise<Gathering | void>): Promise<boolean> => {
    setError(null);
    try {
      const updated = await action();
      if (updated) setGathering(updated);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    }
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return { gathering, status, error, refresh, mutate, dismissError };
}
