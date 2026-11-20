import { useLocalSearchParams } from 'expo-router';

import RouteGate from '@/components/RouteGate';
import { GuestGathering } from '@/features/friendsgiving/guest/GuestGathering';

export default function GuestGatheringScreen() {
  const { gatheringId } = useLocalSearchParams<{ gatheringId: string }>();

  return (
    <RouteGate route="/friendsgiving/[gatheringId]">
      <GuestGathering gatheringId={gatheringId} />
    </RouteGate>
  );
}
