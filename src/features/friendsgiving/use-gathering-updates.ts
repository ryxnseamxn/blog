import { useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { API_BASE_URL } from '@/config/env';
import type { Gathering } from './types';

interface Handlers {
  onUpdated: (gathering: Gathering) => void;
  onDeleted: () => void;
  onReconnected: () => void;
}

/** Subscribes to the API hub for live changes to one gathering. */
export function useGatheringUpdates(gatheringId: string, { onUpdated, onDeleted, onReconnected }: Handlers) {
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/friendsgiving`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();
    const join = () => connection.invoke('JoinGathering', gatheringId);

    connection.on('GatheringUpdated', onUpdated);
    connection.on('GatheringDeleted', onDeleted);
    // Group membership is per connection: rejoin, then catch up on anything missed while offline.
    // Failures are already reported by the SignalR logger; the screen still works over REST.
    connection.onreconnected(() => join().then(onReconnected).catch(() => {}));
    connection.start().then(join).catch(() => {});

    return () => {
      void connection.stop();
    };
  }, [gatheringId, onUpdated, onDeleted, onReconnected]);
}
