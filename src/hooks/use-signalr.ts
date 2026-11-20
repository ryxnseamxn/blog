import { useEffect, useRef, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useApiBaseUrl } from '@/hooks/use-api-base-url';

export interface SignalRConnection {
  connection: HubConnection | null;
  connected: boolean;
}

export function useSignalR(gatheringId: string | null) {
  const apiBaseUrl = useApiBaseUrl();
  const [connected, setConnected] = useState(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!gatheringId) return;

    let cancelled = false;

    const connect = async () => {
      const hubUrl = `${apiBaseUrl}/hubs/friendsgiving`;

      const conn = new HubConnectionBuilder()
        .withUrl(hubUrl)
        .configureLogging(LogLevel.None)
        .build();

      connectionRef.current = conn;

      try {
        await conn.start();
        if (cancelled) return;
        setConnected(true);
        setConnection(conn);

        await conn.invoke('JoinGathering', gatheringId);
      } catch (err) {
        if (!cancelled) console.warn('SignalR connection failed:', err);
      }
    };

    connect();

    return () => {
      cancelled = true;
      connectionRef.current?.stop().catch(() => {});
      connectionRef.current = null;
      setConnected(false);
      setConnection(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatheringId]);

  return { connection, connected };
}